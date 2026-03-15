import { createServerSupabaseClient } from "@/lib/supabase-server"
import { DashboardStats } from "@/components/dashboard-stats"
import { redis, CACHE_KEYS } from "@/lib/redis"

export const revalidate = 60; // Fallback cache

export async function DashboardStatsWrapper() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const cacheKey = CACHE_KEYS.PROJECT_STATS(user.id);

  try {
    // 1. Try Redis First (Elite Fast Path: 1-5ms)
    const cachedStats = await redis.get<{
      totalProjects: number;
      totalViews: number;
      totalLeads: number;
      conversionRate: number;
    }>(cacheKey);

    if (cachedStats) {
      return (
        <DashboardStats
          totalProjects={cachedStats.totalProjects}
          totalLeads={cachedStats.totalLeads}
          totalVisitors={cachedStats.totalViews}
          conversionRate={cachedStats.conversionRate}
        />
      );
    }
  } catch (err) {
    console.warn("Redis lookup failed, falling back to DB:", err);
  }

  // 2. Database Fallback
  const { data: metrics } = await supabase
    .from("projects")
    .select("view_count, lead_count")
    .eq("user_id", user.id);

  const totalProjects = metrics?.length || 0;
  const totalViews = metrics?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;
  const totalLeads = metrics?.reduce((acc, curr) => acc + (curr.lead_count || 0), 0) || 0;
  
  const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

  const stats = {
    totalProjects,
    totalViews,
    totalLeads,
    conversionRate
  };

  // 3. Update Redis Cache asynchronously (Fire-and-forget for next request)
  try {
    void redis.set(cacheKey, stats, { ex: 3600 }); // Cache for 1 hour
  } catch (err) {
    console.error("Redis set failed:", err);
  }

  return (
    <DashboardStats
      totalProjects={totalProjects}
      totalLeads={totalLeads}
      totalVisitors={totalViews}
      conversionRate={conversionRate}
    />
  );
}
