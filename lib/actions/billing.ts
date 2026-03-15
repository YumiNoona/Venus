"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { PLAN_FEATURES, PlanType } from "@/lib/config/plans"
import { revalidatePath } from "next/cache"

export async function getSubscription() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: subscription } = await (supabase as any)
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!subscription) {
    // Create default free subscription if none exists
    const { data: newSub } = await (supabase as any)
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan: "free",
        credits: PLAN_FEATURES.free.projects,
        projects_used: 0,
        status: "active"
      })
      .select()
      .single()
    
    return newSub
  }

  return subscription
}

export async function updateSubscription(plan: PlanType) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const features = PLAN_FEATURES[plan]
  
  const { data, error } = await (supabase as any)
    .from("subscriptions")
    .update({ 
      plan, 
      credits: features.projects,
      plan_updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/billing")
  revalidatePath("/projects")
  
  return data
}
