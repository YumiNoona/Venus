import { Card } from "./ui";

interface DashboardStatsProps {
  totalProjects: number;
  totalLeads: number;
  recentVisitors: number;
}

export function DashboardStats({
  totalProjects,
  totalLeads,
  recentVisitors
}: DashboardStatsProps) {
  const items = [
    {
      label: "Total Projects",
      value: totalProjects,
      hint: "Published & drafts"
    },
    {
      label: "Total Leads",
      value: totalLeads,
      hint: "Captured across projects"
    },
    {
      label: "Recent Visitors",
      value: recentVisitors,
      hint: "Last 7 days"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className="flex flex-col justify-between p-4"
        >
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
            {item.label}
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <div className="text-2xl font-semibold tracking-tight">
              {item.value}
            </div>
          </div>
          <div className="mt-2 text-xs text-[color:var(--text-secondary)]">
            {item.hint}
          </div>
        </Card>
      ))}
    </div>
  );
}

