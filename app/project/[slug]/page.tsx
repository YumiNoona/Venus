import Navbar from "@/components/navbar";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LeadModal } from "@/components/lead-modal";
import { VisitorTracker } from "@/components/visitor-tracker";
import type { Database } from "@/types/database";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

interface ProjectPublicPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params
}: ProjectPublicPageProps): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("projects")
    .select("name,short_description")
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) {
    return { title: "Project not found — Venus" };
  }

  return {
    title: `${(data as any).name} — Venus`,
    description:
      (data as any).short_description ??
      "Explore this interactive architectural experience on Venus."
  };
}

export default async function ProjectPublicPage({
  params
}: ProjectPublicPageProps) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("projects")
    .select(
      "id,name,slug,thumbnail_dark,short_description,long_description,stream_url"
    )
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle();

  const project =
    data as Database["public"]["Tables"]["projects"]["Row"] | null;

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-6 py-12">
        <VisitorTracker projectId={project.id} />

        {/* Hero */}
        <section className="space-y-4 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[#111214] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            Project experience
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-4xl">
            {project.name}
          </h1>
          {project.short_description && (
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {project.short_description}
            </p>
          )}
        </section>

        {/* Content grid */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] animate-slide-up delay-1">
          {/* Left — media + story */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="group h-56 w-full overflow-hidden rounded-xl border border-[color:var(--border)] bg-[#050608]">
              {project.thumbnail_dark ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnail_dark}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-subtle group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#1a1d24,transparent_50%),radial-gradient(circle_at_70%_80%,#0d0f15,transparent_50%)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[#111214]">
                    <span className="text-xl text-[color:var(--text-secondary)]">✦</span>
                  </div>
                </div>
              )}
            </div>

            {/* Story */}
            {project.long_description && (
              <article className="rounded-xl border border-[color:var(--border)] bg-[#0d0e12] p-6">
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-secondary)] mb-4">
                  About this project
                </div>
                <div className="text-sm leading-relaxed text-[color:var(--text-secondary)] whitespace-pre-line">
                  {project.long_description}
                </div>
              </article>
            )}
          </div>

          {/* Right — CTA panel */}
          <div className="glass-panel flex flex-col justify-between p-6 sticky top-24 self-start">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-soft)]">
                <ArrowRight className="h-5 w-5 text-[color:var(--accent)]" />
              </div>
              <h2 className="text-base font-semibold tracking-tight">
                Dive into the experience
              </h2>
              <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                You&apos;ll be redirected to a live, streamed experience of
                this project. No downloads or plugins required.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <LeadModal
                projectId={project.id}
                streamUrl={project.stream_url ?? "#"}
              >
                <button className="btn-accent w-full justify-between">
                  <span className="text-sm font-semibold">Dive experience</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] opacity-70">
                    New tab
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </button>
              </LeadModal>
              <p className="text-center text-[10px] text-[color:var(--text-secondary)]">
                By continuing, you agree to share your contact details with
                the studio for follow-up on this project.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[color:var(--border)] px-6 py-4 mt-auto">
        <div className="mx-auto flex max-w-4xl items-center justify-between text-[10px] text-[color:var(--text-secondary)]">
          <span>Powered by Venus</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
            Experience ready
          </span>
        </div>
      </footer>
    </div>
  );
}
