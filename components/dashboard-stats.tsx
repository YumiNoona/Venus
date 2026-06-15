"use client";

import { Card } from "./ui";
import { Layers, Users, Eye, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalProjects: number;
  totalLeads: number;
  totalVisitors: number;
  conversionRate: number;
}

export function DashboardStats({
  totalProjects,
  totalLeads,
  totalVisitors,
  conversionRate
}: DashboardStatsProps) {
  const items = [
    {
      label: "Projects",
      value: totalProjects,
      icon: Layers,
    },
    {
      label: "Visitors",
      value: totalVisitors,
      icon: Eye,
    },
    {
      label: "Leads",
      value: totalLeads,
      icon: Users,
    },
    {
      label: "Conversion",
      value: `${conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{item.label}</p>
            <p className="text-lg font-semibold text-foreground tabular-nums mt-0.5">
              {item.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
