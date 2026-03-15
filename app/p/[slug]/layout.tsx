"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="venus-project-theme" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
