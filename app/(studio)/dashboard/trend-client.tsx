"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui";

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
  const maxCount = Math.max(1, ...(visitorTrend || []).map((v: any) => {
    const dateStr = new Date().toISOString().split('T')[0];
    return v.visited_at?.startsWith(dateStr) ? 1 : 0;
  }));

  return (
    <Card className="p-5">
      <p className="text-xs font-medium text-muted-foreground mb-4">Visitors (Last 7 Days)</p>
      <div className="space-y-3">
         {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const count = visitorTrend?.filter((v: any) => v.visited_at?.startsWith(dateStr)).length || 0;
            
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                     className="h-full bg-foreground/20 rounded-full transition-all duration-500" 
                     style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums w-4 text-right">{count}</span>
              </div>
            );
         })}
      </div>
    </Card>
  );
}
