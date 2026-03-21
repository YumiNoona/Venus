"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import HeroScene from "@/components/landing/hero-scene";
import ProblemSection from "@/components/landing/problem-section";

// Dynamically import heavy or secondary sections for better performance
const ProductWalkthrough = dynamic(() => import("@/components/landing/product-walkthrough"), { ssr: true });
const Capabilities = dynamic(() => import("@/components/landing/capabilities"), { ssr: true });
const InterfaceShowcase = dynamic(() => import("@/components/landing/interface-showcase"), { ssr: true });
const DataInsights = dynamic(() => import("@/components/landing/data-insights"), { ssr: true });
const PricingSection = dynamic(() => import("@/components/landing/pricing-section"), { ssr: true });
const FAQSection = dynamic(() => import("@/components/landing/faq-section"), { ssr: true });
const FinalCTA = dynamic(() => import("@/components/landing/final-cta"), { ssr: true });
const Footer = dynamic(() => import("@/components/landing/footer"), { ssr: true });

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary selection:bg-gold selection:text-bg-primary">
      <Navbar />

      <main className="flex-1">
        {/* 01 - Hero */}
        <HeroScene />

        {/* 03 - Problem Section */}
        <ProblemSection />

        {/* 06 - Capabilities */}
        <Capabilities />

        {/* 07 - Interface Showcase */}
        <InterfaceShowcase />

        {/* 08 - Data Insights */}
        <DataInsights />

        {/* 09 - Pricing */}
        <PricingSection />

        {/* 10 - FAQ */}
        <FAQSection />

        {/* 11 - Final CTA */}
        <FinalCTA />
      </main>

      {/* 12 - Footer */}
      <Footer />
    </div>
  );
}
