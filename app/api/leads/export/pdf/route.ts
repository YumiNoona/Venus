import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { format } from "date-fns"

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // 1. Get query params
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const projectId = searchParams.get("projectId") || "all"
  const fromDate = searchParams.get("fromDate") || undefined
  const toDate = searchParams.get("toDate") || undefined

  // 2. Fetch leads (mirrors leads server action logic for security)
  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id);

  const projectIds = (userProjects || []).map(p => p.id);
  if (projectIds.length === 0) return new NextResponse("No projects found", { status: 404 });

  let query = supabase
    .from("leads")
    .select(`
      id,
      name,
      email,
      phone,
      created_at,
      project_id,
      verified,
      projects(name),
      visitors(device)
    `)
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (projectId && projectId !== "all") {
    query = query.eq("project_id", projectId);
  }

  if (fromDate) {
    query = query.gte("created_at", fromDate);
  }

  if (toDate) {
    query = query.lte("created_at", toDate);
  }

  const { data: leads, error } = await query;
  if (error) return new NextResponse(error.message, { status: 500 });
  if (!leads || leads.length === 0) return new NextResponse("No leads to export", { status: 404 });

  // 3. Prepare HTML for Puppeteer
  const studioName = user.user_metadata?.name || user.email?.split("@")[0] || "Studio";
  const projectNameFilter = projectId !== "all" ? (leads[0] as any).projects?.name : "All Projects";

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { 
        font-family: 'Inter', -apple-system, sans-serif; 
        padding: 40px; 
        color: #111;
        line-height: 1.5;
      }
      header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; 
        margin-bottom: 40px;
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
      }
      .studio-info h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
      .studio-info div { color: #666; font-size: 12px; margin-top: 4px; }
      
      .report-meta { text-align: right; color: #666; font-size: 12px; }
      
      h2 { margin: 0 0 20px 0; font-size: 18px; font-weight: 700; }
      
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th { 
        background: #f9f9f9; 
        color: #555; 
        padding: 12px 10px; 
        text-align: left; 
        font-size: 10px; 
        text-transform: uppercase; 
        letter-spacing: 0.05em;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }
      td { 
        padding: 12px 10px; 
        border-bottom: 1px solid #f5f5f5; 
        font-size: 11px;
      }
      tr:nth-child(even) { background: #fafafa; }
      
      .badge {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 9px;
        font-weight: bold;
        text-transform: uppercase;
      }
      .badge-verified { background: #e6fffa; color: #2c7a7b; }
      .badge-pending { background: #f7fafc; color: #4a5568; }

      footer { 
        margin-top: 50px; 
        font-size: 10px; 
        color: #999; 
        text-align: center;
        border-top: 1px solid #eee;
        padding-top: 20px;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="studio-info">
        <h1>${studioName}</h1>
        <div>Project: ${projectNameFilter}</div>
      </div>
      <div class="report-meta">
        Generated: ${format(new Date(), "PPPpp")}<br>
        Total Leads: ${leads.length}
      </div>
    </header>

    <h2>Project Leads Report</h2>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Device</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${leads.map(l => `
          <tr>
            <td><strong>${l.name}</strong></td>
            <td>${l.email}</td>
            <td>${l.phone || "-"}</td>
            <td>${(l as any).visitors?.[0]?.device || "unknown"}</td>
            <td>
              <span class="badge ${l.verified ? 'badge-verified' : 'badge-pending'}">
                ${l.verified ? 'Verified' : 'Pending'}
              </span>
            </td>
            <td>${format(new Date(l.created_at as string), "MMM d, yyyy")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <footer>
      Powered by Venus Studio &bull; Professional Architectural Visualization Analytics
    </footer>
  </body>
  </html>
  `

  // 4. Generate PDF with Puppeteer
  let browser;
  try {
    browser = await puppeteer.launch({
       headless: true,
       args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });

    return new NextResponse(pdf as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="venus-leads-${format(new Date(), "yyyyMMdd")}.pdf"`
      }
    });

  } catch (err: any) {
    console.error("PDF generation error:", err);
    return new NextResponse(err.message, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
