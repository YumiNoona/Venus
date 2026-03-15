import { requireUser, getUserProfile } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { AccountSettings } from "./account-settings";
import { getSubscription } from "@/lib/actions/billing";
import { PLAN_FEATURES, type PlanType } from "@/lib/config/plans";
import { Card, Label, Badge } from "@/components/ui";
import { Globe, Lock } from "lucide-react";

export default async function SettingsPage() {
  const { user, profile } = await getUserProfile();
  const sub = await getSubscription();
  const features = sub ? PLAN_FEATURES[sub.plan as PlanType] : PLAN_FEATURES.free;

  const studioProfile = {
    name: (profile as any)?.name ?? "Studio User",
    email: (profile as any)?.email ?? user.email ?? "—",
    avatar_url: (profile as any)?.avatar_url ?? "",
  };

  return (
    <div className="page-container flex justify-center pt-10">
      <div className="w-full max-w-[700px] space-y-12">
        <header className="space-y-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[color:var(--text-primary)]">
            Settings
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Manage your personal account, security, and identity.
          </p>
        </header>

        <AccountSettings user={user} profile={studioProfile} />

        {/* Custom Domains Section (Gated) */}
        <div className="space-y-6 pt-12 border-t border-neutral-800">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">Custom Domains</h2>
              <p className="text-sm text-neutral-500 italic">Connect your own brand to the Venus experience.</p>
            </div>
            
            <Card className="p-8 bg-neutral-900/40 border-neutral-800 relative group overflow-hidden">
                {!features.white_label && (
                   <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-500">
                      <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-2xl">
                         <Lock className="h-6 w-6 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white uppercase tracking-widest">Agency Feature</p>
                        <p className="text-xs text-neutral-400 max-w-[280px]">Custom domain binding is exclusive to Agency partners. Upgrade to connect your domain.</p>
                      </div>
                      <Badge variant="accent" className="bg-amber-500 text-black border-none font-black text-[9px] px-3 py-1 cursor-pointer hover:scale-105 transition-transform">UPGRADE TO AGENCY</Badge>
                   </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Primary Domain</Label>
                      <p className="text-sm text-neutral-500">No custom domains connected.</p>
                    </div>
                  </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
