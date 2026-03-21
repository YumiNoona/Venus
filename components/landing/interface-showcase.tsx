"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SCREENS = [
  { name: "Dashboard", color: "from-gold/20" },
  { name: "Projects List", color: "from-violet-500/20" },
  { name: "Lead Manager", color: "from-gold/20" },
  { name: "Analytics", color: "from-violet-500/20" },
];

export default function InterfaceShowcase() {
  return (
    <section className="py-32 bg-bg-secondary overflow-hidden">
      <div className="container mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic">
          Built for Teams Managing <br /> Interactive Presentations
        </h2>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-6 md:px-[10vw] no-scrollbar">
        {SCREENS.map((screen, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-[85vw] md:w-[60vw] snap-center"
          >
            <div className={cn(
              "aspect-video bg-bg-primary rounded-3xl border border-border-subtle relative overflow-hidden group hover:border-text-primary/10 transition-colors shadow-2xl",
              "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-10",
              screen.color
            )}>
               <img 
                  src={[
                    "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/dashboard_mockup_vercel_1773766506005.png",
                    "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/projects_mockup_vercel_1773766525214.png",
                    "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/leads_mockup_vercel_1773766543111.png",
                    "/brain/b53c6106-000d-48eb-a77d-3e9965bb5849/dashboard_mockup_vercel_1773766506005.png"
                  ][i]} 
                  alt={screen.name}
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
               />
               
               <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-60 pointer-events-none" />

               <div className="absolute bottom-6 left-8 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,167,96,0.5)]" />
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                    Live Platform: {screen.name}
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 container mx-auto px-6 flex justify-center gap-2">
        {SCREENS.map((_, i) => (
          <div key={i} className="w-12 h-1 bg-border-subtle rounded-full" />
        ))}
      </div>
    </section>
  );
}
