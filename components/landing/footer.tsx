"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Showcase", href: "#demo" }
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Support", href: "/support" },
    { name: "Guides", href: "/guides" }
  ],
  Company: [
    { name: "Contact", href: "/contact" }
  ],
  Legal: [
    { name: "Terms", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Security", href: "#" },
    { name: "Cookie Policy", href: "#" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-bg-primary pt-32 pb-16 border-t border-border-subtle">
      <div className="container mx-auto px-6 space-y-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-1 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold tracking-tighter text-white uppercase">
                Venus
              </span>
            </Link>
            <p className="text-xs text-text-secondary uppercase tracking-widest font-medium leading-relaxed max-w-xs">
              Architectural presentation platform engineered for high-fidelity interactive experiences and lead intelligence.
            </p>
          </div>

          {/* Links Cols */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{title}</h4>
              <ul className="space-y-4 text-xs font-bold tracking-widest text-text-secondary">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-16 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-text-secondary">
            © 2026 Venus. Engineered by Veil.
          </p>
          <div className="flex gap-10">
            <SocialLink href="#" label="Twitter" />
            <SocialLink href="#" label="LinkedIn" />
            <SocialLink href="#" label="Instagram" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label }: { href: string, label: string }) {
  return (
    <a 
      href={href} 
      className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary hover:text-text-primary transition-colors"
    >
      {label}
    </a>
  );
}
