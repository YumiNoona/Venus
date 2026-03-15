"use client"

import { useState, useEffect } from "react"
import { Badge, Button, Card, Input } from "@/components/ui"
import { 
  Mail, Phone, Calendar, Search, 
  Download, FileText, CheckCircle2, 
  Filter, X, ChevronDown, Monitor
} from "lucide-react"
import { format } from "date-fns"
import { LeadTableActions } from "./lead-actions"
import { getLeads, verifyExportAccess } from "./actions"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface LeadsClientProps {
  initialLeads: any[];
  projects: any[];
}

export function LeadsClient({ initialLeads, projects }: LeadsClientProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [loading, setLoading] = useState(false)
  
  // Filters
  const [search, setSearch] = useState("")
  const [projectId, setProjectId] = useState("all")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Fetch data when filters change
  useEffect(() => {
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
  }, [search, projectId, fromDate, toDate])

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
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (projectId !== "all") params.append("projectId", projectId);
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);

      const response = await fetch(`/api/leads/export/pdf?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `venus-leads-${format(new Date(), "yyyyMMdd")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF Export error:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
            Lead Management
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Analyze, filter and export your architectural inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={exportCSV} className="text-[10px] uppercase font-bold tracking-widest h-10 px-4 border border-neutral-800">
            <Download className="h-3.5 w-3.5 mr-2" /> CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={exportPDF} className="text-[10px] uppercase font-bold tracking-widest h-10 px-4 border border-neutral-800">
            <FileText className="h-3.5 w-3.5 mr-2" /> PDF
          </Button>
        </div>
      </header>

      {/* Filters Bar */}
      <Card className="p-4 bg-neutral-900/40 border-neutral-800 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[240px] space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest ml-1">Search Leads</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <Input 
              placeholder="Name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-black/40 border-neutral-800"
            />
          </div>
        </div>

        <div className="w-full md:w-56 space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest ml-1">Project</label>
          <select 
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full h-10 bg-black/40 border border-neutral-800 rounded-md px-3 text-sm focus:border-[color:var(--accent)] outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest ml-1">From</label>
            <Input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 bg-black/40 border-neutral-800 w-40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest ml-1">To</label>
            <Input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 bg-black/40 border-neutral-800 w-40"
            />
          </div>
        </div>

        {(search || projectId !== "all" || fromDate || toDate) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 text-neutral-500 hover:text-white"
            onClick={() => {
              setSearch("")
              setProjectId("all")
              setFromDate("")
              setToDate("")
            }}
          >
            <X className="h-4 w-4 mr-1" /> Reset
          </Button>
        )}
      </Card>

      {/* Leads Table */}
      <Card className="p-0 overflow-hidden border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
        {loading ? (
          <div className="p-20 text-center text-sm text-neutral-500 animate-pulse">Refreshing leads...</div>
        ) : leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-800 bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Project</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Device</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">Captured</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {leads.map((lead: any) => (
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
                       <Badge variant="default" className="text-[10px] border-neutral-800 bg-neutral-900 whitespace-nowrap">
                          {lead.projects?.name || "Deleted"}
                       </Badge>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                          <Monitor className="h-3 w-3" />
                          {lead.visitors?.[0]?.device ? (
                            <span className="truncate max-w-[120px]" title={lead.visitors[0].device}>
                              {lead.visitors[0].device}
                            </span>
                          ) : "unknown"}
                       </div>
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
                          {format(new Date(lead.created_at), "MMM d, yyyy")}
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
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
               <Filter className="h-8 w-8 text-neutral-700" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">No Leads Match</h2>
              <p className="text-sm text-neutral-500 max-w-sm">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
