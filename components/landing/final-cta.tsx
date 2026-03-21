"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-48 bg-bg-primary relative overflow-hidden">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-bg-primary to-accent-violet/20 opacity-30" />
      <div className="absolute inset-0 blueprint-grid opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[1.05]">
            Start Presenting Interactive <br /> Projects Today
          </h2>
          <p className="text-text-secondary text-xl md:text-2xl uppercase tracking-widest font-medium max-w-2xl mx-auto">
            Create your studio, publish your first project, and begin collecting visitor insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/signup">
            <Button className="btn-primary-obs h-24 px-20 text-[12px] shadow-[0_0_50px_rgba(255,255,255,0.15)]">
              Create Free Studio
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
