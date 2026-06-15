"use client";

import { Card } from "./ui";
import { Layers, Users, Eye } from "lucide-react";

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
      description: "Total architectural showcases",
      icon: Layers,
    },
    {
      label: "Visitors",
      value: totalVisitors,
      description: "Lifetime viewing analytics",
      icon: Eye,
    },
    {
      label: "Leads",
      value: totalLeads,
      description: "Interested client inquiries",
      icon: Users,
    },
    {
      label: "Conversion",
      value: `${conversionRate.toFixed(1)}%`,
      description: "Visitors to leads ratio",
      icon: Users,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item, i) => (
        <Card key={item.label} className="p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group shadow-2xl" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-gold transition-colors">
              {item.label}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5 group-hover:border-gold/20 transition-all">
              <item.icon className="h-5 w-5 text-white/40 group-hover:text-gold transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black tracking-tighter text-white tabular-nums italic">
              {item.value}
            </div>
            <p className="text-xs text-white/20 font-bold uppercase tracking-[0.2em] leading-relaxed">
              {item.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
