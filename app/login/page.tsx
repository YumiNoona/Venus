"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Label, Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();

    try {
      if (loginMode === "password") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }
      } else if (loginMode === "otp" && !otpSent) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          }
        });

        if (otpError) {
          setError(otpError.message);
          setLoading(false);
          return;
        }
        setOtpSent(true);
        setLoading(false);
        return;
      } else if (loginMode === "otp" && otpSent) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: otpToken,
          type: "email",
        });

        if (verifyError) {
          setError(verifyError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/dashboard");
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
            Sign in to Venus
          </h1>
          <p className="text-sm text-text-secondary">
            Access your projects and leads portal.
          </p>
        </div>

        {/* Card */}
        <div className="premium-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-1">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@studio.com"
                required
                disabled={otpSent || loading}
                className="bg-black/5 dark:bg-black/20"
              />
            </div>

            {loginMode === "password" ? (
              <div className="space-y-1.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Password</Label>
                  <button 
                    type="button" 
                    onClick={() => setLoginMode("otp")}
                    className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                  >
                    Magic link
                  </button>
                </div>
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
            ) : (
              <div className="space-y-1.5 animate-in fade-in duration-300">
                 <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="otp" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">{otpSent ? "Verification Code" : "Passwordless Access"}</Label>
                  {!otpSent && (
                    <button 
                      type="button" 
                      onClick={() => setLoginMode("password")}
                      className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                    >
                      Use password
                    </button>
                  )}
                </div>
                {otpSent ? (
                  <Input
                    id="otp"
                    type="text"
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="tracking-[0.5em] text-center font-bold bg-black/5 dark:bg-black/20"
                    maxLength={6}
                    required
                    disabled={loading}
                  />
                ) : (
                  <p className="text-xs text-text-secondary italic pb-2 ml-1">
                    We'll send a one-time code to your email for instant access.
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400 animate-in shake duration-300">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full uppercase text-[10px] font-black tracking-[0.2em] h-12">
              {loginMode === "otp" && !otpSent ? "Send magic code" : "Continue"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            
            {loginMode === "otp" && otpSent && (
              <button 
                type="button"
                className="w-full text-xs text-text-secondary hover:text-text mt-2 transition-colors"
                onClick={() => setOtpSent(false)}
                disabled={loading}
              >
                Change email or use password
              </button>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-primary transition-colors hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="px-8 text-center text-xs leading-relaxed text-text-secondary opacity-60">
          By clicking continue, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}