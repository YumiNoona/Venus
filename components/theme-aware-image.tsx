"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeAwareImageProps {
  lightSrc: string | null;
  darkSrc: string | null;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function ThemeAwareImage({
  lightSrc,
  darkSrc,
  alt,
  className,
  aspectRatio = "aspect-[16/9]"
}: ThemeAwareImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("bg-neutral-900 border border-neutral-800 rounded-2xl", aspectRatio, className)} />;
  }

  const src = resolvedTheme === "light" ? lightSrc : darkSrc;
  const finalSrc = src || darkSrc || lightSrc;

  return (
    <div className={cn("relative overflow-hidden group", aspectRatio, className)}>
      <AnimatePresence mode="wait">
        {finalSrc ? (
          <motion.img
            key={finalSrc}
            src={finalSrc}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-neutral-900">
            <Box className="h-12 w-12 text-neutral-800" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
