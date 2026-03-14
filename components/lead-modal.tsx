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
  const router = useRouter();
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
    router.push(streamUrl);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <h2 className="text-base font-semibold tracking-tight">
          Before you dive in
        </h2>
        <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
          Share a few details so the studio can follow up with the
          experience and next steps.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-3"
        >
          <div className="space-y-1">
            <Label htmlFor="lead-name">Name</Label>
            <Input
              id="lead-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input
              id="lead-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={loading}
          >
            {loading ? "Entering experience…" : "Dive experience"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

