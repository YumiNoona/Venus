"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui";
import { ArrowDown, Play } from "lucide-react";

interface ProjectHeroProps {
  name: string;
  description: string;
  thumbnailLight: string | null;
  thumbnailDark: string | null;
}

export function ProjectHero({
  name,
  description,
  thumbnailLight,
  thumbnailDark
}: ProjectHeroProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-[90vh] w-full bg-neutral-900 border-b border-neutral-800" />
    );
  }

  const cover = resolvedTheme === "light" ? thumbnailLight : thumbnailDark;
  const finalCover = cover || thumbnailDark || thumbnailLight;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex flex-col justify-center px-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {finalCover ? (
          <img
            src={finalCover}
            alt={name}
            className="h-full w-full object-cover grayscale-[10%] brightness-[0.7] transition-all duration-700"
          />
        ) : (
          <div className="h-full w-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto max-w-5xl w-full space-y-8 text-white">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-[#C9A46C] rounded-full" />
            <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#C9A46C]">
              Architectural Showcase
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none drop-shadow-2xl">
            {name}
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed font-medium drop-shadow-md">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Button
            variant="primary"
            size="lg"
            className="gap-2 h-14 px-8 text-xs font-bold uppercase tracking-widest shadow-2xl shadow-black/40"
            onClick={() => scrollTo("immersive")}
          >
            <Play className="h-4 w-4 fill-current" />
            Enter Experience
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="gap-2 h-14 px-8 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10"
            onClick={() => scrollTo("story")}
          >
            Explore
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
