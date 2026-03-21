"use client";

import { motion } from "framer-motion";

const LOGOS = [
  "Foster + Partners", "Zaha Hadid Architects", "Gensler", "AECOM", "HKS", 
  "Perkins&Will", "HDR", "Jacobs", "Stantec", "Arup"
];

export default function TrustStrip() {
  return (
    <div className="py-12 border-y border-border-subtle bg-bg-primary overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary text-center">
          Designed for studios presenting interactive environments
        </p>
      </div>
      
      <div className="flex relative items-center">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center whitespace-nowrap min-w-full"
        >
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span 
              key={i} 
              className="text-2xl md:text-3xl font-black text-text-secondary/20 hover:text-text-secondary/40 transition-colors uppercase tracking-tighter"
            >
              {logo}
            </span>
          ))}
        </motion.div>
        
        {/* Gradient Fades */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-bg-primary to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-bg-primary to-transparent z-10" />
      </div>
    </div>
  );
}
