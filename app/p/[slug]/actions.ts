"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"

/**
 * Records a visitor entry for a specific project.
 */
export async function trackVisitor(projectId: string) {
  const supabase = (await createServerSupabaseClient()) as any;

  const { error } = await supabase
    .from("visitors")
    .insert({
      project_id: projectId,
      visited_at: new Date().toISOString()
    });

  if (error) {
    console.error("Failed to track visitor:", error.message)
  }
}
