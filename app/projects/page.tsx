import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { ProjectCard } from "@/components/project-card";
import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import type { Database } from "@/types/database";

export default async function ProjectsPage() {
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from("projects")
    .select("id,name,slug,thumbnail_dark,short_description,published")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const projects =
    (data as Database["public"]["Tables"]["projects"]["Row"][]) ?? [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Projects
            </h1>
            <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
              Each project becomes a calm, shareable client experience.
            </p>
          </div>
          <Link href="/projects/new" className="btn-accent">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </header>

        <section className="mt-8">
          {projects && projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <div key={p.id} className={`animate-slide-up delay-${Math.min(i + 1, 4)}`}>
                  <ProjectCard
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    thumbnail_dark={p.thumbnail_dark}
                    short_description={p.short_description}
                    published={p.published}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel flex flex-col items-center justify-center gap-4 p-14 text-center animate-slide-up">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[#111214]">
                <FolderKanban className="h-6 w-6 text-[color:var(--text-secondary)]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No projects yet</p>
                <p className="max-w-xs text-xs text-[color:var(--text-secondary)]">
                  Start with a single hero project. Venus will handle the
                  storytelling and lead capture.
                </p>
              </div>
              <Link href="/projects/new" className="btn-accent mt-2">
                <Plus className="h-3.5 w-3.5" />
                Create your first project
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
