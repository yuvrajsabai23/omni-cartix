"use client";

import { ArrowRight, Play, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const words = ["Physical.", "Digital.", "SaaS."];

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-dark">
      {/* Gradient glow from top */}
      <div className="absolute inset-0 bg-gradient-glow" />

      {/* Subtle radial accents */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />

      {/* Grid overlay — very subtle */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 text-center">
        {/* Logo — refined size */}
        <div className="flex justify-center mb-8 reveal-section">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Omni Cartix"
            className="h-36 sm:h-44 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-8 reveal-section reveal-delay-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white/60">
            <Zap className="h-3.5 w-3.5 text-accent" />
            UK&apos;s All-in-One Digital Marketplace
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-display-xl font-heading font-bold text-white mb-6 reveal-section reveal-delay-2">
          Everything{" "}
          <span
            key={currentWord}
            className="gradient-text animate-fade-in inline-block"
          >
            {words[currentWord]}
          </span>
          <br />
          <span className="text-white/50">Everything Delivered.</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed reveal-section reveal-delay-3">
          Physical products, digital downloads, and SaaS solutions.
          One UK-based marketplace with instant delivery and secure payments.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20 reveal-section reveal-delay-4">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-gradient-primary text-white hover:opacity-90 px-8 py-6 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-shadow duration-300 group rounded-full"
            >
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 ease-out-expo" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="outline"
              className="border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.15] px-8 py-6 text-sm font-semibold gap-2 rounded-full transition-all duration-200"
            >
              <Play className="h-3.5 w-3.5" />
              See Plans
            </Button>
          </Link>
        </div>

        {/* Value props — not fake stats */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 reveal-section reveal-delay-5">
          {[
            { label: "Instant Digital Delivery" },
            { label: "UK VAT Compliant" },
            { label: "Secure Stripe Payments" },
            { label: "14-Day Returns" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-white/30">
              <div className="h-1 w-1 rounded-full bg-accent/60" />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-hint">
        <div className="h-8 w-5 rounded-full border border-white/[0.1] flex items-start justify-center pt-1.5">
          <div className="h-1.5 w-0.5 rounded-full bg-white/30" />
        </div>
      </div>
    </section>
  );
}
