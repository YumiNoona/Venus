import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

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

  const { data: leads } = await supabase
    .from("leads")
    .select("id,name,email,phone,created_at,project:projects(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  const typedLeads = (leads as LeadRow[]) ?? [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">
            Leads
          </h1>
          <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
            People who have stepped into your interactive experiences.
          </p>
        </header>
        <section className="glass-panel overflow-hidden">
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr] border-b border-[color:var(--border)] bg-[#08090d] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
            <span>Lead</span>
            <span>Project</span>
            <span>Contact</span>
            <span>Captured</span>
          </div>
          {typedLeads.length === 0 ? (
            <div className="px-4 py-6 text-sm text-[color:var(--text-secondary)]">
              No leads yet. Share a project link and invite a client to
              dive into the experience.
            </div>
          ) : (
            <ul className="divide-y divide-[color:var(--border)]">
              {typedLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr] px-4 py-3 text-xs text-[color:var(--text-secondary)]"
                >
                  <div className="flex flex-col">
                    <span className="text-[color:var(--text-primary)]">
                      {lead.name}
                    </span>
                    {lead.email && (
                      <span className="text-[10px]">
                        {lead.email}
                      </span>
                    )}
                  </div>
                  <div className="truncate">
                    {lead.project?.name ?? "—"}
                  </div>
                  <div className="space-y-0.5 text-[10px]">
                    {lead.phone && <div>{lead.phone}</div>}
                    {lead.email && <div>{lead.email}</div>}
                  </div>
                  <div className="text-[10px]">
                    {lead.created_at
                      ? new Date(
                          lead.created_at
                        ).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric"
                        })
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

