"use client";

import { motion } from "framer-motion";
import { Layers, Puzzle, EyeOff, UserMinus } from "lucide-react";

const PROBLEMS = [
  {
    icon: <Layers className="w-5 h-5 text-accent-violet" />,
    title: "Fragmented sharing",
    description: "Projects are distributed across multiple links and platforms."
  },
  {
    icon: <Puzzle className="w-5 h-5 text-accent-violet" />,
    title: "Lack of presentation context",
    description: "Clients enter experiences without understanding the story behind them."
  },
  {
    icon: <EyeOff className="w-5 h-5 text-accent-violet" />,
    title: "No visitor intelligence",
    description: "Teams rarely know who explored the project."
  },
  {
    icon: <UserMinus className="w-5 h-5 text-accent-violet" />,
    title: "Sales teams lose valuable leads",
    description: "Visitor engagement remains invisible."
  }
];

export default function ProblemSection() {
  return (
    <section id="features" className="py-32 bg-bg-primary relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic">
            Sharing Interactive Projects <br /> Should Be Simple
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto uppercase tracking-wide font-medium">
            Yet most teams struggle to distribute immersive environments
            while maintaining visibility into who actually explored them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROBLEMS.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-card-bg border border-border-subtle rounded-3xl space-y-6 group hover:border-accent-violet/50 transition-all duration-500 glow-violet"
            >
              <div className="w-12 h-12 bg-bg-primary border border-border-subtle rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                {problem.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold uppercase tracking-tight">{problem.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed uppercase tracking-wider font-medium text-[12px]">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
