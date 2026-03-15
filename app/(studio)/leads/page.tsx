import { requireUser } from "@/lib/auth";
import { LeadsClient } from "./leads-client";

// This page now renders instantly as a shell.
// Data fetching is handled by the client-side component to prevent SSR blocking.
export default async function LeadsPage() {
  await requireUser();
  
  return (
    <div className="page-container">
      <LeadsClient />
    </div>
  );
}
