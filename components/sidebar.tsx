"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  CreditCard
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-bg-soft hidden lg:flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group" prefetch>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-black transition-impeccable group-hover:scale-110 group-active:scale-95">
            V
          </div>
          <span className="text-sm font-semibold tracking-tight text-text">
            Venus Studio
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-impeccable",
                isActive
                  ? "bg-bg-soft text-text"
                  : "text-text-secondary hover:bg-bg-soft hover:text-text"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-accent" : "text-text-secondary group-hover:text-text"
              )} />
              {item.name}
              {isActive && (
                <>
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-lg shadow-accent" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-accent rounded-r-full" />
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-impeccable hover:bg-bg-soft hover:text-text"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
