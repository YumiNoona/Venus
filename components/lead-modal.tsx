"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui";
import { Button } from "@/components/ui";
import { Sparkles } from "lucide-react";
import { LeadForm } from "./lead-form";
import { cn } from "@/lib/utils";

interface LeadModalProps {
  projectId: string;
  trigger?: React.ReactNode;
  inline?: boolean;
  onSuccess?: () => void;
}

export function LeadModal({ 
  projectId, 
  trigger, 
  inline = false, 
  onSuccess 
}: LeadModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  const content = (
    <div className={cn("space-y-6", !inline && "p-4")}>
      {!inline && (
        <div className="space-y-2 text-center pb-4 border-b border-neutral-800 relative z-10">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-[color:var(--text-primary)]">
            Showcase Access
          </h2>
          <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-[0.3em]">
            Premium Visualization · Confidential
          </p>
        </div>
      )}
      <div className="relative z-10">
        <LeadForm projectId={projectId} onFinish={handleSuccess} />
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="primary">Request Access</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-neutral-900 border-neutral-800 p-0 overflow-hidden">
        <div className="p-8 md:p-12 space-y-8 relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="h-32 w-32 text-[color:var(--accent)]" />
           </div>
           {content}
           <p className="text-center text-[9px] text-neutral-600 uppercase tracking-widest pt-4 relative z-10">
              Authorized personnel only · Data protected
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
