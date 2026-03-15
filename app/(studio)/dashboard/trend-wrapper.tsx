import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ActivityTrendClient } from "./trend-client"

export const revalidate = 60;

export async function ActivityTrendWrapper() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id);
    
  const projectIds = (userProjects || []).map((p: any) => p.id);

  const { data: visitorTrend } = await supabase
    .from("visitors")
    .select("visited_at")
    .in("project_id", projectIds)
    .gte("visited_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  return <ActivityTrendClient initialData={visitorTrend || []} />;
}
