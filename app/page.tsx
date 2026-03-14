import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowRight, Layers, Users, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-12">
          {/* Hero */}
          <section className="space-y-5 animate-slide-up">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--border)] bg-[#111214] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] animate-pulse" />
              Venus for Architectural Studios
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] md:text-5xl md:leading-[1.15]">
              Present interactive architecture
              <br />
              <span className="text-[color:var(--accent)]">experiences</span> with precision.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[color:var(--text-secondary)]">
              Venus generates refined project pages for your real-time
              experiences. Share a single link that tells the story, captures
              the lead, and seamlessly hands off to your pixel streaming
              provider.
            </p>
          </section>

          {/* CTAs */}
          <section className="flex flex-wrap items-center gap-4 animate-slide-up delay-1">
            <Link href="/signup" className="btn-accent">
              Create studio account
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/login"
              className="btn-primary"
            >
              Sign in to studio
            </Link>
          </section>

          {/* Feature pills */}
          <section className="grid gap-4 sm:grid-cols-3 animate-slide-up delay-2">
            {[
              {
                icon: Layers,
                title: "Project pages",
                desc: "Beautiful, shareable pages for each experience."
              },
              {
                icon: Users,
                title: "Lead capture",
                desc: "Collect client details before they enter the stream."
              },
              {
                icon: BarChart3,
                title: "Visitor analytics",
                desc: "Track who visits and engages with your projects."
              }
            ].map((f) => (
              <div
                key={f.title}
                className="stat-card group"
              >
                <f.icon className="h-5 w-5 text-[color:var(--accent)] mb-3 transition-transform duration-200 group-hover:scale-110" />
                <div className="text-sm font-medium text-[color:var(--text-primary)]">
                  {f.title}
                </div>
                <div className="mt-1 text-xs text-[color:var(--text-secondary)] leading-relaxed">
                  {f.desc}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[color:var(--border)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[10px] text-[color:var(--text-secondary)]">
          <span>© 2025 Venus. Built for architects.</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
}
