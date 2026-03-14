"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

/**
 * Marks a lead as verified.
 */
export async function verifyLead(leadId: string) {
  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase
    .from("leads")
    .update({ verified: true })
    .eq("id", leadId)

  if (error) {
    console.error("Failed to verify lead:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/leads")
  revalidatePath("/dashboard")
  return { success: true }
}

/**
 * Deletes a lead.
 */
export async function deleteLead(leadId: string) {
  const supabase = (await createServerSupabaseClient()) as any

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId)

  if (error) {
    console.error("Failed to delete lead:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/leads")
  revalidatePath("/dashboard")
  return { success: true }
}
