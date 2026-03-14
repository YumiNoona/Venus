import Link from "next/link";
import { Card, Badge, Button } from "./ui";

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
      <div className="relative h-40 w-full overflow-hidden border-b border-[color:var(--border)] bg-[#050608]">
        {thumbnail_dark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail_dark}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 ease-subtle group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_0%_0%,#1f2933,transparent_45%),radial-gradient(circle_at_100%_100%,#020617,transparent_50%)]">
            <div className="h-10 w-10 rounded-lg border border-[color:var(--border)]" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-medium tracking-tight">
              {name}
            </div>
            <div className="mt-1 line-clamp-2 text-xs text-[color:var(--text-secondary)]">
              {short_description || "No description yet."}
            </div>
          </div>
          <Badge>{published ? "Published" : "Draft"}</Badge>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[color:var(--text-secondary)]">
          <span>/project/{slug}</span>
          <div className="flex gap-2">
            <Link href={`/projects/edit/${id}`}>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

