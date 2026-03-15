"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { headers } from "next/headers"

/**
 * Submits a new lead for a project with IP capture and Visitor linking.
 */
export async function submitLead(formData: FormData) {
  const projectId = formData.get("projectId") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string

  // 1. Strict Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailRegex.test(email)) {
    return { success: false, error: "Invalid name or email address" }
  }

  const supabase = await createServerSupabaseClient();
  const headersList = await headers();
  const rawIp = headersList.get("x-forwarded-for") || "unknown";

  const { hashIP } = await import("@/lib/utils/privacy");
  const ipHash = hashIP(rawIp);

  // 2. Create Lead
  const { data: lead, error: leadError } = await (supabase as any)
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

  // 4. Increment lead counter for analytics
  await (supabase as any).rpc("increment_project_leads", { project_id: projectId });

  return { success: true }
}
