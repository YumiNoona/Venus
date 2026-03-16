"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ProjectThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-10" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-10 w-10 flex items-center justify-center rounded-xl bg-black/20 border transition-all duration-300 backdrop-blur-md",
        isDark ? "border-border text-text-secondary hover:text-white" : "border-neutral-200 text-text-secondary hover:text-black"
      )}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 animate-in zoom-in duration-300" />
      ) : (
        <Moon className="h-4 w-4 animate-in zoom-in duration-300" />
      )}
    </button>
  );
}
