"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";
import { motion } from "framer-motion";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <main className="container mx-auto px-6 py-40 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl space-y-8"
        >
          <div className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Learning</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Guides</h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
            Deep dives into architectural storytelling, interactive experience design, and lead capture strategies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {[1, 2, 3].map(i => (
             <div key={i} className="aspect-video bg-white/[0.02] border border-white/[0.05] rounded-3xl flex items-center justify-center text-text-secondary italic">
               Guide {i} coming soon...
             </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
