import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { Settings, User, Mail } from "lucide-react";

export default async function SettingsPage() {
  const { supabase, user } = await requireUser();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("name,email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = (profile as any)?.name ?? "Studio user";
  const displayEmail = (profile as any)?.email ?? user.email ?? "—";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
            Manage your studio profile and preferences.
          </p>
        </header>

        <div className="max-w-2xl space-y-6 animate-slide-up">
          {/* Profile card */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-5">
              <Settings className="h-4 w-4 text-[color:var(--accent)]" />
              <h2 className="text-sm font-medium">Studio profile</h2>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center gap-4 rounded-lg border border-[color:var(--border)] bg-[#09090b] p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-soft)]">
                  <User className="h-5 w-5 text-[color:var(--accent)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--text-secondary)]">
                    Contact name
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-[color:var(--text-primary)]">
                    {displayName}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 rounded-lg border border-[color:var(--border)] bg-[#09090b] p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-soft)]">
                  <Mail className="h-5 w-5 text-[color:var(--accent)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--text-secondary)]">
                    Email address
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-[color:var(--text-primary)]">
                    {displayEmail}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Environment info */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
              <h2 className="text-sm font-medium">Environment</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[color:var(--border)] bg-[#09090b] p-3">
                <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--text-secondary)]">
                  Platform
                </div>
                <div className="mt-1 text-xs font-medium text-[color:var(--text-primary)]">
                  Venus v0.1.0
                </div>
              </div>
              <div className="rounded-lg border border-[color:var(--border)] bg-[#09090b] p-3">
                <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--text-secondary)]">
                  Backend
                </div>
                <div className="mt-1 text-xs font-medium text-[color:var(--text-primary)]">
                  Supabase (PostgreSQL)
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
