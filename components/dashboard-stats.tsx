import { Card } from "./ui";
import { Layers, Users, Eye } from "lucide-react";

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
      hint: "Published & drafts",
      icon: Layers,
      color: "var(--accent)"
    },
    {
      label: "Total Leads",
      value: totalLeads,
      hint: "Captured across projects",
      icon: Users,
      color: "var(--success)"
    },
    {
      label: "Recent Visitors",
      value: recentVisitors,
      hint: "Last 7 days",
      icon: Eye,
      color: "#8b5cf6"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`stat-card animate-slide-up delay-${i + 1}`}
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
              {item.label}
            </div>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: `color-mix(in srgb, ${item.color} 12%, transparent)` }}
            >
              <item.icon
                className="h-4 w-4"
                style={{ color: item.color }}
              />
            </div>
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
            {item.value}
          </div>
          <div className="mt-1.5 text-xs text-[color:var(--text-secondary)]">
            {item.hint}
          </div>
        </div>
      ))}
    </div>
  );
}
