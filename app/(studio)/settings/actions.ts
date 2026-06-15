"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(data: { name?: string; avatar_url?: string }) {
  const supabase = await createServerSupabaseClient();
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

  // Delete user's public data (cascades to projects, leads, visitors)
  const { error: dbError } = await supabase.from("users").delete().eq("id", user.id);
  if (dbError) throw dbError;

  // Sign out locally — auth user record remains orphaned in Supabase
  await supabase.auth.signOut();

  redirect("/");
}
