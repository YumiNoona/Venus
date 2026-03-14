import { requireUser, getUserProfile } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { AccountSettings } from "./account-settings";

export default async function SettingsPage() {
  const { user, profile } = await getUserProfile();

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
      </div>
    </div>
  );
}
