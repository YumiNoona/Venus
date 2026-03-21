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
    <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-background hidden lg:flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 group" prefetch>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-[10px] font-black text-background transition-all group-hover:scale-105 group-active:scale-95">
            V
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Venus
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-6 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                item.name === "Projects" && "tour-sidebar-projects",
                item.name === "Leads" && "tour-sidebar-leads"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.name}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-foreground rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
