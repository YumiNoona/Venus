"use client";

import Link from "next/link";
import { Mail, ArrowLeft, Inbox } from "lucide-react";
import { Button } from "@/components/ui";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[color:var(--bg)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo / Header */}
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-[color:var(--accent)] mb-6 shadow-xl">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
            Verify your email
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)] max-w-xs mx-auto">
            We've sent a verification link to your inbox. Please click it to activate your studio.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-800 bg-[color:var(--surface)] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-[color:var(--accent)] to-transparent opacity-50"></div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <Inbox className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[color:var(--text-primary)]">Check your inbox</h3>
                <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                  Look for an email from <strong>Venus Studio</strong>. If you don't see it, check your spam folder.
                </p>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            <div className="space-y-4">
              <p className="text-[10px] text-neutral-500 text-center italic">
                Verified your email? Refresh the page to access your dashboard.
              </p>
              <Button 
                variant="primary" 
                className="w-full group-hover:scale-[1.02] transition-transform"
                onClick={() => window.location.reload()}
              >
                I've verified my email
              </Button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[color:var(--accent)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={`h-px w-full ${className}`} />;
}
