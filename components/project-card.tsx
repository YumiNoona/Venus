"use client";

import Link from "next/link";
import { Card, Badge, Button } from "./ui";
import { ExternalLink, Pencil, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  name: string;
  slug: string;
  thumbnail_dark: string | null;
  short_description: string | null;
  published: boolean;
}

export function ProjectCard({
  id,
  name,
  slug,
  thumbnail_dark,
  short_description,
  published
}: ProjectCardProps) {
  return (
    <Card className="group flex flex-col p-0 overflow-hidden hover:scale-[1.01] transition-transform duration-150">
      {/* Thumbnail Area */}
      <div className="aspect-video w-full bg-neutral-900 border-b border-neutral-800 relative overflow-hidden">
        {thumbnail_dark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail_dark}
            alt={name}
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Box className="h-8 w-8 text-neutral-800" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={published ? "success" : "default"}>
            {published ? "Live" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-tight text-[color:var(--text-primary)]">
            {name}
          </h3>
          <p className="text-xs text-[color:var(--text-secondary)] line-clamp-2 leading-relaxed h-8">
            {short_description || "No project description provided."}
          </p>
        </div>

        {/* Footer actions */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-800/50">
          <div className="flex items-center gap-1.5 text-[10px] text-[color:var(--text-secondary)] uppercase tracking-wider font-medium">
            <ExternalLink className="h-3 w-3" />
            /{slug}
          </div>
          <Link href={`/projects/edit/${id}`}>
            <Button variant="secondary" size="sm" className="h-7 px-2">
              <Pencil className="h-3 w-3 mr-1.5" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
