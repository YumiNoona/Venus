import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { Badge, Button, Card, Separator } from "@/components/ui";
import { Mail, Phone, Calendar, ArrowRight, UserCheck, Trash2, CheckCircle2, Filter } from "lucide-react";
import { LeadTableActions } from "./lead-actions";

interface LeadsPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { supabase, user } = await requireUser();
  const params = await searchParams;
  const filter = params.filter || "all";

  // 1. Fetch user's project IDs to scope leads
  const { data: userProjects } = (await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id)) as any;

  const projectIds = (userProjects || []).map((p: any) => p.id);

  let leadsQuery = supabase
    .from("leads")
    .select("*, project:projects(name)")
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (filter === "verified") {
    leadsQuery = leadsQuery.eq("verified", true);
  }

  const { data: leads } = (await leadsQuery) as any;

  const leadsList = leads || [];

  return (
    <div className="page-container space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
            Client Leads
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Review and manage inquiries from your project showcases.
          </p>
        </div>
        
        {/* Filter Controls (Simple Tabs) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900/50 border border-neutral-800 rounded-lg">
           <a href="/leads">
             <Button 
                variant={filter === "all" ? "secondary" : "ghost"} 
                size="sm" 
                className="text-[10px] uppercase font-bold tracking-widest h-8"
              >
               All Leads
             </Button>
           </a>
           <a href="/leads?filter=verified">
             <Button 
                variant={filter === "verified" ? "secondary" : "ghost"} 
                size="sm" 
                className="text-[10px] uppercase font-bold tracking-widest h-8"
              >
               Verified
             </Button>
           </a>
        </div>
      </header>

      {/* Table Section */}
      {leadsList.length > 0 ? (
        <Card className="p-0 overflow-hidden border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-800 bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Project Attribution</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">Captured</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {leadsList.map((lead: any) => (
                  <tr key={lead.id} className="group hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-[color:var(--accent)]">
                            {lead.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-[color:var(--text-primary)]">{lead.name}</span>
                            <div className="flex items-center gap-3 mt-0.5">
                               <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                                  <Mail className="h-2.5 w-2.5" /> {lead.email}
                               </span>
                               {lead.phone && (
                                 <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                                    <Phone className="h-2.5 w-2.5" /> {lead.phone}
                                 </span>
                               )}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <Badge variant="default" className="text-[10px] border-neutral-800 bg-neutral-900">
                          {lead.project?.name || "Deleted Project"}
                       </Badge>
                    </td>
                    <td className="px-6 py-5 text-center">
                       {lead.verified ? (
                         <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                         </div>
                       ) : (
                         <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                            Pending
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 text-xs text-neutral-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(lead.created_at).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <LeadTableActions leadId={lead.id} verified={lead.verified} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-neutral-800 bg-neutral-900/20">
          <div className="h-16 w-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
             <UserCheck className="h-8 w-8 text-neutral-700" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">No Leads Captured</h2>
            <p className="text-sm text-neutral-500 max-w-sm">When visitors submit inquiries on your project pages, they will appear here.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
