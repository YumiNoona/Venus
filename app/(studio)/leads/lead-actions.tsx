"use client";

import { useState } from "react";
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui";
import { Trash2, UserCheck, CheckCircle2 } from "lucide-react";
import { verifyLead, deleteLead } from "./actions";

interface LeadTableActionsProps {
  leadId: string;
  verified: boolean;
}

export function LeadTableActions({ leadId, verified }: LeadTableActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    await verifyLead(leadId);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteLead(leadId);
    setIsLoading(false);
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {!verified && (
          <Button 
             variant="ghost" 
             size="sm" 
             className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/10"
             onClick={handleVerify}
             disabled={isLoading}
             title="Mark Verified"
          >
            <UserCheck className="h-3.5 w-3.5" />
          </Button>
        )}

        <Button 
           variant="ghost" 
           size="sm" 
           className="h-8 w-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-500/10"
           onClick={() => setIsDeleting(true)}
           disabled={isLoading}
           title="Delete Inquiry"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Lead?</DialogTitle>
            <DialogDescription>
              This invitation will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
             <Button variant="ghost" onClick={() => setIsDeleting(false)} disabled={isLoading}>
                Cancel
             </Button>
             <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
                Delete
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
