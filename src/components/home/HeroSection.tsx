"use client";

import { ArrowRight, Play, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const words = ["Physical.", "Digital.", "SaaS."];

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dark">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Omni Cartix" className="h-64 w-auto object-contain drop-shadow-2xl" />
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 text-sm gap-2">
            <Zap className="h-3.5 w-3.5" />
            UK&apos;s All-in-One Digital Marketplace
          </Badge>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
          Everything{" "}
          <span className="gradient-text relative">
            <span
              key={currentWord}
              className="animate-fade-in inline-block"
            >
              {words[currentWord]}
            </span>
          </span>
          <br />
          <span className="text-white/80">Everything Delivered.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Browse thousands of physical products, digital downloads, and SaaS solutions.
          All in one UK-based marketplace with instant delivery and secure payments.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-gradient-primary text-white hover:opacity-90 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/30 group"
            >
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold gap-2"
            >
              <Play className="h-4 w-4" />
              See Plans
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { value: "10,000+", label: "Products" },
            { value: "50,000+", label: "Happy Customers" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
          <div className="h-2 w-1 rounded-full bg-white/50 animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
