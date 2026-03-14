import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { Sidebar } from "@/components/sidebar";
import { ProjectForm } from "@/components/project-form";

export default async function NewProjectPage() {
  await requireUser();

  return (
    <div className="page-container max-w-4xl pt-8">
      <header className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">
          New project
        </h1>
        <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
          Define the story, preview the page, and publish when it feels right.
        </p>
      </header>
      <ProjectForm />
    </div>
  );
}
