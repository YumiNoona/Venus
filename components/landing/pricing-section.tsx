"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "19",
    features: ["10 projects", "Lead export", "Password protection", "Basic support"],
    highlight: false
  },
  {
    name: "Studio",
    price: "49",
    features: ["Unlimited projects", "Visitor verification", "Advanced analytics", "Priority support"],
    highlight: true
  },
  {
    name: "Agency",
    price: "99",
    features: ["Custom domain", "White-label", "Team access", "API access"],
    highlight: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-bg-primary">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic text-text-primary">
            Flexible Plans for Studios <br /> of Any Size
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className={cn(
                "p-12 glass-card rounded-[2.5rem] flex flex-col items-center text-center space-y-12 relative overflow-hidden",
                plan.highlight && "border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] ring-1 ring-white/10"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-b-2xl shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-text-secondary">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-black tracking-tighter text-white">${plan.price}</span>
                  <span className="text-xs font-bold uppercase text-text-secondary">/mo</span>
                </div>
              </div>

              <ul className="space-y-6 w-full text-left border-t border-white/5 pt-12 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.15em] text-text-secondary group/item">
                    <Check className="w-4 h-4 text-white/40 group-hover/item:text-white transition-colors flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className={cn(
                  "w-full h-16 shadow-2xl rounded-full",
                  plan.highlight 
                    ? "btn-primary-obs" 
                    : "btn-secondary-obs"
                )}
              >
                Choose {plan.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
