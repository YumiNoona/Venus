"use server";

import { createServerSupabaseClient, createServerAdminClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(data: { name?: string; avatar_url?: string }) {
  const supabase = (await createServerSupabaseClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("users")
    .update(data)
    .eq("id", user.id);

  if (error) {
    console.error("updateProfile error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/settings", "page");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function signOutOthers() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut({ scope: "others" });
  
  if (error) throw error;
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const adminClient = await createServerAdminClient();

  // 1. Delete all assets from storage
  const { data: files } = await adminClient.storage
    .from("avatars")
    .list(user.id, { limit: 100 });

  if (files && files.length > 0) {
    const filesToRemove = files.map((f) => `${user.id}/${f.name}`);
    const { error: storageError } = await adminClient.storage
      .from("avatars")
      .remove(filesToRemove);
      
    if (storageError) {
      console.error("Failed to delete storage files:", storageError);
    }
  }

  // 2. Delete user record from public.users
  // Database Cascades will automatically handle:
  // - public.users -> projects (ON DELETE CASCADE)
  // - projects -> leads (ON DELETE CASCADE)
  // - projects -> visitors (ON DELETE CASCADE)
  const { error: dbError } = await adminClient.from("users").delete().eq("id", user.id);
  if (dbError) throw dbError;

  // 3. Delete auth user (The final identity removal)
  const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(user.id);
  if (authDeleteError) {
    console.error("Failed to delete auth user:", authDeleteError);
    throw new Error("Failed to delete user account securely");
  }

  // 4. Sign out locally
  await supabase.auth.signOut();

  redirect("/");
}
