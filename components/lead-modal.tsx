"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  Input,
  Label,
  Button
} from "@/components/ui";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { ArrowRight, Box } from "lucide-react";

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
      setError("Experience link unavailable.");
      return;
    }

    setLoading(true);
    
    // Construct FormData for the server action
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

    const { submitLead } = await import("@/lib/actions/leads");
    const result = await submitLead(formData);

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to submit inquiry.");
      return;
    }

    setOpen(false);
    window.open(streamUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800">
              <Box className="h-5 w-5 text-[color:var(--accent)]" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-[color:var(--text-primary)]">
              Experience Access
            </h2>
            <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
              Please provide your contact details to enter the architectural experience. The studio will be notified.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="lead-name">Full Name</Label>
              <Input
                id="lead-name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="lead-email">Work Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="alex@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            </div>
            
            {error && (
              <div className="rounded-md border border-red-500/20 bg-[color:var(--danger-soft)] px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Preparing session..." : "Enter Experience"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
