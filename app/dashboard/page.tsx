import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { DashboardStats } from "@/components/dashboard-stats";

export default async function DashboardPage() {
  const { supabase } = await requireUser();

  const [{ count: projectsCount }, { count: leadsCount }, { count: visitorsCount }] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("visitors")
        .select("id", { count: "exact", head: true })
        .gte(
          "visited_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        )
    ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Studio overview
            </h1>
            <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
              A calm snapshot of your projects, leads, and visitors.
            </p>
          </div>
        </header>
        <section className="mt-8 space-y-8">
          <DashboardStats
            totalProjects={projectsCount ?? 0}
            totalLeads={leadsCount ?? 0}
            recentVisitors={visitorsCount ?? 0}
          />
        </section>
      </main>
    </div>
  );
}

