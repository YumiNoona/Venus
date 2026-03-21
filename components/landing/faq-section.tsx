"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How are visitor details collected?",
    a: "Visitors are presented with a customizable verification form before accessing the interactive experience. Their details are automatically mapped to your project leads dashboard."
  },
  {
    q: "How are projects shared?",
    a: "Each project is published to a dedicated, high-performance project page. You can share the link directly with clients or via social media."
  },
  {
    q: "Can projects be restricted to specific visitors?",
    a: "Yes. You can enable password protection or visitor verification on a per-project basis to ensure only high-intent leads access your experiences."
  },
  {
    q: "Can data be exported for sales teams?",
    a: "Absolutely. All visitor intelligence and lead data can be exported in standard formats for integration with your existing CRM or project workflows."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-40 bg-bg-primary">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center space-y-6 mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic text-text-primary">
            Frequently Asked <br /> Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border-subtle bg-bg-secondary rounded-2xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-text-primary">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-8 pb-8 text-sm text-text-secondary uppercase tracking-wider font-medium leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
