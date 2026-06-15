"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { headers } from "next/headers"
import { hashIP } from "@/lib/utils/privacy"
import { redis, CACHE_KEYS } from "@/lib/redis"

/**
 * Submits a new lead for a project with IP capture and Visitor linking.
 */
export async function submitLead(formData: FormData) {
  const projectId = formData.get("projectId")?.toString() ?? ""
  const name = formData.get("name")?.toString() ?? ""
  const email = formData.get("email")?.toString() ?? ""
  const phone = formData.get("phone")?.toString() ?? ""

  // 1. Strict Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailRegex.test(email)) {
    return { success: false, error: "Invalid name or email address" }
  }

  const supabase = await createServerSupabaseClient();
  const headersList = await headers();
  const rawIp = headersList.get("x-forwarded-for") || "unknown";

  const ipHash = await hashIP(rawIp);

  // 1.5 Rate Limiting: 1 submission per IP every 30 seconds
  const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
  const { data: recentLead } = await supabase
    .from("leads")
    .select("created_at")
    .eq("ip_hash", ipHash)
    .gte("created_at", thirtySecondsAgo)
    .limit(1)
    .maybeSingle();

  if (recentLead) {
    return { 
      success: false, 
      error: "Too many submissions. Please wait 30 seconds before trying again." 
    }
  }

  // 2. Create Lead
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      project_id: projectId,
      name,
      email,
      phone,
      ip_hash: ipHash
    })
    .select()
    .single();

  if (leadError) {
    console.error("Failed to submit lead:", leadError.message)
    return { success: false, error: leadError.message }
  }

  // 3. Link back to Visitor for device attribution
  // Find the most recent visitor record for this IP and project
  const { data: visitor } = await supabase
    .from("visitors")
    .select("id")
    .eq("project_id", projectId)
    .eq("ip_hash", ipHash)
    .order("visited_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (visitor) {
    await supabase
      .from("visitors")
      .update({ lead_id: lead.id })
      .eq("id", visitor.id);
  }

  // 4. Invalidate Redis Cache for the user
  const { data: project } = await supabase
    .from("projects")
    .select("user_id")
    .eq("id", projectId)
    .single();

  if (project?.user_id) {
    const cacheKey = CACHE_KEYS.PROJECT_STATS(project.user_id);
    await redis.del(cacheKey).catch(e => console.error("Redis del failed:", e));
  }

  return { success: true }
}
