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
            <tr className="border-b border-border bg-black/20">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Visitor</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Project</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <tr key={lead.id} className="group hover:bg-bg-soft/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text">{lead.name}</span>
                      <span className="text-[10px] text-text-secondary">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="text-[10px] border-border bg-bg-soft">
                      {lead.project?.name || lead.projects?.name || "Deleted Project"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-text-secondary">
                      <Calendar className="h-3 w-3" />
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
