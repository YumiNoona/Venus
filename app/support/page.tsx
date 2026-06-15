"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !message) return;
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Failed to send message. Please try again later.");
    }
  }

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

          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-4xl">✓</div>
              <p className="text-lg text-text-secondary">Message sent! We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left pt-12 bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/[0.05]">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Your Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  required
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-6 h-14 focus:border-white/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Message / Problem</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  rows={5}
                  required
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-6 py-4 focus:border-white/30 outline-none transition-all resize-none"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full h-14 btn-primary-obs">Send Message</Button>
            </form>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
