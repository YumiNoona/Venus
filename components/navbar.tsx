import Link from "next/link";
import { getOptionalUser } from "@/lib/auth";
import { ArrowRight } from "lucide-react";

export default async function Navbar() {
  const { user } = await getOptionalUser();

  return (
    <header className="border-b border-[color:var(--border)] bg-[#050509]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[color:var(--text-primary)] transition-opacity hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[color:var(--accent)] to-[#a07d4a] text-[10px] font-bold text-black">
            V
          </span>
          <span>Venus</span>
        </Link>
        <div className="flex items-center gap-3 text-xs">
          {user ? (
            <>
              <span className="hidden text-[color:var(--text-secondary)] md:inline">
                {user.email}
              </span>
              <Link
                href="/dashboard"
                className="btn-primary text-xs px-3 py-1.5"
              >
                Dashboard
                <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="btn-primary text-xs px-3 py-1.5"
            >
              Sign in
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
