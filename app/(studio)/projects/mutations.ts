"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import bcrypt from "bcrypt"
import { type Database } from "@/types/database"

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

/**
 * Creates or updates a project securely from the server.
 * Handles password hashing and ensures protected fields are not exposed.
 */
export async function saveProject(payload: any) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { id, password, ...rest } = payload;
  
  // 1. Prepare data
  const projectData: any = {
    ...rest,
    user_id: user.id
  };

  // 2. Hash password if provided
  if (password && payload.auth_type === "password") {
    projectData.password_hash = await bcrypt.hash(password, 10);
  } else if (payload.auth_type === "public") {
    projectData.password_hash = null;
  }

  let result;

  if (id) {
    // Update
    result = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
  } else {
    // Insert
    result = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single();
  }

  if (result.error) {
    console.error("Save project error:", result.error.message);
    return { success: false, error: result.error.message };
  }

  revalidatePath("/projects");
  revalidatePath(`/project/${result.data.slug}`);
  revalidatePath(`/p/${result.data.slug}`);
  
  return { success: true, data: result.data };
}
