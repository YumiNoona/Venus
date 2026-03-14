import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FolderKanban, Users, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-[color:var(--border)] bg-[#050509]">
      <div className="px-4 pb-4 pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
        Studio
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-150 ease-subtle",
                active
                  ? "bg-[#111214] text-[color:var(--text-primary)]"
                  : "text-[color:var(--text-secondary)] hover:bg-[#08090d] hover:text-[color:var(--text-primary)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

