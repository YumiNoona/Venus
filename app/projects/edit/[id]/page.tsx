import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { ProjectForm } from "@/components/project-form";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({
  params
}: EditProjectPageProps) {
  const { supabase, user } = await requireUser();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">
            Edit project
          </h1>
          <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
            Adjust content, thumbnails, and access without breaking the
            public link.
          </p>
        </header>
        <ProjectForm
          initial={{
            id: project.id,
            name: project.name,
            slug: project.slug,
            thumbnail_light: project.thumbnail_light ?? "",
            thumbnail_dark: project.thumbnail_dark ?? "",
            short_description: project.short_description ?? "",
            long_description: project.long_description ?? "",
            stream_url: project.stream_url ?? "",
            auth_type: project.auth_type,
            password: project.password ?? "",
            published: project.published
          }}
        />
      </main>
    </div>
  );
}

