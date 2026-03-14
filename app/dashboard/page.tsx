import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { DashboardStats } from "@/components/dashboard-stats";
import Link from "next/link";
import { Plus } from "lucide-react";

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
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Studio overview
            </h1>
            <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
              A calm snapshot of your projects, leads, and visitors.
            </p>
          </div>
          <Link href="/projects/new" className="btn-accent">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </header>

        {/* Stats */}
        <section className="mt-8">
          <DashboardStats
            totalProjects={projectsCount ?? 0}
            totalLeads={leadsCount ?? 0}
            recentVisitors={visitorsCount ?? 0}
          />
        </section>

        {/* Quick help */}
        <section className="mt-8">
          <div className="glass-panel p-6 animate-slide-up delay-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-soft)]">
                <span className="text-base">✦</span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Getting started with Venus</div>
                <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                  Create your first project, add thumbnails and a story description,
                  paste your streaming URL, then publish. Share the generated link with
                  clients — Venus takes care of the rest.
                </p>
                <div className="flex gap-3 pt-2">
                  <Link href="/projects/new" className="btn-soft">
                    Create a project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
