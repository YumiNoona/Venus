"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { headers } from "next/headers"

/**
 * Submits a new lead for a project with IP capture.
 */
export async function submitLead(formData: FormData) {
  const projectId = formData.get("projectId") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string

  if (!projectId || !name || !email) {
    return { success: false, error: "Missing required fields" }
  }

  const supabase = (await createServerSupabaseClient()) as any;
  const headersList = await headers();
  const rawIp = headersList.get("x-forwarded-for") || "unknown";

  const { hashIp } = await import("@/lib/utils/privacy");
  const ip = hashIp(rawIp);

  const { error } = await supabase
    .from("leads")
    .insert({
      project_id: projectId,
      name,
      email,
      phone,
      ip
    });

  if (error) {
    console.error("Failed to submit lead:", error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}
