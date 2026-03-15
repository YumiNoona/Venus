import { createServerSupabaseClient } from "@/lib/supabase-server"
import { headers } from "next/headers"
import { hashIP } from "@/lib/utils/privacy"

/**
 * Records a visitor entry for a specific project.
 * Uses SHA-256 IP hashing for privacy and implements a 60-second 
 * idempotency window per IP/Project to ensure accurate analytics.
 */
export async function trackVisitor(projectId: string) {
  const supabase = await createServerSupabaseClient();
  const headerList = await headers();
  
  // Get IP and device info
  const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const userAgent = (headerList.get("user-agent") || "unknown").trim();
  const ipHash = hashIP(ip);

  // 1. Idempotency Check: Prevent duplicate counting within 60 seconds
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
  
  const { data: existing } = await supabase
    .from("visitors")
    .select("id")
    .eq("project_id", projectId)
    .eq("ip_hash", ipHash)
    .gte("visited_at", oneMinuteAgo)
    .limit(1)
    .maybeSingle();

  if (existing) return;

  // 2. Insert record and increment view count
  const { error } = await supabase
    .from("visitors")
    .insert({
      project_id: projectId,
      ip_hash: ipHash,
      device: userAgent.substring(0, 255),
      visited_at: new Date().toISOString()
    });

  if (error) {
    console.error("Failed to track visitor:", error.message)
    return;
  }

  // 3. Increment direct counter on project for fast analytics
  await (supabase as any).rpc("increment_project_views", { project_id: projectId });
}
