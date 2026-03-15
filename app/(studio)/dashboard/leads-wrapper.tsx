import { createServerSupabaseClient } from "@/lib/supabase-server"
import { RecentLeadsClient } from "./recent-leads-client"

export const revalidate = 60;

export async function RecentLeadsWrapper() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id);
    
  const projectIds = (userProjects || []).map((p: any) => p.id);

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*, projects(name)")
    .in("project_id", projectIds)
    .order("created_at", { ascending: false })
    .limit(5);

  return <RecentLeadsClient initialData={recentLeads || []} />;
}
