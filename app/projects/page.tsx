import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { ProjectCard } from "@/components/project-card";
import Link from "next/link";
import { Button } from "@/components/ui";

export default async function ProjectsPage() {
  const { supabase, user } = await requireUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id,name,slug,thumbnail_dark,short_description,published")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
          <Button asChild>
            <Link href="/projects/new">New project</Link>
          </Button>
        </header>
        <section className="mt-8">
          {projects && projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  thumbnail_dark={p.thumbnail_dark}
                  short_description={p.short_description}
                  published={p.published}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel flex flex-col items-center justify-center gap-3 p-10 text-center text-sm text-[color:var(--text-secondary)]">
              <p>No projects yet.</p>
              <p className="max-w-xs text-xs">
                Start with a single hero project. Venus will handle the
                storytelling and lead capture.
              </p>
              <Button asChild size="sm">
                <Link href="/projects/new">Create your first project</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

