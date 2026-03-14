import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { Sidebar } from "@/components/sidebar";
import { Card, Button, Label } from "@/components/ui";
import { User, Mail, Settings, Shield, Clock } from "lucide-react";

export default async function SettingsPage() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("users")
    .select("name,email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = (profile as any)?.name ?? "Studio User";
  const displayEmail = (profile as any)?.email ?? user.email ?? "—";

  return (
    <div className="page-container max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
              Studio Settings
            </h1>
            <p className="text-sm text-[color:var(--text-secondary)]">
              Manage your architectural studio profile and system preferences.
            </p>
          </header>

          <div className="space-y-8">
            {/* Profile Section */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-neutral-800 pb-2">
                Identity
              </h2>
              <Card className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800">
                        <User className="h-4 w-4 text-[color:var(--accent)]" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Full Name</Label>
                        <p className="text-sm font-medium text-[color:var(--text-primary)]">{displayName}</p>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800">
                        <Mail className="h-4 w-4 text-[color:var(--accent)]" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Email Address</Label>
                        <p className="text-sm font-medium text-[color:var(--text-primary)]">{displayEmail}</p>
                      </div>
                    </div>
                 </div>
              </Card>
            </section>

            {/* Security Section (Placeholder) */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-neutral-800 pb-2">
                System Infrastructure
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Shield className="h-5 w-5 text-neutral-600" />
                      <div>
                        <p className="text-sm font-medium text-[color:var(--text-primary)]">Auth Session</p>
                        <p className="text-xs text-neutral-500">Handled by Supabase SSR</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
                   </div>
                </Card>

                <Card className="p-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-neutral-600" />
                      <div>
                        <p className="text-sm font-medium text-[color:var(--text-primary)]">Platform Version</p>
                        <p className="text-xs text-neutral-500">Venus v0.1.0-alpha</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-bold text-neutral-500 uppercase">Production</span>
                </Card>
              </div>
            </section>
          </div>

          {/* Dangerous Zone */}
          <footer className="pt-12">
            <div className="rounded-xl border border-red-900/20 bg-red-950/10 p-6 flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-sm font-semibold text-red-400">Account Deletion</p>
                 <p className="text-xs text-red-400/60">Destroy all architectural projects and lead data associated with this studio.</p>
              </div>
              <Button variant="ghost" className="text-red-400 hover:bg-red-400/10 hover:text-red-400">Request Deletion</Button>
            </div>
          </footer>
    </div>
  );
}
