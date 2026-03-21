"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <main className="container mx-auto px-6 py-40 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl space-y-8"
        >
          <div className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Contact</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Get in Touch</h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
            We're building the future of architectural presentation. Join us or reach out for inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">General Inquiries</h3>
                <p className="text-2xl font-bold text-white">hello@venus.studio</p>
            </div>
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">Sales & Partnership</h3>
                <p className="text-2xl font-bold text-white">sales@venus.studio</p>
            </div>
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">Office</h3>
                <p className="text-xl font-medium text-white leading-relaxed">
                    123 Architect Plaza <br />
                    Suite 400 <br />
                    San Francisco, CA 94103
                </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
