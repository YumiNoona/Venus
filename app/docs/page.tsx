"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";
import { 
  CheckCircle2, 
  Monitor, 
  BarChart3, 
  Settings2, 
  Lock,
  Camera,
  Layout,
  FileText,
  Palette,
  Activity,
  Zap,
  CreditCard,
  User,
  ShieldCheck,
  Smartphone,
  Eye,
  Share2,
  ListTodo
} from "lucide-react";

/**
 * SECTIONS matches the user's 17-point manual exactly.
 */
const SECTIONS = [
  {
    id: "account-setup",
    number: "1",
    title: "Account Setup",
    icon: <User className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-4">
        <p className="text-lg text-text-secondary">Create your professional studio account and activate it via email verification.</p>
        <ul className="grid gap-3 text-base font-medium">
          <li className="flex items-center gap-2">• Sign up / Log in</li>
          <li className="flex items-center gap-2">• Verify email (if required)</li>
          <li className="flex items-center gap-2">• Land on Dashboard</li>
        </ul>
      </div>
    )
  },
  {
    id: "dashboard-overview",
    number: "2",
    title: "Dashboard Overview",
    icon: <Layout className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-text-secondary">Your mission control for system-level metrics:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox label="Projects" value="Active Portals" />
          <StatBox label="Visitors" value="Total Visits" />
          <StatBox label="Leads" value="Collected Data" />
          <StatBox label="Conversion" value="Visit → Lead %" />
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl mt-8">
           <img 
             src="/images/dashboard-shot.png" 
             alt="Live Dashboard" 
             className="w-full h-auto opacity-70 hover:opacity-100 transition-opacity duration-700"
           />
           <div className="p-4 bg-black/60 backdrop-blur-md flex items-center justify-between">
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                 Live Platform: Dashboard
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    id: "creating-project",
    number: "3",
    title: "Creating Your First Project",
    icon: <FileText className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-8">
        <p className="text-sm font-bold text-gold uppercase tracking-widest border-b border-gold/10 pb-2">Path: Projects → New Project</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Core Details" items={["Project Name (Public Title)", "Unique URL Slug", "Custom Domain (Optional)"]} />
          <InfoCard title="Content" items={["Short Description (Headline)", "Project Narrative (Full Story)"]} />
          <InfoCard title="About Project" items={["Location / Studio", "Area / Architecture Firm", "Completion Year"]} />
        </div>
      </div>
    )
  },
  {
    id: "uploading-visuals",
    number: "4",
    title: "Uploading Visuals",
    icon: <Camera className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-text-secondary">Upload **Day** and **Night** mode covers for responsive branding.</p>
        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
           <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 italic">System Behavior:</h4>
           <p className="text-base text-text-secondary leading-relaxed">
             The portal automatically renders the **Day image** for Light themes and the **Night image** for Dark themes.
           </p>
        </div>
      </div>
    )
  },
  {
    id: "connecting-stream",
    number: "5",
    title: "Connecting Your Stream",
    icon: <Monitor className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-text-secondary">Paste your external 3D stream URL (e.g., Vagon) into the **Experience Settings**.</p>
        <div className="bg-black/60 p-6 rounded-xl border border-white/10 font-mono text-sm text-white">
          https://streams.vagon.io/your-project
        </div>
      </div>
    )
  },
  {
    id: "visibility",
    number: "6",
    title: "Project Visibility",
    icon: <Eye className="w-5 h-5 text-gold" />,
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
          <h4 className="text-base font-black text-white uppercase tracking-widest">Draft</h4>
          <p className="text-sm text-text-secondary">Private. Not accessible by clients.</p>
        </div>
        <div className="p-6 bg-gold/10 border border-gold/20 rounded-2xl space-y-2">
          <h4 className="text-base font-black text-gold uppercase tracking-widest">Live</h4>
          <p className="text-sm text-text-secondary">Publicly accessible via your slug.</p>
        </div>
      </div>
    )
  },
  {
    id: "access-control",
    number: "7",
    title: "Access Control (Auth Mode)",
    icon: <Lock className="w-5 h-5 text-gold" />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SmallAuthCard title="1. Public" desc="No restrictions. Marketing focus." />
        <SmallAuthCard title="2. Password" desc="Shared code for staged review." />
        <SmallAuthCard title="3. OTP" desc="Verified identity & lead capture." />
      </div>
    )
  },
  {
    id: "presentation",
    number: "8",
    title: "Presentation Settings",
    icon: <Palette className="w-5 h-5 text-gold" />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Minimal", "Glass", "Architect"].map(theme => (
          <div key={theme} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl text-center">
            <p className="text-sm font-black text-white uppercase tracking-widest">{theme}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "visitor-handling",
    number: "9",
    title: "Visitor Handling",
    icon: <ShieldCheck className="w-5 h-5 text-gold" />,
    content: (
       <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
          <h4 className="text-xl font-bold text-white italic">Remember Visitor Session</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium text-text-secondary">
             <div className="p-4 bg-white/5 rounded-lg border border-white/5"><span className="text-white block mb-1">ON</span> Returning users skip authentication forms.</div>
             <div className="p-4 bg-white/5 rounded-lg border border-white/5"><span className="text-white block mb-1">OFF</span> Verification required on every visit.</div>
          </div>
       </div>
    )
  },
  {
    id: "publishing",
    number: "10",
    title: "Publishing the Project",
    icon: <Zap className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-text-secondary">Click 'Update Project' to sync your changes and copy your shareable endpoint.</p>
        <div className="p-6 bg-bg-secondary border border-gold/20 rounded-xl text-base font-mono text-white text-center">
          https://yourproject.venusapp.in
        </div>
      </div>
    )
  },
  {
    id: "sharing",
    number: "11",
    title: "Sharing Workflow",
    icon: <Share2 className="w-5 h-5 text-gold" />,
    content: (
      <ul className="space-y-4 text-base font-medium text-text-secondary border-l-2 border-gold/20 pl-6">
        <li className="flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-black">01</span> Direct Client Sharing via project link</li>
        <li className="flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-black">02</span> Mandatory access/story review</li>
        <li className="flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-black">03</span> One-click Dive into the interactive stream</li>
      </ul>
    )
  },
  {
    id: "lead-mgmt",
    number: "12",
    title: "Leads Management",
    icon: <Activity className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-8">
        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-10">
          <SimpleList title="Core Features" items={["Search by Name/Email", "Filter by Project/Date", "Export to CSV or PDF"]} />
          <SimpleList title="Data Captured" items={["Verified Contact Data", "Project Interest Tracking", "Session Metadata"]} />
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
           <img 
              src="/images/leads-mockup.png" 
              alt="Leads Management" 
             className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-500"
           />
           <div className="p-4 bg-black/60 backdrop-blur-md flex items-center justify-between">
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                 Live Platform: Inquiry Ledger
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    id: "project-mgmt",
    number: "13",
    title: "Project Management",
    icon: <BarChart3 className="w-5 h-5 text-gold" />,
    content: (
      <div className="space-y-6">
        <p className="text-lg text-text-secondary">Monitor your entire portfolio. Each row shows **Visitor Counts**, **Live URL**, and **Creation Date**.</p>
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl border-t-0 rounded-t-none">
           <img 
             src="/images/projects-shot.png" 
             alt="Projects List" 
             className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-500 hover:grayscale-0 grayscale-[20%]"
           />
           <div className="p-4 bg-black/60 backdrop-blur-md flex items-center justify-between border-t border-white/5">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                 Live Platform: Projects List
              </p>
           </div>
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          {["Edit", "Copy Link", "Toggle Status", "Delete"].map(a => (
            <span key={a} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest text-white/60">{a}</span>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "billing",
    number: "14",
    title: "Billing & Credits",
    icon: <CreditCard className="w-5 h-5 text-gold" />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanTile name="Starter" desc="Limited projects for small studios." />
        <PlanTile name="Studio" desc="Unlimited projects + OTP walls." highlight />
        <PlanTile name="Agency" desc="Full white-label + volume scale." />
      </div>
    )
  },
  {
    id: "profile-settings",
    number: "15",
    title: "Settings",
    icon: <Settings2 className="w-5 h-5 text-gold" />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-base">
        <div className="space-y-2">
          <h4 className="font-bold text-white italic">Profile</h4>
          <p className="text-text-secondary leading-relaxed">Update your studio name and primary contact email.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white italic">Security</h4>
          <p className="text-text-secondary leading-relaxed">Credential management and active session control.</p>
        </div>
      </div>
    )
  },
  {
    id: "summary-workflow",
    number: "16",
    title: "Workflow Summary",
    icon: <ListTodo className="w-5 h-5 text-gold" />,
    content: (
      <div className="p-8 bg-gold/5 border border-gold/20 rounded-3xl">
         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm font-black uppercase text-gold tracking-widest">
           <li>01. Create Project</li>
           <li>02. Add Content</li>
           <li>03. Paste Stream URL</li>
           <li>04. Set Access Mode</li>
           <li>05. Publish Live</li>
           <li>06. Track Leads</li>
         </ul>
      </div>
    )
  },
  {
    id: "min-requirements",
    number: "17",
    title: "Minimum Requirements",
    icon: <Smartphone className="w-5 h-5 text-gold" />,
    content: (
      <div className="grid gap-6">
        <p className="text-sm text-text-secondary italic">For optimal streaming performance:</p>
        <ul className="space-y-4 text-base font-medium text-text-secondary">
          <li className="flex items-center gap-4"><CheckCircle2 className="w-5 h-5 text-gold/60" /> 10–20 Mbps Stable Connection</li>
          <li className="flex items-center gap-4"><CheckCircle2 className="w-5 h-5 text-gold/60" /> Modern Browser (Chrome / Edge)</li>
          <li className="flex items-center gap-4"><CheckCircle2 className="w-5 h-5 text-gold/60" /> Zero local GPU requirement</li>
        </ul>
      </div>
    )
  }
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <main className="container mx-auto px-6 py-40">
        <div className="flex flex-col lg:flex-row gap-24">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0 lg:sticky lg:top-40 h-fit space-y-12">
            <div className="space-y-3">
              <h2 className="text-xs font-black text-gold uppercase tracking-[0.6em]">Studio Manual</h2>
            </div>
            <nav className="flex flex-col gap-1 border-l border-white/5 pl-6">
              {SECTIONS.map(s => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`}
                  className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-all py-2.5 group"
                >
                  <span className="w-6 text-gold/40 group-hover:text-gold transition-colors">{s.number}</span>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-32 pb-80">
            <header className="space-y-8 border-b border-white/5 pb-20">
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter italic text-white leading-[0.9] uppercase">Getting Started</h1>
                <p className="text-2xl md:text-3xl text-text-secondary font-medium tracking-tight max-w-4xl leading-relaxed">
                    The complete operational guide for architectural studios. Documentation for every component of the Venus ecosystem.
                </p>
            </header>

            {/* Visual Showcase Section - Requested by user */}
            <section className="space-y-16 py-20">
              <h3 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter text-right">
                Built for teams managing <br/> 
                <span className="text-gold">interactive presentations</span>
              </h3>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Dashboard Card */}
                <div className="group relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 shadow-2xl transition-all hover:border-gold/30">
                  <img 
                    src="/images/dashboard-shot.png" 
                    alt="Dashboard" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <p className="text-xs font-black text-gold uppercase tracking-[0.4em]">Live Platform: Dashboard</p>
                      </div>
                      <a 
                        href="/images/dashboard-tour.webp" 
                        target="_blank"
                        className="px-3 py-1 bg-white/10 hover:bg-gold/20 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all backdrop-blur-sm"
                      >
                        Watch Walkthrough
                      </a>
                    </div>
                  </div>
                </div>

                {/* Projects Card */}
                <div className="group relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 shadow-2xl transition-all hover:border-gold/30">
                  <img 
                    src="/images/projects-shot.png" 
                    alt="Projects" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      <p className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">Live Platform: Projects List</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {SECTIONS.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-40 space-y-12">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold font-black text-base italic border border-gold/20">
                     {section.number}
                   </div>
                   <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">{section.title}</h2>
                </div>
                <div className="max-w-4xl border-l border-white/5 pl-12 ml-6">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2 hover:bg-gold/5 transition-all">
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{label}</p>
      <p className="text-sm font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}

function InfoCard({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4">
       <h4 className="text-xs font-black text-white uppercase tracking-widest italic">{title}</h4>
       <ul className="space-y-2 font-medium">
         {items.map(i => <li key={i} className="text-sm text-text-secondary leading-relaxed tracking-tight">• {i}</li>)}
       </ul>
    </div>
  );
}

function SmallAuthCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-gold/30 transition-all">
      <h4 className="text-gold font-black uppercase text-[10px] tracking-[0.3em] mb-3">{title}</h4>
      <p className="text-sm text-text-secondary font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function SimpleList({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="space-y-6">
      <h4 className="text-xs font-black text-gold/60 uppercase tracking-[0.3em] border-b border-white/5 pb-4">{title}</h4>
      <ul className="space-y-3 text-base font-medium text-text-secondary">
        {items.map(i => <li key={i} className="flex gap-3"><span>•</span> {i}</li>)}
      </ul>
    </div>
  );
}

function PlanTile({ name, desc, highlight }: { name: string, desc: string, highlight?: boolean }) {
  return (
    <div className={`p-8 rounded-[2rem] border ${highlight ? 'bg-gold/5 border-gold/20 shadow-[0_0_40px_rgba(202,138,4,0.05)]' : 'bg-white/[0.02] border-white/5'} space-y-4`}>
       <h4 className={`text-2xl font-bold tracking-tight italic ${highlight ? 'text-gold' : 'text-white'}`}>{name}</h4>
       <p className="text-sm text-text-secondary leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
