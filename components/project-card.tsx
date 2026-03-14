import Link from "next/link";
import { Card, Badge } from "./ui";
import { ExternalLink, Pencil } from "lucide-react";

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
    <Card className="group flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden border-b border-[color:var(--border)] bg-[#050608]">
        {thumbnail_dark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail_dark}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 ease-subtle group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#1a1d24,transparent_50%),radial-gradient(circle_at_70%_80%,#0d0f15,transparent_50%)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[#111214]">
              <span className="text-lg text-[color:var(--text-secondary)]">✦</span>
            </div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111214] via-transparent to-transparent opacity-60" />

        {/* Status badge */}
        <div className="absolute right-3 top-3">
          <Badge variant={published ? "success" : "default"}>
            {published && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />}
            {published ? "Live" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="text-sm font-medium tracking-tight text-[color:var(--text-primary)]">
            {name}
          </div>
          <div className="mt-1 line-clamp-2 text-xs text-[color:var(--text-secondary)] leading-relaxed">
            {short_description || "No description yet."}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-[color:var(--border)] pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[color:var(--text-secondary)]">
            <ExternalLink className="h-3 w-3" />
            /project/{slug}
          </span>
          <Link
            href={`/projects/edit/${id}`}
            className="flex items-center gap-1.5 rounded-md border border-[color:var(--border)] bg-[#15161a] px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-secondary)] transition-all duration-150 ease-subtle hover:border-[color:var(--accent)] hover:text-[color:var(--text-primary)]"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
        </div>
      </div>
    </Card>
  );
}
