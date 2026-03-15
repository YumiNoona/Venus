"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getLeads({
  search,
  projectId,
  fromDate,
  toDate
}: {
  search?: string;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id);

  const projectIds = (userProjects || []).map(p => p.id);
  if (projectIds.length === 0) return [];

  let query = supabase
    .from("leads")
    .select(`
      id,
      name,
      email,
      phone,
      created_at,
      project_id,
      verified,
      projects(name),
      visitors(device)
    `)
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (projectId && projectId !== "all") {
    query = query.eq("project_id", projectId);
  }

  if (fromDate) {
    query = query.gte("created_at", fromDate);
  }

  if (toDate) {
    query = query.lte("created_at", toDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function verifyLead(leadId: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("leads")
    .update({ verified: true })
    .eq("id", leadId);

  if (error) throw error;
  revalidatePath("/leads");
  return { success: true };
}

export async function deleteLead(leadId: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId);

  if (error) throw error;
  revalidatePath("/leads");
  return { success: true };
}

export async function getAdminProjects() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("projects")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name");

  if (error) throw error;
  return data;
}
import { PLAN_FEATURES, type PlanType } from "@/lib/config/plans"
import { getSubscription } from "@/lib/actions/billing"

export async function verifyExportAccess(type: "csv" | "pdf") {
  const sub = await getSubscription();
  if (!sub) return { allowed: false, error: "No active subscription found." };

  const features = PLAN_FEATURES[sub.plan as PlanType];
  const isAllowed = type === "csv" ? features.csv_export : features.pdf_export;

  if (!isAllowed) {
    return { 
      allowed: false, 
      error: `Upgrade to ${type === "csv" ? "Starter" : "Studio"} plan to unlock ${type.toUpperCase()} exports.` 
    };
  }

  return { allowed: true };
}
