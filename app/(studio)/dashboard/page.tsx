import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { DashboardStats } from "@/components/dashboard-stats";
import { Button, Card, Badge, Separator } from "@/components/ui";
import Link from "next/link";
import { Plus, Users, Calendar, ArrowRight, BarChart3 } from "lucide-react";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();

  // 0. Fetch User Project IDs first (to avoid subquery type complexities)
  const { data: userProjects } = (await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id)) as any;
    
  const projectIds = (userProjects || []).map((p: any) => p.id);

  // 1. Fetch Metrics Data (With manual filters as backup for Next.js SSR session timing)
  const [
    { count: totalProjects }, 
    { count: totalLeads }, 
    { count: totalVisitors },
    { data: recentLeads },
    { data: visitorTrend }
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("leads").select("id", { count: "exact", head: true }).in("project_id", projectIds),
    supabase.from("visitors").select("id", { count: "exact", head: true }).in("project_id", projectIds),
    supabase.from("leads")
      .select("*, project:projects(name)")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("visitors")
      .select("visited_at")
      .in("project_id", projectIds)
      .gte("visited_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  ]);

  const pCount = totalProjects ?? 0;
  const lCount = totalLeads ?? 0;
  const vCount = totalVisitors ?? 0;
  const conversionRate = vCount > 0 ? (lCount / vCount) * 100 : 0;

  return (
    <div className="page-container space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
            Studio Dashboard
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Performance overview for your architectural visualizations.
          </p>
        </div>
        <Link href="/projects/new">
          <Button variant="primary" size="md" className="gap-2 shadow-lg shadow-[color:var(--accent)]/10">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </header>

      {/* Metrics section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
           <BarChart3 className="h-4 w-4 text-[color:var(--accent)]" />
           <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
             Growth Metrics
           </h2>
        </div>
        <DashboardStats
          totalProjects={pCount}
          totalLeads={lCount}
          totalVisitors={vCount}
          conversionRate={conversionRate}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
              <Users className="h-4 w-4 text-[color:var(--accent)]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Latest Inquiries</h2>
            </div>
            <Link href="/leads">
               <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest gap-1 hover:text-[color:var(--accent)]">
                 View All <ArrowRight className="h-3 w-3" />
               </Button>
            </Link>
          </div>
          
          <Card className="p-0 overflow-hidden bg-neutral-900/40 border-neutral-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 bg-black/20">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Visitor</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Project</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {recentLeads && recentLeads.length > 0 ? (
                    recentLeads.map((lead: any) => (
                      <tr key={lead.id} className="group hover:bg-neutral-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[color:var(--text-primary)]">{lead.name}</span>
                            <span className="text-[10px] text-neutral-500">{lead.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="default" className="text-[10px] border-neutral-800 bg-neutral-900">
                            {lead.project?.name || "Deleted Project"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-xs text-neutral-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-xs text-neutral-600">
                        No inquiries captured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Visitor Activity Trend (Simplified Sidebar) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
            <ArrowRight className="h-4 w-4 text-[color:var(--accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Activity Trend</h2>
          </div>
          
          <Card className="p-6 bg-neutral-900/40 border-neutral-800 space-y-6">
            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Visitors (Last 7 Days)</p>
            <div className="space-y-4">
               {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
                  const dateStr = date.toISOString().split('T')[0];
                  const count = visitorTrend?.filter((v: any) => v.visited_at.startsWith(dateStr)).length || 0;
                  
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[10px] text-neutral-500 w-12 font-mono">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                      <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-[color:var(--accent)] transition-all duration-1000" 
                           style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 font-bold tabular-nums">{count}</span>
                    </div>
                  );
               })}
            </div>
            <Separator className="opacity-10" />
            <p className="text-[10px] leading-relaxed text-neutral-600 italic">
               * Trends show daily engagement peaks.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
