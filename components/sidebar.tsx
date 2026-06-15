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
    <aside className="fixed inset-y-0 left-0 z-30 w-80 border-r border-white/5 bg-black hidden lg:flex flex-col">
      {/* Brand */}
      <div className="h-24 flex items-center justify-between px-8">
        <Link href="/dashboard" className="flex items-center gap-4 group" prefetch>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-xs font-black text-black transition-all group-hover:scale-105 group-active:scale-95 shadow-[0_0_20px_rgba(202,138,4,0.3)]">
            V
          </div>
          <span className="text-xl font-black tracking-tighter text-white italic uppercase">
            Venus
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch
              className={cn(
                "group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-bold transition-all duration-300",
                isActive
                  ? "text-white bg-white/5"
                  : "text-white/40 hover:bg-white/5 hover:text-white",
                item.name === "Projects" && "tour-sidebar-projects",
                item.name === "Leads" && "tour-sidebar-leads"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-gold" : "text-white/20 group-hover:text-white/60"
              )} />
              {item.name}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gold rounded-r-full shadow-[0_0_15px_rgba(202,138,4,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-6 border-t border-white/5 mt-auto">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-base font-bold text-white/40 transition-all hover:bg-red-500/10 hover:text-red-400 group"
        >
          <LogOut className="h-5 w-5 transition-colors text-white/20 group-hover:text-red-400/60" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
