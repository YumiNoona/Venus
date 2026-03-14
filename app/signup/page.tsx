"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Label, Button } from "@/components/ui";

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

    const { data, error: signUpError } =
      await supabase.auth.signUp({
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
      .insert({
        id: data.user.id,
        email,
        name
      })
      .then(() => undefined)
      .catch(() => undefined);

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            Venus Studio Onboarding
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">
            Create your studio account
          </h1>
          <p className="text-xs text-[color:var(--text-secondary)]">
            Start presenting projects with a single, thoughtful link.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="glass-panel space-y-4 p-5"
        >
          <div className="space-y-1">
            <Label htmlFor="name">Studio contact name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating studio…" : "Create account"}
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

