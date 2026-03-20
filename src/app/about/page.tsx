import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { Shield, Zap, Globe, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Omni Cartix" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-24 text-center bg-gradient-hero">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-5xl font-heading font-bold text-white mb-6">
              About <span className="gradient-text">Omni Cartix</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              {siteConfig.tagline} We&apos;re a UK-registered company on a mission to make buying physical products, digital downloads, and software tools seamless for everyone.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "UK First", desc: "Registered and regulated in England and Wales. VAT compliant, GDPR compliant, ICO registered.", color: "text-primary bg-primary/20" },
              { icon: Zap, title: "Instant Delivery", desc: "Digital products delivered in seconds. No waiting, no friction — just instant access.", color: "text-accent bg-accent/20" },
              { icon: Globe, title: "All-in-One", desc: "Physical goods, digital downloads, and SaaS tools — one platform, one account, one checkout.", color: "text-purple-400 bg-purple-500/20" },
              { icon: Heart, title: "Customer First", desc: "4.9/5 rating from over 10,000 reviews. We put customers at the heart of everything we do.", color: "text-success bg-success/20" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company details */}
        <section className="py-16 bg-white/5 border-y border-white/10">
          <div className="mx-auto max-w-xl px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
            <div className="space-y-2 text-sm text-white/60">
              <p><strong className="text-white">{siteConfig.company.name}</strong></p>
              <p>Registered in England & Wales | Co. No. {siteConfig.company.registrationNumber}</p>
              <p>VAT Registration No. {siteConfig.company.vatNumber}</p>
              <p>ICO Registration No. {siteConfig.company.icoNumber}</p>
              <p>{siteConfig.company.address.line1}, {siteConfig.company.address.city}, {siteConfig.company.address.postcode}</p>
              <p><a href={`mailto:${siteConfig.company.email}`} className="text-primary">{siteConfig.company.email}</a></p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
