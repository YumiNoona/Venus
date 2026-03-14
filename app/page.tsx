import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui";
import { ArrowRight, Box, Shield, Zap, Layout } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg)]">
      <Navbar />

      <main className="flex-1">
        {/* Architectural Hero */}
        <section className="page-container flex flex-col items-center text-center space-y-8 py-24 md:py-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[color:var(--accent)]">
            <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
            V0.1 Alpha
          </div>
          
          <h1 className="max-w-4xl text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-[color:var(--text-primary)]">
            Present Interactive <br />
            <span className="text-[color:var(--accent)]">Architectural Experiences.</span>
          </h1>
          
          <p className="max-w-2xl text-lg text-[color:var(--text-secondary)] leading-relaxed">
            The developer-style dashboard for architecture studios. Manage projects, capture leads, and share stunning interactive links with clients—all from one precise interface.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/signup" prefetch>
              <Button size="lg" className="h-12 px-8">
                Build your studio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login" prefetch>
              <Button variant="secondary" size="lg" className="h-12 px-8">
                Explore Demo
              </Button>
            </Link>
          </div>

          {/* Minimal visual representation */}
          <div className="mt-16 w-full max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center relative">
             <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent z-10" />
             <div className="grid grid-cols-12 gap-4 w-full h-full opacity-40">
                <div className="col-span-3 border-r border-neutral-800 flex flex-col p-4 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-2 w-full bg-neutral-800 rounded" />)}
                </div>
                <div className="col-span-9 p-8 space-y-8">
                  <div className="h-8 w-1/3 bg-neutral-800 rounded" />
                  <div className="grid grid-cols-3 gap-6">
                    {[1,2,3].map(i => <div key={i} className="h-32 bg-neutral-800 rounded-xl" />)}
                  </div>
                </div>
             </div>
             <div className="z-20 text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
               Interactive Studio Dashboard Interface
             </div>
          </div>
        </section>

        {/* Precise Feature Grid */}
        <section className="bg-neutral-950/30 border-y border-neutral-800 py-24">
          <div className="page-container grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-[color:var(--accent)]">
                <Box className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Stream Integration</h3>
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                Connect your high-performance pixel streaming endpoints. We handle the presentation and SEO wrapping.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-[color:var(--accent)]">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Secure Lead Capture</h3>
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                Integrated auth-guarded modals. Capture high-intent leads before granting access to your experiences.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-[color:var(--accent)]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Instant Deployment</h3>
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                Publish projects with a single thoughtful link. Optimized for social sharing and professional client delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="page-container py-24 text-center space-y-6">
           <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)]">
             Ready to showcase your projects?
           </h2>
           <p className="text-sm text-[color:var(--text-secondary)] max-w-sm mx-auto">
             Join architecture studios using Venus to bridge the gap between visualization and client acquisition.
           </p>
           <div className="pt-4">
             <Link href="/signup" prefetch>
               <Button variant="primary" size="lg">Create Studio Account</Button>
             </Link>
           </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-800 py-12 bg-[color:var(--bg)]">
        <div className="page-container flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
             <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-800 text-[8px] font-bold text-neutral-400">V</div>
             <span className="text-xs font-semibold tracking-tight text-neutral-500">Venus Architecture Platform</span>
           </div>
           <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
             <Link href="#" className="hover:text-neutral-400 transition-colors">Documentation</Link>
             <Link href="#" className="hover:text-neutral-400 transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-neutral-400 transition-colors">Status</Link>
           </div>
           <div className="text-[10px] text-neutral-700">
             © 2024 Venus Labs Inc.
           </div>
        </div>
      </footer>
    </div>
  );
}
