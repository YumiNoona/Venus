import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { Sidebar } from "@/components/sidebar";
import { Badge, Button } from "@/components/ui";
import Link from "next/link";
import { Users, Mail, Phone, Calendar, ArrowRight } from "lucide-react";

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

  // Fetch projects owned by user to filter leads
  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id);

  const projectIds = (userProjects ?? []).map((p: any) => p.id);
  let leads: LeadRow[] = [];

  if (projectIds.length > 0) {
    const { data: leadData } = await supabase
      .from("leads")
      .select("id,name,email,phone,created_at,project:projects(name)")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false })
      .limit(100);

    leads = (leadData as LeadRow[]) ?? [];
  }

  return (
    <div className="page-container space-y-10">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                Client Leads
              </h1>
              <p className="text-sm text-[color:var(--text-secondary)]">
                Manage and track potential clients who explored your projects.
              </p>
            </div>
            <Badge variant="accent" className="font-mono">{leads.length} Total</Badge>
          </header>

          {/* Table section */}
          <section>
            <div className="rounded-xl border border-neutral-800 bg-[color:var(--surface)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-900/50 border-b border-neutral-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-secondary)]">Lead info</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-secondary)]">Project</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-secondary)]">Contact Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-secondary)] text-right">Captured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {leads.length > 0 ? (
                      leads.map((lead) => (
                        <tr key={lead.id} className="group transition-colors hover:bg-neutral-900/50">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[color:var(--accent)] group-hover:border-[color:var(--accent)]/30 transition-colors">
                                {lead.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-[color:var(--text-primary)]">{lead.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-[color:var(--text-secondary)] truncate max-w-[180px]">
                              {lead.project?.name ?? "—"}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              {lead.email && (
                                <div className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
                                  <Mail className="h-3 w-3" />
                                  {lead.email}
                                </div>
                              )}
                              {lead.phone && (
                                <div className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
                                  <Phone className="h-3 w-3" />
                                  {lead.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="inline-flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
                              <Calendar className="h-3 w-3" />
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Users className="h-8 w-8 text-neutral-800" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-[color:var(--text-primary)]">No leads captured yet</p>
                              <p className="text-xs text-[color:var(--text-secondary)]">Share your project links to start receiving client interest.</p>
                            </div>
                            <Link href="/projects" className="pt-2">
                              <Button variant="secondary" size="sm">Go to Projects</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
    </div>
  );
}
