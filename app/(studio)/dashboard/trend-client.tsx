"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Separator } from "@/components/ui";

async function fetchTrendData() {
  const res = await fetch("/api/analytics/trend");
  if (!res.ok) throw new Error("Failed to fetch trend");
  return res.json();
}

export function ActivityTrendClient({ initialData }: { initialData: any[] }) {
  const { data: trendData } = useQuery({
    queryKey: ["trend"],
    queryFn: fetchTrendData,
    initialData,
    staleTime: 60000,
  });

  const visitorTrend = trendData || initialData;

  return (
    <Card className="p-6 bg-bg-soft/40 border-border space-y-6">
      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Visitors (Last 7 Days)</p>
      <div className="space-y-4">
         {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const count = visitorTrend?.filter((v: any) => v.visited_at?.startsWith(dateStr)).length || 0;
            
            return (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[10px] text-text-secondary w-12 font-mono">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                     className="h-full bg-accent transition-all duration-1000" 
                     style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-secondary font-bold tabular-nums">{count}</span>
              </div>
            );
         })}
      </div>
      <Separator className="opacity-10" />
      <p className="text-[10px] leading-relaxed text-text-secondary italic">
         * Trends show daily engagement peaks.
      </p>
    </Card>
  );
}
