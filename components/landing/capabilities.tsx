"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Upload, 
  Settings, 
  Database 
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Project Management",
    description: "Create and manage multiple projects from one studio dashboard."
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Access Control",
    description: "Control how visitors access experiences through verification methods."
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Lead Capture",
    description: "Collect visitor information automatically when they enter experiences."
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Visitor Analytics",
    description: "Understand engagement and visitor activity across projects."
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Exportable Data",
    description: "Export visitor information for sales and marketing workflows."
  },
  {
    icon: <Upload className="w-5 h-5" />,
    title: "Studio Dashboard",
    description: "Monitor project activity, visitor metrics, and engagement trends."
  }
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-32 bg-bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Everything Needed to Present <br /> and Track Interactive Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-8 bg-zinc-900/40 backdrop-blur-md border border-white/[0.04] rounded-[2rem] space-y-6 group hover:border-white/[0.1] hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                {cap.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight text-white">{cap.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  {cap.description}
                </p>
              </div>
              
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
