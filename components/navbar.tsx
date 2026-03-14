"use client";

import Link from "next/link";
import { Button } from "./ui";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <nav className="sticky top-0 z-40 h-16 border-b border-[color:var(--border)] bg-[color:var(--bg)]/80 backdrop-blur transition-impeccable">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 transition-impeccable hover:opacity-80" prefetch>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)] text-xs font-bold text-black transition-impeccable hover:scale-110">
            V
          </div>
          <span className="text-sm font-semibold tracking-tight text-[color:var(--text-primary)]">
            Venus
          </span>
        </Link>

        {/* Auth Items */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" prefetch>
              <Button variant="primary" size="sm" className="gap-2">
                Go to Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[color:var(--text-secondary)] transition-impeccable hover:text-[color:var(--text-primary)]" prefetch>
                Sign in
              </Link>
              <Link href="/signup" prefetch>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
