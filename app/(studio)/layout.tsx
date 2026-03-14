"use client";

import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[color:var(--bg)] transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 lg:ml-64 relative">
        {children}
      </main>
    </div>
  );
}
