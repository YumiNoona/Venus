"use client"

import { useState, useEffect } from "react"
import { Badge, Button, Card, Input, Separator, Skeleton } from "@/components/ui"
import { 
  Mail, Phone, Calendar, Search, 
  Download, FileText, CheckCircle2, 
  Filter, X, ChevronDown, Monitor,
  Loader2
} from "lucide-react"
import { format } from "date-fns"
import { LeadTableActions } from "./lead-actions"
import { getLeads, getAdminProjects, verifyExportAccess } from "./actions"

export function LeadsClient() {
  const [leads, setLeads] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState("")
  const [projectId, setProjectId] = useState("all")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Initial load of both projects and leads (Parallel)
  useEffect(() => {
    const initFetch = async () => {
      try {
        const [projectsData, leadsData] = await Promise.all([
          getAdminProjects(),
          getLeads({})
        ]);
        setProjects(projectsData);
        setLeads(leadsData);
      } catch (err) {
        console.error("Initial load error:", err);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  // Filter updates
  useEffect(() => {
    if (initialLoading) return;

    const fetchFiltered = async () => {
      setLoading(true)
      try {
        const data = await getLeads({ 
          search: search.length >= 3 ? search : undefined, 
          projectId, 
          fromDate, 
          toDate 
        })
        setLeads(data)
      } catch (err) {
        console.error("Filter error:", err)
      } finally {
        setLoading(false)
      }
    }
    
    const timer = setTimeout(fetchFiltered, 500)
    return () => clearTimeout(timer)
  }, [search, projectId, fromDate, toDate, initialLoading])

  const exportCSV = async () => {
    if (leads.length === 0) return
    
    const verification = await verifyExportAccess("csv");
    if (!verification.allowed) {
      alert(verification.error);
      return;
    }

    const rows = leads.map(l => ({
      Name: l.name,
      Email: l.email,
      Phone: l.phone ? `\t${l.phone}` : "N/A",
      Project: l.projects?.name || "N/A",
      Device: l.visitors?.[0]?.device || "unknown",
      Date: format(new Date(l.created_at), "yyyy-MM-dd HH:mm")
    }))

    const headers = Object.keys(rows[0]).join(",")
    const csvContent = [
      headers,
      ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `venus-leads-${format(new Date(), "yyyyMMdd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportPDF = async () => {
    if (leads.length === 0) return

    const verification = await verifyExportAccess("pdf");
    if (!verification.allowed) {
      alert(verification.error);
      return;
    }

    setLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const { getStudioProfile } = await import("./actions");
      
      const profile = await getStudioProfile();
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.text(profile.name, 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Project Report: ${projectId === "all" ? "All Projects" : (leads[0]?.projects?.name || "Selected Project")}`, 14, 28);
      doc.text(`Generated: ${format(new Date(), "PPPpp")}`, 14, 34);
      
      const tableData = leads.map(l => [
        l.name,
        l.email,
        l.phone || "-",
        l.visitors?.[0]?.device || "unknown",
        l.verified ? "Verified" : "Pending",
        format(new Date(l.created_at), "MMM d, yyyy")
      ]);

      autoTable(doc, {
        head: [["Name", "Email", "Phone", "Device", "Status", "Date"]],
        body: tableData,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      doc.save(`venus-leads-${format(new Date(), "yyyyMMdd")}.pdf`);
    } catch (err) {
      console.error("PDF Export error:", err);
      alert("Failed to export PDF locally. Using fallback...");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leads
          </h1>
          <p className="text-sm text-muted-foreground">
            Analyze, filter and export your architectural inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={initialLoading} className="h-9 px-4 text-xs font-semibold">
            <Download className="h-3.5 w-3.5 mr-2 opacity-60" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF} disabled={initialLoading} className="h-9 px-4 text-xs font-semibold">
            <FileText className="h-3.5 w-3.5 mr-2 opacity-60" /> Export PDF
          </Button>
        </div>
      </header>

      {/* Filters Bar */}
      <Card className="p-4 bg-muted/20 border-border flex flex-wrap gap-4 items-end px-1 border-none shadow-none">
        <div className="flex-1 min-w-[240px] space-y-1.5 px-1">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Search Leads</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-background border-border"
            />
          </div>
        </div>

        <div className="w-full md:w-56 space-y-1.5 px-1">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Project</label>
          <select 
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={initialLoading}
            className="w-full h-10 bg-background border border-border rounded-md px-3 text-sm focus:border-foreground outline-none disabled:opacity-50 text-foreground transition-colors"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-end px-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">From</label>
            <Input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 bg-background border-border w-38 text-xs sm:text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">To</label>
            <Input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 bg-background border-border w-38 text-xs sm:text-sm"
            />
          </div>
        </div>

        {(search || projectId !== "all" || fromDate || toDate) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 text-muted-foreground hover:text-foreground text-xs"
            onClick={() => {
              setSearch("")
              setProjectId("all")
              setFromDate("")
              setToDate("")
            }}
          >
            <X className="h-4 w-4 mr-1 opacity-60" /> Reset
          </Button>
        )}
      </Card>

      {/* Leads Table */}
      <Card className="p-0 overflow-hidden border-border bg-transparent relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 text-foreground animate-spin" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Updating Dataset</span>
            </div>
          </div>
        )}

        {initialLoading ? (
          <div className="divide-y divide-border">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="px-6 py-6 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="space-y-2">
                         <Skeleton className="h-3 w-32" />
                         <Skeleton className="h-2 w-48" />
                      </div>
                   </div>
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-4 w-16" />
                </div>
             ))}
          </div>
        ) : leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Project</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Device</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Captured</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-xs font-bold text-foreground opacity-60">
                            {lead.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">{lead.name}</span>
                            <div className="flex items-center gap-3 mt-0.5 opacity-60">
                               <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                  <Mail className="h-2.5 w-2.5" /> {lead.email}
                                </span>
                               {lead.phone && (
                                 <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                    <Phone className="h-2.5 w-2.5" /> {lead.phone}
                                 </span>
                               )}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="default" className="text-[10px] h-5 px-2 rounded-full font-medium">
                          {lead.projects?.name || "Deleted"}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium opacity-60">
                          <Monitor className="h-3 w-3" />
                          {lead.visitors?.[0]?.device ? (
                            <span className="truncate max-w-[120px]" title={lead.visitors[0].device}>
                              {lead.visitors[0].device}
                            </span>
                          ) : "unknown"}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {lead.verified ? (
                         <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                         </div>
                       ) : (
                         <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">
                            Pending
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium opacity-60">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(lead.created_at), "MMM d, yyyy")}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <LeadTableActions leadId={lead.id} verified={lead.verified} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
               <Filter className="h-7 w-7 text-muted-foreground opacity-60" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold">No Leads Match</h2>
              <p className="text-sm text-muted-foreground max-w-sm">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
