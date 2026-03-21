"use client";

import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Vercel", icon: "▲" },
  { name: "Loom", icon: "✳" },
  { name: "Cash App", icon: "$" },
  { name: "Loops", icon: "◎" },
  { name: "Zapier", icon: "—" },
  { name: "Ramp", icon: "∠" },
  { name: "Raycast", icon: "◆" },
];

export default function PartnerLogos() {
  return (
    <section className="py-20 border-t border-border/50 bg-bg/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="text-2xl font-bold group-hover:text-primary transition-colors">{partner.icon}</span>
              <span className="text-sm font-bold uppercase tracking-widest group-hover:text-text transition-colors">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
