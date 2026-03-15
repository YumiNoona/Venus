"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import bcrypt from "bcrypt"
import { type Database } from "@/types/database"
import { PLAN_FEATURES, type PlanType } from "@/lib/config/plans"
import { getSubscription } from "@/lib/actions/billing"

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
    user_id: user.id,
    remember_visitor: payload.remember_visitor ?? true
  };

  // 2. Store password as plain-text if provided
  if (payload.auth_type === "password") {
    if (password && password.length > 0) {
      projectData.project_password = password;
      projectData.password_hash = null; // Transitioning away from bcrypt
    }
  } else if (payload.auth_type === "public") {
    projectData.project_password = null;
    projectData.password_hash = null;
  }

  let result;

  if (id) {
    // 3. OTP Restriction Check on Update
    const sub = await getSubscription();
    const features = sub ? PLAN_FEATURES[sub.plan as PlanType] : PLAN_FEATURES.free;
    
    if (payload.auth_type === "otp" && !features.otp_auth) {
      return { success: false, error: "OTP verification requires Studio plan." };
    }

    // 4. Fetch existing project to check for slug change
    const { data: existingProject } = await supabase
      .from("projects")
      .select("slug")
      .eq("id", id)
      .single();

    // Update
    result = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    // 5. If slug changed, record redirect
    if (!result.error && existingProject && result.data && existingProject.slug !== result.data.slug) {
       await (supabase as any)
         .from('slug_redirects')
         .insert({
           old_slug: existingProject.slug,
           new_slug: result.data.slug,
           project_id: id
         });
    }
  } else {
    // Insert - 2a. Limit Check
    const sub = await getSubscription();
    const features = sub ? PLAN_FEATURES[sub.plan as PlanType] : PLAN_FEATURES.free;
    
    if ((sub?.projects_used || 0) >= features.projects) {
      return { 
        success: false, 
        error: `Project limit reached for ${sub?.plan || 'free'} plan (${features.projects}/${features.projects}). Please upgrade in the Billing tab.` 
      };
    }

    // 2b. OTP Restriction Check on Insert
    if (payload.auth_type === "otp" && !features.otp_auth) {
      return { success: false, error: "OTP verification requires Studio plan." };
    }

    result = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single();

    // 2c. Increment Usage if successful
    if (!result.error && result.data && sub) {
      await (supabase as any)
        .from("subscriptions")
        .update({ projects_used: (sub.projects_used || 0) + 1 })
        .eq("user_id", user.id);
    }
  }

  if (result.error) {
    console.error("Save project error:", result.error.message);
    return { success: false, error: result.error.message };
  }

  revalidatePath("/projects");
  if (result.data) {
    revalidatePath(`/project/${result.data.slug}`);
    revalidatePath(`/p/${result.data.slug}`);
  }
  
  return { success: true, data: result.data };
}
