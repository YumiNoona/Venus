import { requireUser } from "@/lib/auth";
import { Suspense } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { DashboardStatsWrapper } from "./stats-wrapper";
import { RecentLeadsWrapper } from "./leads-wrapper";
import { ActivityTrendWrapper } from "./trend-wrapper";
import { TourInitializer } from "./tour-initializer";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireUser();

  return (
    <div className="page-container space-y-12 pb-20">
      <TourInitializer />
      {/* Header - Renders Instantly */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-1">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic uppercase">
            Dashboard
          </h1>
          <p className="text-base text-muted-foreground font-medium">
            Performance overview for your architectural visualizations.
          </p>
        </div>
        <Link href="/projects/new">
          <Button variant="primary" size="lg" className="gap-3 tour-new-project px-8 py-6 text-base font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95">
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </Link>
      </header>

      {/* Metrics section - Progressive Load */}
      <section className="space-y-6 tour-metrics">
        <div className="flex items-center gap-3 px-1 border-b border-border pb-4">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
             Growth Metrics
           </h2>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStatsWrapper />
        </Suspense>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-1">
        {/* Recent Leads - Progressive Load */}
        <section className="lg:col-span-2 space-y-6 tour-recent-leads">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Latest Inquiries</h2>
            </div>
            <Link href="/leads">
               <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-[0.2em] gap-2 hover:bg-gold/10 hover:text-gold transition-all">
                 View All <ArrowRight className="h-3 w-3" />
               </Button>
            </Link>
          </div>
          
          <Suspense fallback={<TableSkeleton />}>
            <RecentLeadsWrapper />
          </Suspense>
        </section>

        {/* Visitor Activity Trend - Progressive Load */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Activity Trend</h2>
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
         <div key={i} className="h-24 bg-bg-soft/40 border border-border rounded-xl" />
       ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="h-[300px] w-full bg-bg-soft/40 border border-border rounded-lg animate-pulse" />
  )
}

function CardSkeleton() {
  return (
    <div className="h-[400px] w-full bg-bg-soft/40 border border-border rounded-lg animate-pulse" />
  )
}
