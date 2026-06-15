"use client";

import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="venus-admin-theme">
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 lg:ml-56 relative">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
