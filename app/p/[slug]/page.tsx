import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { ProjectHero } from "@/components/project-hero"
import { MapPin, User, Maximize, Calendar } from "lucide-react"
import { LeadForm } from "@/components/lead-form"
import { Metadata } from "next"
import { Card } from "@/components/ui"
import { ThemeAwareImage } from "@/components/theme-aware-image"
import { ExperienceGate } from "@/components/experience-gate"
import { ProjectThemeToggle } from "@/components/project-theme-toggle"
import { PLAN_FEATURES, type PlanType } from "@/lib/config/plans"
import { TrackVisitor } from "./track-visitor"
import { cn } from "@/lib/utils"

export const runtime = "edge"
export const dynamic = "force-dynamic"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: project } = await supabase
    .from("projects")
    .select("name, short_description")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!project) return { title: "Project Not Found" }

  return {
    title: `${project.name} | Venus Studio`,
    description: project.short_description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      id,
      user_id,
      name,
      short_description,
      long_description,
      stream_url,
      thumbnail_light,
      thumbnail_dark,
      auth_type,
      theme,
      remember_visitor,
      published,
      location,
      architect,
      area,
      year
    `)
    .eq("slug", slug)
    .single()

  if (error || !project || !project.published) return notFound()

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", project.user_id)
    .maybeSingle()

  const features = sub ? PLAN_FEATURES[sub.plan as PlanType] : PLAN_FEATURES.free

  return (
    <div className={cn(
      "min-h-screen bg-bg text-text selection:bg-primary selection:text-black scroll-smooth relative bg-grid",
      `theme-${project.theme || 'minimal'}`
    )}>
      <TrackVisitor projectId={project.id} />

      <div className="fixed top-6 right-6 z-[100]">
        <ProjectThemeToggle />
      </div>
      
      <ProjectHero 
        name={project.name}
        description={project.short_description || ""}
        thumbnailLight={project.thumbnail_light}
        thumbnailDark={project.thumbnail_dark}
      />

      <div className="mx-auto max-w-5xl px-6 space-y-32 py-32">
        
        <section id="story" className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="lg:col-span-1">
             <div className="sticky top-32 space-y-4">
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-accent">
                    The Narrative
                </p>
                <h2 className="text-4xl font-black tracking-tighter leading-none">
                    Story
                </h2>
                <div className="h-1 w-12 bg-border rounded-full" />
             </div>
           </div>
           <div className="lg:col-span-2">
             <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium whitespace-pre-wrap italic">
                {project.long_description || "No project story available."}
             </p>
           </div>
        </section>

        <section id="about" className="space-y-12">
           <div className="space-y-4">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-text-secondary">
                  Technical Overview
              </p>
              <h2 className="text-4xl font-black tracking-tighter leading-none">
                  About
              </h2>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Location", value: project.location || "N/A", icon: MapPin },
                { label: "Architect", value: project.architect || "N/A", icon: User },
                { label: "Area", value: project.area || "N/A", icon: Maximize },
                { label: "Year", value: project.year || "N/A", icon: Calendar },
              ].map((item) => (
                <Card key={item.label} className="p-6 bg-bg-soft border-border hover:border-text-secondary transition-colors space-y-4 group">
                  <div className="h-10 w-10 rounded-xl bg-bg border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-bg-soft transition-all">
                     <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-text">{item.value}</p>
                  </div>
                </Card>
              ))}
           </div>
        </section>

        <section id="explore" className="space-y-12">
           <div className="space-y-4">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-text-secondary">
                  Visual Showcase
              </p>
              <h2 className="text-4xl font-black tracking-tighter leading-none">
                  Explore
              </h2>
           </div>

           <div className="space-y-8">
              <ThemeAwareImage 
                lightSrc={project.thumbnail_light}
                darkSrc={project.thumbnail_dark}
                alt="Principal Exterior Visualization"
                aspectRatio="aspect-[16/9]"
                className="w-full rounded-2xl shadow-2xl transition-impeccable hover:border-border"
              />
           </div>

           {features.ads && (
             <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-amber-500/10 bg-amber-500/5 space-y-3 animate-in fade-in duration-500 mt-12">
               <div className="h-2 w-12 bg-amber-500/20 rounded-full" />
               <p className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 animate-pulse">Sponsored Atmosphere</p>
               <h3 className="text-xl font-black italic uppercase tracking-tighter text-text-secondary">Your space could be here.</h3>
               <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Built with Venus Studio — Upgrade to remove</p>
               <div className="h-2 w-12 bg-amber-500/20 rounded-full" />
             </div>
           )}
        </section>

        <div id="immersive">
          <ExperienceGate 
            projectId={project.id}
            projectName={project.name}
            slug={slug}
            authType={project.auth_type as "public" | "password" | "otp"}
            rememberVisitor={project.remember_visitor ?? true}
            streamUrl={project.stream_url || "#"}
          />
        </div>

        <section id="inquiry" className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start pt-16">
           <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-text-secondary">
                    Get in Touch
                </p>
                <h2 className="text-4xl font-black tracking-tighter leading-none">
                    Incomplete?<br/>Let's talk.
                </h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                Interested in this project or looking to build something similar? Leave your details and our studio will reach out shortly.
              </p>
           </div>

           <div className="lg:col-span-2">
             <Card className="p-8 md:p-12 border-border bg-bg-soft backdrop-blur-xl">
               <LeadForm projectId={project.id} />
             </Card>
           </div>
        </section>

      </div>

      {!features.white_label ? (
        <footer className="border-t border-border mt-32 py-20 text-center space-y-8 bg-bg-soft">
            <div className="flex flex-col items-center gap-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-bg border border-border">
                  <p className="text-xl font-black text-accent">V</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-[0.6em] text-text-secondary">Generated with Venus Studio</p>
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest group cursor-pointer hover:text-text transition-colors">Project by {project.name}</p>
                </div>
                <div className="h-12 w-[1px] bg-gradient-to-b from-border to-transparent" />
            </div>
        </footer>
      ) : (
        <div className="h-32" />
      )}
    </div>
  )
}
