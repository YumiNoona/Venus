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
    <div className="page-container">
      <TourInitializer />
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your architectural projects.
          </p>
        </div>
        <Link href="/projects/new">
          <Button variant="primary" size="sm" className="gap-2 tour-new-project">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <section className="mb-8">
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStatsWrapper />
        </Suspense>
      </section>

      {/* Recent Leads + Activity Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4 tour-recent-leads">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Latest Inquiries</h2>
            <Link href="/leads">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <Suspense fallback={<TableSkeleton />}>
            <RecentLeadsWrapper />
          </Suspense>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-medium text-foreground">Activity Trend</h2>
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
