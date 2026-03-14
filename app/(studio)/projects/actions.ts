"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

/**
 * Toggles a project's published status.
 */
export async function toggleProjectStatus(projectId: string, currentStatus: boolean) {
  const supabase = (await createServerSupabaseClient()) as any;

  const { error } = await supabase
    .from("projects")
    .update({ published: !currentStatus })
    .eq("id", projectId)

  if (error) {
    console.error("Failed to toggle project status:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/projects")
  revalidatePath("/dashboard")
  return { success: true }
}

/**
 * Deletes a project.
 * Note: Database cascades will handle leads and visitors deletion.
 */
export async function deleteProject(projectId: string) {
  const supabase = (await createServerSupabaseClient()) as any;

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)

  if (error) {
    console.error("Failed to delete project:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/projects")
  revalidatePath("/dashboard")
  return { success: true }
}
