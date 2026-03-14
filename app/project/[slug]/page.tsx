import Navbar from "@/components/navbar";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LeadModal } from "@/components/lead-modal";
import { VisitorTracker } from "@/components/visitor-tracker";
import type { Database } from "@/types/database";

interface ProjectPublicPageProps {
  params: { slug: string };
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
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-10">
        <VisitorTracker projectId={project.id} />
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
            Project experience
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {project.name}
          </h1>
          {project.short_description && (
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {project.short_description}
            </p>
          )}
        </section>
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
          <div className="space-y-4">
            <div className="h-52 w-full overflow-hidden rounded-xl border border-[color:var(--border)] bg-[radial-gradient(circle_at_0%_0%,#1f2933,transparent_45%),radial-gradient(circle_at_100%_100%,#020617,transparent_50%)]">
              {project.thumbnail_dark && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnail_dark}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {project.long_description && (
              <article className="prose prose-invert max-w-none text-sm leading-relaxed text-[color:var(--text-secondary)] prose-p:mb-3 prose-p:mt-0">
                {project.long_description}
              </article>
            )}
          </div>
          <div className="glass-panel flex flex-col justify-between p-5">
            <div className="space-y-2">
              <h2 className="text-sm font-medium tracking-tight">
                Dive into the interactive experience
              </h2>
              <p className="text-xs text-[color:var(--text-secondary)]">
                You&apos;ll be redirected to a live, streamed experience of
                this project. No downloads or plugins required.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <LeadModal
                projectId={project.id}
                streamUrl={project.stream_url ?? "#"}
              >
                <button className="btn-primary w-full justify-between text-xs">
                  <span>Dive experience</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
                    Starts in a new tab
                  </span>
                </button>
              </LeadModal>
              <p className="text-[10px] text-[color:var(--text-secondary)]">
                By continuing, you agree to share your contact details with
                the studio for follow-up on this project.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

