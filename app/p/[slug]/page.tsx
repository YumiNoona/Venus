import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { trackVisitor } from "./actions"
import { submitLead } from "@/lib/actions/leads"
import { Button, Separator, Card, Label, Input } from "@/components/ui"
import { Metadata } from "next"
import { ProjectHero } from "@/components/project-hero"
import { MapPin, User, Maximize, Calendar, ArrowRight, Sparkles, Box } from "lucide-react"

export const revalidate = 60 // ISR: Refresh cache every 60 seconds

interface ProjectPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const supabase = (await createServerSupabaseClient()) as any;
  const { data: project } = await supabase
    .from("projects")
    .select("name, short_description")
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (!project) return { title: "Project Not Found" }

  return {
    title: `${project.name} | Venus Studio`,
    description: project.short_description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = (await createServerSupabaseClient()) as any;

  const { data: project } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      short_description,
      long_description,
      stream_url,
      thumbnail_light,
      thumbnail_dark,
      published
    `)
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (!project) return notFound()

  // Track visitor in the background
  trackVisitor(project.id).catch(err => console.error("Track error:", err))

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text-primary)] selection:bg-[color:var(--accent)] selection:text-black scroll-smooth">
      
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
              <div className="group relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl transition-impeccable hover:border-neutral-700">
                {project.thumbnail_dark ? (
                  <img src={project.thumbnail_dark} alt="Showcase" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Box className="h-16 w-16 text-neutral-900" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-end p-8 items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <p className="text-xs font-bold uppercase tracking-widest text-white/80">Principal Exterior Visualization</p>
                </div>
              </div>
           </div>
        </section>

        {/* 5. Immersive Section */}
        <section id="immersive" className="relative p-12 lg:p-24 rounded-[32px] overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-10 group shadow-2xl">
           {/* Decorative Background Elements */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#C9A46C]/10 via-transparent to-transparent opacity-50" />
           <div className="absolute -top-24 -right-24 h-64 w-64 bg-[#C9A46C]/10 blur-[100px] rounded-full group-hover:opacity-100 opacity-0 transition-opacity duration-1000" />
           
           <div className="relative space-y-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-[color:var(--accent)] animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                 The Digital Atmosphere
              </h2>
              <p className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
                 Enter the fully immersive pixel-streamed experience. Walk through the spaces, experience materials, and feel the light in real-time.
              </p>
           </div>

           <a 
              href={project.stream_url || "#"} 
              target="_blank" 
              className="relative group/btn inline-flex h-16 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-10 text-xs font-black uppercase tracking-[0.3em] text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[color:var(--accent)]/20"
           >
              Enter Immersive Experience
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
           </a>
        </section>

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
               <form action={async (formData) => {
                 "use server"
                 await submitLead(formData);
               }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <input type="hidden" name="projectId" value={project.id} />
                 
                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 ml-1">Full Name</Label>
                   <Input name="name" placeholder="John Doe" required className="bg-black/20 border-neutral-800 focus:border-[color:var(--accent)] h-14 text-sm" />
                 </div>

                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 ml-1">Work Email</Label>
                   <Input name="email" type="email" placeholder="john@example.com" required className="bg-black/20 border-neutral-800 focus:border-[color:var(--accent)] h-14 text-sm" />
                 </div>

                 <div className="space-y-2 md:col-span-2">
                   <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 ml-1">Phone Number (Optional)</Label>
                   <Input name="phone" placeholder="+1 (555) 000-0000" className="bg-black/20 border-neutral-800 focus:border-[color:var(--accent)] h-14 text-sm" />
                 </div>

                 <div className="md:col-span-2 pt-4">
                    <Button type="submit" size="lg" className="w-full h-14 shadow-lg shadow-[color:var(--accent)]/10 font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:translate-y-[-2px]">
                      Send Inquiry
                    </Button>
                    <p className="text-[10px] text-center text-neutral-600 mt-6 tracking-widest uppercase">
                       Confidentiality guaranteed.
                    </p>
                 </div>
               </form>
             </Card>
           </div>
        </section>

      </div>

      {/* Footer Accent */}
      <footer className="border-t border-neutral-800 mt-32 py-20 text-center space-y-8 bg-black/20">
          <div className="flex flex-col items-center gap-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800">
                <p className="text-xl font-black text-[color:var(--accent)]">V</p>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-[0.6em] text-neutral-600">Generated with Venus Studio</p>
              <div className="h-12 w-[1px] bg-gradient-to-b from-neutral-800 to-transparent" />
          </div>
      </footer>
    </div>
  )
}
