import Navbar from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
              Venus for Architectural Studios
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] md:text-4xl">
              Present interactive architecture experiences with calm,
              architectural precision.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--text-secondary)]">
              Venus generates refined project pages for your real-time
              experiences. Share a single link that tells the story, captures
              the lead, and seamlessly hands off to your pixel streaming
              provider.
            </p>
          </section>
          <section className="flex flex-wrap items-center gap-4 text-sm">
            <Button asChild>
              <Link href="/signup">Create studio account</Link>
            </Button>
            <Link
              href="/login"
              className="text-xs text-[color:var(--text-secondary)] underline-offset-4 hover:text-[color:var(--text-primary)] hover:underline"
            >
              Already using Venus? Sign in
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

