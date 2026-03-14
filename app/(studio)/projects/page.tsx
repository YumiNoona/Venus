import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { Button, Badge, Card, Separator } from "@/components/ui";
import Link from "next/link";
import { Plus, MoreHorizontal, ExternalLink, Trash2, Power, Copy, Calendar, Globe } from "lucide-react";
import type { Database } from "@/types/database";
import { ProjectTableActions } from "./table-actions";

export default async function ProjectsPage() {
  const { supabase, user } = await requireUser();

  // Re-apply manual filter as backup for Next.js SSR session timing
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, slug, thumbnail_light, thumbnail_dark, short_description, published, created_at, visitors(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  const projects = (data as any[]) ?? [];

  return (
    <div className="page-container space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
            Projects
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Manage your architectural visualizations and public links.
          </p>
        </div>
        <Link href="/projects/new">
          <Button variant="primary" size="md" className="gap-2 shadow-lg shadow-[color:var(--accent)]/10">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </header>

      {/* Table Section */}
      {projects.length > 0 ? (
        <Card className="p-0 overflow-hidden border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-800 bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Project</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Slug / Link</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-center">Visitors</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Created</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {projects.map((project) => {
                  const thumbnail = project.thumbnail_dark || project.thumbnail_light;
                  const visitorCount = project.visitors?.[0]?.count ?? 0;

                  return (
                    <tr key={project.id} className="group hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-16 rounded-md bg-neutral-800 border border-neutral-700 overflow-hidden relative shrink-0">
                            {thumbnail ? (
                              <img src={thumbnail} alt={project.name} className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Globe className="h-4 w-4 text-neutral-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-[color:var(--text-primary)] truncate">{project.name}</span>
                            <span className="text-[10px] text-neutral-500 truncate max-w-[200px]">{project.short_description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono text-neutral-400">/p/{project.slug}</span>
                          <Link 
                              href={`/p/${project.slug}`} 
                              target="_blank"
                              className="text-[10px] text-[color:var(--accent)] hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              Visit Page <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-bold text-[color:var(--text-primary)]">{visitorCount}</span>
                          <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">unique views</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge 
                          variant={project.published ? "accent" : "default"}
                          className="text-[9px] py-0 px-2 h-5 border-neutral-800"
                        >
                          {project.published ? "Live" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <ProjectTableActions 
                            projectId={project.id} 
                            slug={project.slug}
                            published={project.published} 
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-neutral-800 bg-neutral-900/20">
          <div className="h-16 w-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
             <Globe className="h-8 w-8 text-neutral-700" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">No Projects Yet</h2>
            <p className="text-sm text-neutral-500 max-w-sm">Create your first architectural visualization to start showcasing your work.</p>
          </div>
          <Link href="/projects/new">
            <Button variant="primary">Create First Project</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
