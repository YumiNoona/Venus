import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { ProjectForm } from "@/components/project-form";

export default async function NewProjectPage() {
  await requireUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">
            New project
          </h1>
          <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
            Define the story, preview the page, and publish when it feels right.
          </p>
        </header>
        <ProjectForm />
      </main>
    </div>
  );
}
