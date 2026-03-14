"use client";

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
      label: "Active Projects",
      value: totalProjects,
      description: "Projects published live",
      icon: Layers,
    },
    {
      label: "Captured Leads",
      value: totalLeads,
      description: "Interested client contacts",
      icon: Users,
    },
    {
      label: "Recent Visitors",
      value: recentVisitors,
      description: "Visits in the last 7 days",
      icon: Eye,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <Card key={item.label} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[color:var(--text-secondary)]">
              {item.label}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900">
              <item.icon className="h-4 w-4 text-[color:var(--accent)]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] tabular-nums">
              {item.value}
            </div>
            <p className="text-xs text-[color:var(--text-secondary)] leading-none italic">
              {item.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
