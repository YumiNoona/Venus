"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[#000]" />
      <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
      <div className="absolute inset-0 grid-dots opacity-[0.05]" />
      
      {/* Decorative Particles (Client-side only to fix hydration) */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%"
              }}
              animate={{ 
                y: ["-2%", "2%"],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 10 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-1 h-1 bg-white rounded-full absolute blur-[1px]"
            />
          ))}
        </div>
      )}

      <div className="container relative z-10 mx-auto px-6 pt-20 text-center space-y-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-8"
        >
          <motion.h1 
            animate={{ y: [-5, 5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.95] max-w-6xl mx-auto"
          >
            Present Interactive <br />
            <span className="text-white italic">Architectural Experiences</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-[0.25em]">
            Create structured project portals, present immersive environments,
            and capture visitor insights for your sales team.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/signup">
            <Button className="btn-primary-obs px-12 h-16">
              Build Your Studio <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button variant="outline" className="btn-secondary-obs px-12 h-16">
              Explore Demo
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
