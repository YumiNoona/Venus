import Link from "next/link";
import { getOptionalUser } from "@/lib/auth";

export default async function Navbar() {
  const { user } = await getOptionalUser();

  return (
    <header className="border-b border-[color:var(--border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium tracking-tight text-[color:var(--text-primary)]"
        >
          <span className="h-6 w-6 rounded-md bg-gradient-to-br from-[#1f2933] to-[#020617] ring-1 ring-[color:var(--border)]" />
          <span>Venus</span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-[color:var(--text-secondary)]">
          {user ? (
            <>
              <span className="hidden md:inline">
                {user.email}
              </span>
              <Link
                href="/dashboard"
                className="inline-flex h-8 items-center justify-center rounded-md border border-transparent px-3 text-xs font-medium text-[color:var(--text-secondary)] transition-all duration-150 ease-subtle hover:border-[color:var(--border)] hover:bg-[#15161a] hover:text-[color:var(--text-primary)]"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-8 items-center justify-center rounded-md border border-transparent px-3 text-xs font-medium text-[color:var(--text-secondary)] transition-all duration-150 ease-subtle hover:border-[color:var(--border)] hover:bg-[#15161a] hover:text-[color:var(--text-primary)]"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


