import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { Button, Badge, Card, Separator } from "@/components/ui";
import Link from "next/link";
import { Plus, MoreHorizontal, ExternalLink, Trash2, Power, Copy, Calendar, Globe } from "lucide-react";
import type { Database } from "@/types/database";
import { ProjectTableActions } from "./table-actions";
import { cn } from "@/lib/utils";

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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your architectural visualizations and public links.
          </p>
        </div>
        <Link href="/projects/new">
          <Button variant="primary" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </header>

      {/* Table Section */}
      {projects.length > 0 ? (
        <Card className="p-0 overflow-hidden border-border bg-transparent">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Project</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Slug / Link</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Visitors</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => {
                  const thumbnail = project.thumbnail_dark || project.thumbnail_light;
                  const visitorCount = project.visitors?.[0]?.count ?? 0;

                  return (
                    <tr key={project.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-16 rounded-md bg-muted border border-border overflow-hidden relative shrink-0">
                            {thumbnail ? (
                              <img src={thumbnail} alt={project.name} className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-foreground truncate">{project.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[240px]">{project.short_description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-mono text-muted-foreground">
                            {project.slug}.{process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'venusapp.in'}
                          </span>
                          <Link 
                              href={`/p/${project.slug}`} 
                              target="_blank"
                              className="text-[10px] text-foreground font-medium hover:underline flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                          >
                              Visit Page <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-semibold text-foreground">{visitorCount}</span>
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">views</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={project.published ? "success" : "default"}
                          className={cn(
                            "text-[10px] py-0 px-2 h-5 font-medium rounded-full",
                            !project.published && "text-muted-foreground"
                          )}
                        >
                          {project.published ? "Live" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
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
        <Card className="p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-border bg-muted/10">
          <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
             <Globe className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold">No Projects Yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm">Create your first architectural visualization to start showcasing your work.</p>
          </div>
          <Link href="/projects/new">
            <Button variant="primary">Create First Project</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
