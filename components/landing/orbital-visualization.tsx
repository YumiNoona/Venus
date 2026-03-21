"use client";

import { motion } from "framer-motion";
import { Box, Home, Layout, Building2, Map, Users } from "lucide-react";

const ORBIT_1_ICONS = [
  { icon: <Home className="w-4 h-4" />, label: "Villa" },
  { icon: <Layout className="w-4 h-4" />, label: "Interior" },
];

const ORBIT_2_AVATARS = [
  { src: "https://i.pravatar.cc/150?u=1", color: "from-blue-500 to-indigo-500" },
  { src: "https://i.pravatar.cc/150?u=2", color: "from-purple-500 to-pink-500" },
  { src: "https://i.pravatar.cc/150?u=3", color: "from-orange-500 to-red-500" },
];

const ORBIT_3_ICONS = [
  { icon: <Building2 className="w-4 h-4" />, label: "High-rise" },
  { icon: <Map className="w-4 h-4" />, label: "Urban" },
  { icon: <Box className="w-4 h-4" />, label: "Masterplan" },
];

export default function OrbitalVisualization() {
  return (
    <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">
      {/* Central Core */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-44 h-44 rounded-full glass border-white/10 flex flex-col items-center justify-center shadow-2xl glow-indigo"
      >
        <p className="text-4xl font-black tracking-tighter text-text">20k+</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Specialists</p>
      </motion.div>

      {/* Orbit 1 - Inner */}
      <div className="orbital-ring w-[60%] h-[60%]" />
      <OrbitingGroup items={ORBIT_1_ICONS} radius="30%" duration={20} />

      {/* Orbit 2 - Middle */}
      <div className="orbital-ring w-[80%] h-[80%] border-dashed opacity-20" />
      <OrbitingGroup items={ORBIT_2_AVATARS} radius="40%" duration={35} reverse />

      {/* Orbit 3 - Outer */}
      <div className="orbital-ring w-full h-full opacity-10" />
      <OrbitingGroup items={ORBIT_3_ICONS} radius="50%" duration={50} />

      {/* Connection Lines (Aesthetics) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-px h-20 bg-gradient-to-b from-primary/20 to-transparent rotate-45" />
        <div className="absolute bottom-[20%] right-[20%] w-px h-20 bg-gradient-to-t from-accent/20 to-transparent rotate-45" />
      </div>
    </div>
  );
}

function OrbitingGroup({ items, radius, duration, reverse = false }: { items: any[], radius: string, duration: number, reverse?: boolean }) {
  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      {items.map((item, index) => {
        const offsetAngle = (360 / items.length) * index;
        return (
          <div 
            key={index}
            className="absolute flex items-center justify-center pointer-events-auto"
            style={{ 
              transform: `rotate(${offsetAngle}deg) translateX(${radius}) rotate(-${offsetAngle}deg)` 
            }}
          >
            <motion.div
              animate={{ rotate: reverse ? 360 : -360 }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
              className="group relative"
            >
              {item.src ? (
                // Avatar Node
                <div className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-br ${item.color} shadow-lg transition-transform hover:scale-110`}>
                  <img src={item.src} alt="Lead" className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border-2 border-bg" />
                </div>
              ) : (
                // Icon Node
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-primary border-white/10 shadow-lg group-hover:scale-110 group-hover:border-primary/40 transition-all">
                  {item.icon}
                  {item.label && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 glass rounded text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}
