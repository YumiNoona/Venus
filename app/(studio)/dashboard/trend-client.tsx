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
    <Card className="p-10 bg-white/[0.02] border-white/5 space-y-10">
      <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">Visitors (Last 7 Days)</p>
      <div className="space-y-6">
         {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const count = visitorTrend?.filter((v: any) => v.visited_at?.startsWith(dateStr)).length || 0;
            
            return (
              <div key={i} className="flex items-center gap-6">
                <span className="text-[10px] text-white/40 w-14 font-black uppercase tracking-widest">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <div className="flex-1 h-3 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                  <div 
                     className="h-full bg-gold transition-all duration-1000 shadow-[0_0_15px_rgba(202,138,4,0.4)]" 
                     style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-white/60 font-black tabular-nums tracking-widest">{count}</span>
              </div>
            );
         })}
      </div>
      <Separator className="opacity-10" />
      <p className="text-[10px] leading-relaxed text-white/10 italic font-medium">
         * Trends show daily engagement peaks.
      </p>
    </Card>
  );
}
