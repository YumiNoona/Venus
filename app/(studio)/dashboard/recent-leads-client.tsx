"use client";

import { useDashboardLeads } from "@/hooks/use-dashboard";
import { Card } from "@/components/ui";

export function RecentLeadsClient({ initialData }: { initialData: any[] }) {
  const { data: recentLeads, isLoading } = useDashboardLeads({
    initialData,
  });

  const leads = recentLeads || initialData;

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Visitor</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Project</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <tr key={lead.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {lead.project?.name || lead.projects?.name || "Deleted Project"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-xs text-muted-foreground">
                  {isLoading ? "Refreshing..." : "No inquiries yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
