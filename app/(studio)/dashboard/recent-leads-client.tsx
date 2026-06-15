"use client";

import { useDashboardLeads } from "@/hooks/use-dashboard";
import { Card, Badge } from "@/components/ui";
import { Calendar } from "lucide-react";

export function RecentLeadsClient({ initialData }: { initialData: any[] }) {
  const { data: recentLeads, isLoading } = useDashboardLeads({
    initialData,
  });

  const leads = recentLeads || initialData;

  return (
    <Card className="p-0 overflow-hidden bg-bg-soft/40 border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-white/20">Visitor</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-white/20">Project</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-white/20 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <tr key={lead.id} className="group hover:bg-white/[0.03] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-white group-hover:text-gold transition-colors">{lead.name}</span>
                      <span className="text-xs text-white/40">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="default" className="text-[10px] border-white/10 bg-white/5 px-3 py-1 font-black uppercase tracking-widest text-white/60">
                      {lead.project?.name || lead.projects?.name || "Deleted Project"}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-white/40">
                      <Calendar className="h-4 w-4 opacity-40" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-xs text-text-secondary">
                  {isLoading ? "Refreshing..." : "No inquiries captured yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
