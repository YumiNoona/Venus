import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

interface LeadRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string | null;
  project: {
    name: string;
  } | null;
}

export default async function LeadsPage() {
  const { supabase, user } = await requireUser();

  // Only fetch leads that belong to the current user's projects
  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id);

  const projectIds = (userProjects ?? []).map((p: any) => p.id);

  let typedLeads: LeadRow[] = [];

  if (projectIds.length > 0) {
    const { data: leads } = await supabase
      .from("leads")
      .select("id,name,email,phone,created_at,project:projects(name)")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false })
      .limit(50);

    typedLeads = (leads as LeadRow[]) ?? [];
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Leads
            </h1>
            <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
              People who have stepped into your interactive experiences.
            </p>
          </div>
          <div className="badge badge-accent">
            {typedLeads.length} total
          </div>
        </header>

        <section className="glass-panel overflow-hidden animate-slide-up">
          {/* Table header */}
          <div className="table-header grid-cols-[2fr_1.5fr_1.5fr_1fr]">
            <span>Lead</span>
            <span>Project</span>
            <span>Contact</span>
            <span>Captured</span>
          </div>

          {typedLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[#111214]">
                <Users className="h-6 w-6 text-[color:var(--text-secondary)]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No leads yet</p>
                <p className="max-w-xs text-xs text-[color:var(--text-secondary)]">
                  Share a project link and invite a client to dive into the experience.
                </p>
              </div>
              <Link href="/projects" className="btn-soft">
                View projects
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[color:var(--border)]">
              {typedLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="table-row grid-cols-[2fr_1.5fr_1.5fr_1fr] items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-xs font-semibold text-[color:var(--accent)]">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[color:var(--text-primary)]">
                        {lead.name}
                      </span>
                      {lead.email && (
                        <span className="text-[11px] text-[color:var(--text-secondary)]">
                          {lead.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="truncate text-[13px]">
                    {lead.project?.name ?? "—"}
                  </div>
                  <div className="space-y-0.5 text-[12px]">
                    {lead.phone && <div>{lead.phone}</div>}
                    {lead.email && <div>{lead.email}</div>}
                  </div>
                  <div className="text-[12px]">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" }
                        )
                      : "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
