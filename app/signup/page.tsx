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
    if (loading) return;

    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/verify-email");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-bg bg-grid">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo / Header */}
        <div className="space-y-3 text-center">
          <Link href="/" className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            V
          </Link>
          <h1 className="text-2xl font-black tracking-tighter">
            Create your account
          </h1>
          <p className="text-sm text-text-secondary">
            Start managing interactive architectural projects.
          </p>
        </div>

        {/* Card */}
        <div className="premium-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-1">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                required
                disabled={loading}
                className="bg-black/5 dark:bg-black/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-1">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@studio.com"
                required
                disabled={loading}
                className="bg-black/5 dark:bg-black/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="bg-black/5 dark:bg-black/20"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400 animate-in shake duration-300">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full uppercase text-[10px] font-black tracking-[0.2em] h-12">
              Create account
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-primary transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="px-8 text-center text-xs leading-relaxed text-text-secondary opacity-60">
          By signing up, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}