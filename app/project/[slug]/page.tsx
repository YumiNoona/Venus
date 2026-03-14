import Navbar from "@/components/navbar";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LeadModal } from "@/components/lead-modal";
import { VisitorTracker } from "@/components/visitor-tracker";
import { Badge, Button } from "@/components/ui";
import type { Database } from "@/types/database";
import type { Metadata } from "next";
import { ArrowRight, Box, ShieldCheck } from "lucide-react";

interface ProjectPublicPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params
}: ProjectPublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("name,short_description")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) return { title: "Not Found — Venus" };

  return {
    title: `${(data as any).name} — Venus Experience`,
    description: (data as any).short_description ?? "Explore this architectural project."
  };
}

export default async function ProjectPublicPage({
  params
}: ProjectPublicPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("id,name,slug,thumbnail_dark,short_description,long_description,stream_url")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const project = data as Database["public"]["Tables"]["projects"]["Row"] | null;
  if (!project) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg)]">
      <Navbar />
      <VisitorTracker projectId={project.id} />
      
      <main className="page-container flex-1 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <Badge variant="accent">Architectural Experience</Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                {project.name}
              </h1>
              <p className="text-base text-[color:var(--text-secondary)] leading-relaxed max-w-2xl">
                {project.short_description}
              </p>
            </div>

            {/* Media/Image Area */}
            <div className="aspect-video w-full rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              {project.thumbnail_dark ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnail_dark}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Box className="h-12 w-12 text-neutral-800" />
                </div>
              )}
            </div>

            {/* Project Narrative */}
            {project.long_description && (
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold text-[color:var(--text-primary)] border-b border-neutral-800 pb-2">
                  Project Narrative
                </h2>
                <div className="text-sm text-[color:var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {project.long_description}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar / CTA */}
          <aside className="sticky top-28 space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-[color:var(--surface)] p-6 space-y-6 shadow-sm">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-[color:var(--accent)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Interactive Session</h3>
                  <p className="text-xs text-[color:var(--text-secondary)]">Secure endpoint connected</p>
                </div>
              </div>

              <Separator />

              <LeadModal projectId={project.id} streamUrl={project.stream_url ?? "#"}>
                <Button variant="primary" className="w-full h-11">
                  Enter Experience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </LeadModal>

              <p className="text-[10px] text-[color:var(--text-secondary)] text-center italic">
                Verified high-performance pixel streaming session. No downloads required.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-800 py-6 mt-12 bg-neutral-950/50">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center text-[10px] text-[color:var(--text-secondary)] uppercase tracking-widest font-medium">
          <span>Platform powered by Venus</span>
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </div>
        </div>
      </footer>
    </div>
  );
}

const Separator = () => <div className="h-[1px] w-full bg-neutral-800" />;
