import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui";
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
    <div className="page-container space-y-10">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                Projects
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)]">
                Manage your architectural visualization projects and experience links.
              </p>
            </div>
            <Link href="/projects/new">
              <Button variant="primary" size="md" className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </header>

          {/* Grid section */}
          <section>
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                  <div key={project.id} className="animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                    <ProjectCard
                      id={project.id}
                      name={project.name}
                      slug={project.slug}
                      thumbnail_dark={project.thumbnail_dark}
                      short_description={project.short_description}
                      published={project.published}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-neutral-800 bg-[color:var(--surface)] p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800">
                  <FolderKanban className="h-6 w-6 text-neutral-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">No projects found</h3>
                  <p className="max-w-[240px] text-xs text-[color:var(--text-secondary)] leading-relaxed">
                    Create your first architectural experience to start capturing client leads.
                  </p>
                </div>
                <Link href="/projects/new">
                  <Button variant="primary" size="sm" className="mt-2">
                    Create First Project
                  </Button>
                </Link>
              </div>
            )}
          </section>
    </div>
  );
}
