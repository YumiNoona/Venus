import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { trackVisitor } from "./actions"
import { ProjectHero } from "@/components/project-hero"
import { MapPin, User, Maximize, Calendar, ArrowRight, Sparkles, Box } from "lucide-react"
import { LeadForm } from "@/components/lead-form"
import { Metadata } from "next"
import { Card, Label, Input } from "@/components/ui"
import { ThemeAwareImage } from "@/components/theme-aware-image"
import { ExperienceGate } from "@/components/experience-gate"
import { ProjectThemeToggle } from "@/components/project-theme-toggle"
import { PLAN_FEATURES, type PlanType } from "@/lib/config/plans"

export const revalidate = 60 // ISR: Refresh cache every 60 seconds

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

  const { data: project } = await (supabase as any)
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
      remember_visitor,
      published
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!project) return notFound()

  // Track visitor in the background
  void trackVisitor(project.id)

  // Fetch owner's subscription for feature gating (White-label & Ads)
  const { data: sub } = await (supabase as any)
    .from("subscriptions")
    .select("*")
    .eq("user_id", project.user_id)
    .maybeSingle()

  const features = sub ? PLAN_FEATURES[sub.plan as PlanType] : PLAN_FEATURES.free

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] selection:bg-[color:var(--accent)] selection:text-black scroll-smooth relative">
      <div className="fixed top-6 right-6 z-[100]">
        <ProjectThemeToggle />
      </div>
      
      {/* 1. Hero Section */}
      <ProjectHero 
        name={project.name}
        description={project.short_description || ""}
        thumbnailLight={project.thumbnail_light}
        thumbnailDark={project.thumbnail_dark}
      />

      <div className="mx-auto max-w-5xl px-6 space-y-32 py-32">
        
        {/* 2. Story Section */}
        <section id="story" className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="lg:col-span-1">
             <div className="sticky top-32 space-y-4">
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-[color:var(--accent)]">
                    The Narrative
                </p>
                <h2 className="text-4xl font-black tracking-tighter leading-none">
                    Story
                </h2>
                <div className="h-1 w-12 bg-neutral-800 rounded-full" />
             </div>
           </div>
           <div className="lg:col-span-2">
             <p className="text-xl md:text-2xl text-[color:var(--text-secondary)] leading-relaxed font-medium whitespace-pre-wrap italic">
                {project.long_description || "No project story available."}
             </p>
           </div>
        </section>

        {/* 3. About Section */}
        <section id="about" className="space-y-12">
           <div className="space-y-4">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500">
                  Technical Overview
              </p>
              <h2 className="text-4xl font-black tracking-tighter leading-none">
                  About
              </h2>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Location", value: "Modern Valley, CA", icon: MapPin },
                { label: "Architect", value: "Venus Design Studio", icon: User },
                { label: "Area", value: "4,200 sq.ft", icon: Maximize },
                { label: "Year", value: "2024", icon: Calendar },
              ].map((item, i) => (
                <Card key={item.label} className="p-6 bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-700 transition-colors space-y-4 group">
                  <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-neutral-800 transition-all">
                     <item.icon className="h-5 w-5 text-[color:var(--accent)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-[color:var(--text-primary)]">{item.value}</p>
                  </div>
                </Card>
              ))}
           </div>
        </section>

        {/* 4. Explore Section */}
        <section id="explore" className="space-y-12">
           <div className="space-y-4">
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500">
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
                className="w-full rounded-2xl shadow-2xl transition-impeccable hover:border-neutral-700"
              />
           </div>

           {/* Ads for Free Plan */}
           {features.ads && (
             <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-amber-500/10 bg-amber-500/5 space-y-3 animate-in fade-in duration-500 mt-12">
               <div className="h-2 w-12 bg-amber-500/20 rounded-full" />
               <p className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 animate-pulse">Sponsored Atmosphere</p>
               <h3 className="text-xl font-black italic uppercase tracking-tighter text-neutral-400">Your space could be here.</h3>
               <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">Built with Venus Studio — Upgrade to remove</p>
               <div className="h-2 w-12 bg-amber-500/20 rounded-full" />
             </div>
           )}
        </section>

        {/* 5. Immersive Section / Experience Gate */}
        <div id="immersive">
          <ExperienceGate 
            projectId={project.id}
            projectName={project.name}
            slug={slug}
            authType={project.auth_type as "public" | "password" | "otp"}
            rememberVisitor={project.remember_visitor}
            streamUrl={project.stream_url || "#"}
          />
        </div>

        {/* 6. Lead Form Section */}
        <section id="inquiry" className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start pt-16">
           <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500">
                    Get in Touch
                </p>
                <h2 className="text-4xl font-black tracking-tighter leading-none">
                    Incomplete?<br/>Let's talk.
                </h2>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                Interested in this project or looking to build something similar? Leave your details and our studio will reach out shortly.
              </p>
           </div>

           <div className="lg:col-span-2">
             <Card className="p-8 md:p-12 border-neutral-800 bg-neutral-900/40 backdrop-blur-xl">
               <LeadForm projectId={project.id} />
             </Card>
           </div>
        </section>

      </div>

      {/* Footer / Branding */}
      {!features.white_label ? (
        <footer className="border-t border-neutral-800 mt-32 py-20 text-center space-y-8 bg-black/20">
            <div className="flex flex-col items-center gap-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800">
                  <p className="text-xl font-black text-[color:var(--accent)]">V</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-[0.6em] text-neutral-600">Generated with Venus Studio</p>
                  <p className="text-[10px] font-black text-[color:var(--accent)] uppercase tracking-widest group cursor-pointer hover:text-white transition-colors">Project by {project.name}</p>
                </div>
                <div className="h-12 w-[1px] bg-gradient-to-b from-neutral-800 to-transparent" />
            </div>
        </footer>
      ) : (
        <div className="h-32" /> // Spacer for white-label
      )}
    </div>
  )
}
