import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { DashboardStats } from "@/components/dashboard-stats";
import { Button } from "@/components/ui";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";

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
    <div className="page-container space-y-10">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                Studio Overview
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)]">
                Monitor your project performance and client engagement.
              </p>
            </div>
            <Link href="/projects/new">
              <Button variant="primary" size="md" className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </header>

          {/* Stats section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-[0.1em] text-[color:var(--text-secondary)]">
                Performance Metrics
              </h2>
            </div>
            <DashboardStats
              totalProjects={projectsCount ?? 0}
              totalLeads={leadsCount ?? 0}
              recentVisitors={visitorsCount ?? 0}
            />
          </section>

          {/* Quick Actions / Integration Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            <div className="rounded-xl border border-neutral-800 bg-[color:var(--surface)] p-6 space-y-4 transition-colors hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[color:var(--text-primary)]">Stream Integration</h3>
                <ArrowUpRight className="h-4 w-4 text-[color:var(--text-secondary)]" />
              </div>
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                Connect your external pixel streaming provider. Venus uses the streaming URL to embed interactive experiences in your project pages.
              </p>
              <div className="pt-2">
                <Link href="/projects">
                  <Button variant="secondary" size="sm">Configure Stream</Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-[color:var(--surface)] p-6 space-y-4 transition-colors hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[color:var(--text-primary)]">Lead Capture</h3>
                <ArrowUpRight className="h-4 w-4 text-[color:var(--text-secondary)]" />
              </div>
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                Enable lead forms on your public project pages to capture client interest before they enter the architectural experience.
              </p>
              <div className="pt-2">
                <Link href="/leads">
                  <Button variant="secondary" size="sm">View All Leads</Button>
                </Link>
              </div>
            </div>
          </section>
    </div>
  );
}
