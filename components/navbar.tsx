"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Button } from "./ui";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let ignore = false;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!ignore) setUser(data.user);
    });

    return () => {
      ignore = true;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled 
          ? "py-4 glass-ui border-b border-white/[0.05]" 
          : "bg-transparent border-transparent py-8"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl font-black text-black text-xs transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-105">
            V
          </div>
          <span className="text-sm font-bold tracking-[0.2em] text-white uppercase group-hover:text-gold transition-colors">
            Venus
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink href="#features">Product</NavLink>
          <NavLink href="/docs">Docs</NavLink>
          <NavLink href="#capabilities">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="btn-primary-obs px-8 h-12">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="sm" className="btn-primary-obs px-10 h-12">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
    </Link>
  );
}
