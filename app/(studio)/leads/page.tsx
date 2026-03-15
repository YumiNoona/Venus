import { requireUser } from "@/lib/auth";
import { getLeads, getAdminProjects } from "./actions";
import { LeadsClient } from "./leads-client";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requireUser();
  
  // 1. Fetch initial leads (limit to first load)
  const leads = await getLeads({});
  
  // 2. Fetch projects for filter dropdown
  const projects = await getAdminProjects();

  return (
    <div className="page-container">
      <LeadsClient 
        initialLeads={leads} 
        projects={projects} 
      />
    </div>
  );
}
