"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  Input,
  Label,
  Button
} from "@/components/ui";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { ArrowRight } from "lucide-react";

interface LeadModalProps {
  projectId: string;
  streamUrl: string;
  children: React.ReactNode;
}

export function LeadModal({
  projectId,
  streamUrl,
  children
}: LeadModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!streamUrl || !streamUrl.toLowerCase().startsWith("https://")) {
      setError("This experience link is not currently available.");
      return;
    }

    setLoading(true);

    const supabase = createBrowserSupabaseClient();

    const { error: insertError } = await (supabase as any)
      .from("leads")
      .insert({
        project_id: projectId,
        name,
        phone,
        email,
        verified: false
      });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setOpen(false);
    // Open stream in a new tab instead of navigating away
    window.open(streamUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--accent-soft)]">
            <ArrowRight className="h-4 w-4 text-[color:var(--accent)]" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Before you dive in
            </h2>
            <p className="text-[11px] text-[color:var(--text-secondary)]">
              Share a few details so the studio can follow up.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lead-name">Name</Label>
            <Input
              id="lead-name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input
              id="lead-phone"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            className="mt-2 w-full"
            disabled={loading}
          >
            {loading ? "Entering experience…" : "Dive experience"}
            {!loading && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
