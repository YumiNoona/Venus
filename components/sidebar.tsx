"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FolderKanban, Users, Settings, LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-[color:var(--border)] bg-[#050509] sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pb-2 pt-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[color:var(--accent)] to-[#a07d4a] text-[10px] font-bold text-black">
          V
        </span>
        <span className="text-sm font-semibold tracking-tight text-[color:var(--text-primary)]">
          Venus
        </span>
      </div>

      {/* Section label */}
      <div className="px-5 pb-3 pt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
        Studio
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ease-subtle",
                active
                  ? "bg-[#111214] text-[color:var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border)]"
                  : "text-[color:var(--text-secondary)] hover:bg-[#0d0e12] hover:text-[color:var(--text-primary)]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors duration-150",
                  active
                    ? "text-[color:var(--accent)]"
                    : "text-[color:var(--text-secondary)] group-hover:text-[color:var(--text-primary)]"
                )}
              />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-[color:var(--border)] p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[color:var(--text-secondary)] transition-all duration-150 ease-subtle hover:bg-[#0d0e12] hover:text-[color:var(--text-primary)]"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
