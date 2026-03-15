import { requireUser } from "@/lib/auth";
import { Suspense } from "react";
import { Button, Card, Badge, Separator } from "@/components/ui";
import Link from "next/link";
import { Plus, Users, Calendar, ArrowRight, BarChart3, Loader2 } from "lucide-react";
import { DashboardStatsWrapper } from "./stats-wrapper";
import { RecentLeadsWrapper } from "./leads-wrapper";
import { ActivityTrendWrapper } from "./trend-wrapper";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireUser();

  return (
    <div className="page-container space-y-12 pb-20">
      {/* Header - Renders Instantly */}
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

      {/* Metrics section - Progressive Load */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
           <BarChart3 className="h-4 w-4 text-[color:var(--accent)]" />
           <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
             Growth Metrics
           </h2>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStatsWrapper />
        </Suspense>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads - Progressive Load */}
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
          
          <Suspense fallback={<TableSkeleton />}>
            <RecentLeadsWrapper />
          </Suspense>
        </section>

        {/* Visitor Activity Trend - Progressive Load */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
            <ArrowRight className="h-4 w-4 text-[color:var(--accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Activity Trend</h2>
          </div>
          <Suspense fallback={<CardSkeleton />}>
            <ActivityTrendWrapper />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
       {[...Array(4)].map((_, i) => (
         <div key={i} className="h-24 bg-neutral-900/40 border border-neutral-800 rounded-xl" />
       ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="h-[300px] w-full bg-neutral-900/40 border border-neutral-800 rounded-lg animate-pulse" />
  )
}

function CardSkeleton() {
  return (
    <div className="h-[400px] w-full bg-neutral-900/40 border border-neutral-800 rounded-lg animate-pulse" />
  )
}
