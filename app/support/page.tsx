"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <main className="container mx-auto px-6 py-40 space-y-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Help Center</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Support</h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Have a problem or a feature request? Our team is here to help. <br />
            <span className="text-white font-semibold">We typically reply within 24 hours.</span>
          </p>

          <form className="space-y-6 text-left pt-12 bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/[0.05]">
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Your Email</label>
                <input 
                  type="email" 
                  placeholder="name@studio.com"
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-6 h-14 focus:border-white/30 outline-none transition-all"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Message / Problem</label>
                <textarea 
                  placeholder="How can we help?"
                  rows={5}
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-6 py-4 focus:border-white/30 outline-none transition-all resize-none"
                />
             </div>
             <Button className="w-full h-14 btn-primary-obs">Send Message</Button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
