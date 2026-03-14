"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();

    // 1. Auth account
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    const user = data.user;
    if (!user) {
      setLoading(false);
      setError("Registration failed. Please try again.");
      return;
    }

    // 2. Profile row
    const { error: profileError } = await (supabase as any)
      .from("users")
      .insert({
        id: user.id,
        email: user.email,
        name: name,
      });

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[color:var(--bg)]">
      <div className="w-full max-w-md space-y-8 page-transition">
        {/* Logo / Header */}
        <div className="space-y-3 text-center">
          <Link href="/" className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)] text-sm font-bold text-black transition-transform hover:scale-105">
            V
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
            Create your studio
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Start managing interactive architectural projects.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-neutral-800 bg-[color:var(--surface)] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Studio Representative Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@studio.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-[color:var(--danger-soft)] px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800">
            <p className="text-center text-sm text-[color:var(--text-secondary)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-hover)]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="px-8 text-center text-xs leading-relaxed text-[color:var(--text-secondary)]">
          By signing up, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}