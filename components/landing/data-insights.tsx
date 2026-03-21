"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function DataInsights() {
  return (
    <section className="py-40 bg-black relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-[0.05]" />
      
      <div className="container mx-auto px-6 text-center space-y-24 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic">
            Turn Visitor Activity <br /> Into Actionable Insight
          </h2>
          <p className="text-text-secondary text-lg uppercase tracking-wide font-medium">
            Track how visitors interact with your projects and identify potential clients instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 items-baseline">
          <MetricItem value={12400} label="Visitors" prefix="" />
          <MetricItem value={2800} label="Leads" prefix="" />
          <MetricItem value={24} label="Conversion" prefix="" suffix="%" />
          <MetricItem value={450} label="Projects" prefix="" />
        </div>
      </div>
    </section>
  );
}

function MetricItem({ value, label, prefix = "", suffix = "" }: { value: number, label: string, prefix?: string, suffix?: string }) {
  return (
    <div className="space-y-4">
      <div className="text-5xl md:text-7xl font-black tracking-tighter text-white">
        {prefix}<CountUp end={value} duration={4} enableScrollSpy scrollSpyOnce />{suffix}
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{label}</p>
    </div>
  );
}
