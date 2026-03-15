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
    <Card className="p-0 overflow-hidden bg-neutral-900/40 border-neutral-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-800 bg-black/20">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Visitor</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Project</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <tr key={lead.id} className="group hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[color:var(--text-primary)]">{lead.name}</span>
                      <span className="text-[10px] text-neutral-500">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="text-[10px] border-neutral-800 bg-neutral-900">
                      {lead.project?.name || lead.projects?.name || "Deleted Project"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-neutral-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-xs text-neutral-600">
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
