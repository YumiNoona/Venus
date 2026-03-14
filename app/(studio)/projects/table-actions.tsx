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
import { MoreHorizontal, Power, Trash2, Edit, Copy, Check } from "lucide-react";
import { toggleProjectStatus, deleteProject } from "./actions";
import Link from "next/link";

interface ProjectTableActionsProps {
  projectId: string;
  published: boolean;
  slug: string;
}

export function ProjectTableActions({ projectId, published, slug }: ProjectTableActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = async () => {
    setIsLoading(true);
    await toggleProjectStatus(projectId, published);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteProject(projectId);
    setIsLoading(false);
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button 
           variant="ghost" 
           size="sm" 
           className="h-8 w-8 p-0" 
           onClick={handleCopy}
           title="Copy Link"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>

        <Link href={`/projects/edit/${projectId}`}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit">
            <Edit className="h-3.5 w-3.5" />
          </Button>
        </Link>

        <Button 
           variant="ghost" 
           size="sm" 
           className={`h-8 w-8 p-0 ${published ? 'text-emerald-500' : 'text-neutral-500'}`}
           onClick={handleToggle}
           disabled={isLoading}
           title={published ? "Unpublish" : "Publish"}
        >
          <Power className="h-3.5 w-3.5" />
        </Button>

        <Button 
           variant="ghost" 
           size="sm" 
           className="h-8 w-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-500/10"
           onClick={() => setIsDeleting(true)}
           disabled={isLoading}
           title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Project?</DialogTitle>
            <DialogDescription>
              This will permanently remove the project and all associated leads and visitor data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
             <Button variant="ghost" onClick={() => setIsDeleting(false)} disabled={isLoading}>
                Cancel
             </Button>
             <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
                Confirm Delete
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
