"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Label, Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError || !data.user) {
      setLoading(false);
      setError(signUpError?.message ?? "Unable to sign up.");
      return;
    }

    await (supabase as any)
      .from("users")
      .insert({ id: data.user.id, email, name })
      .then(() => undefined)
      .catch(() => undefined);

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 animate-slide-up">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--accent)] to-[#a07d4a] text-sm font-bold text-black">
            V
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[#111214] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            Venus Studio Onboarding
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Create your studio account
          </h1>
          <p className="text-xs text-[color:var(--text-secondary)]">
            Start presenting projects with a single, thoughtful link.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel space-y-4 p-6"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Studio contact name</Label>
            <Input
              id="name"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@studio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-[color:var(--danger-soft)] px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}
          <Button
            type="submit"
            variant="accent"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating studio…" : "Create account"}
            {!loading && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
        </form>

        <p className="text-center text-xs text-[color:var(--text-secondary)]">
          Already have a studio?{" "}
          <Link
            href="/login"
            className="text-[color:var(--accent)] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
