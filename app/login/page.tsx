"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Label, Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

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
            Venus Studio Access
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Sign in to your studio
          </h1>
          <p className="text-xs text-[color:var(--text-secondary)]">
            Access your projects, leads, and visitor insights.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel space-y-4 p-6"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
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
              autoComplete="current-password"
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
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
        </form>

        <p className="text-center text-xs text-[color:var(--text-secondary)]">
          New to Venus?{" "}
          <Link
            href="/signup"
            className="text-[color:var(--accent)] underline-offset-4 hover:underline"
          >
            Create a studio account
          </Link>
        </p>
      </div>
    </div>
  );
}
