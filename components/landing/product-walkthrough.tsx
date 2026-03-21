"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Create a Project",
    text: "Set up a project page with visuals, description, and experience entry.",
    visualColor: "from-gold/20 to-transparent"
  },
  {
    title: "Publish a Dedicated Project Page",
    text: "Each project receives a shareable presentation page designed for client exploration.",
    visualColor: "from-violet-500/20 to-transparent"
  },
  {
    title: "Verify Visitors",
    text: "Capture visitor details before allowing access to the interactive experience.",
    visualColor: "from-gold/20 to-transparent"
  },
  {
    title: "Launch the Experience",
    text: "Visitors enter the immersive environment through a secure launch gateway.",
    visualColor: "from-violet-500/20 to-transparent"
  },
  {
    title: "Capture Leads Automatically",
    text: "Every visitor interaction becomes actionable information for your sales team.",
    visualColor: "from-gold/20 to-transparent"
  }
];

export default function ProductWalkthrough() {
  return (
    <section className="py-32 bg-bg-primary overflow-hidden">
      <div className="container mx-auto px-6 space-y-32">
        {STEPS.map((step, idx) => (
          <div 
            key={idx}
            className={cn(
              "flex flex-col lg:flex-row items-center gap-16 lg:gap-32",
              idx % 2 === 1 && "lg:flex-row-reverse"
            )}
          >
            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-6"
            >
              <div className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Step 0{idx + 1}</div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic">{step.title}</h3>
              <p className="text-text-secondary text-lg leading-relaxed uppercase tracking-wider font-medium max-w-md">
                {step.text}
              </p>
            </motion.div>

            {/* Visual Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
                <div className={cn(
                  "aspect-[16/10] bg-bg-secondary rounded-2xl border border-border-subtle relative overflow-hidden group hover:border-text-primary/20 transition-all shadow-2xl",
                  "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-30",
                  step.visualColor
                )}>
                   <img 
                      src={[
                        "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/dashboard_mockup_vercel_1773766506005.png",
                        "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/projects_mockup_vercel_1773766525214.png",
                        "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/leads_mockup_vercel_1773766543111.png",
                        "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/dashboard_mockup_vercel_1773766506005.png",
                        "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/projects_mockup_vercel_1773766525214.png"
                      ][idx]} 
                      alt={step.title}
                      className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                   />
                   
                   {/* Glass Reflections */}
                   <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
                   <div className="absolute top-[-50%] left-[-20%] w-[50%] h-[200%] bg-white/[0.02] -rotate-45" />
                </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
