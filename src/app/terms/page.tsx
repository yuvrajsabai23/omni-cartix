import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Terms & Conditions</h1>
        <p className="text-white/50 text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-white">1. About Omni Cartix</h2>
            <p>{siteConfig.company.name} is registered in England and Wales (Co. No. {siteConfig.company.registrationNumber}). These Terms govern your use of omnicartix.co.uk and are subject to English law. Disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">2. Orders & Payments</h2>
            <p>All prices are shown in GBP (£) exclusive of VAT. VAT at the current UK rate (20%) will be added at checkout. We accept Stripe (card, Apple Pay, Google Pay) and PayPal.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">3. Digital Products</h2>
            <p>By purchasing digital products and requesting immediate access, you waive your 14-day statutory right of withdrawal under the Consumer Contracts Regulations 2013. This is confirmed via checkbox at checkout.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">4. Physical Products</h2>
            <p>You have a 14-day right of withdrawal from the date of delivery for physical goods. Items must be returned in their original condition.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">5. Intellectual Property</h2>
            <p>All content on this site is owned by {siteConfig.company.name} or its licensors. Digital products are licensed, not sold, unless otherwise stated.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">6. Limitation of Liability</h2>
            <p>Our total liability shall not exceed the amount paid for the relevant product. We are not liable for indirect or consequential losses.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">7. Contact</h2>
            <p>Email: <a href={`mailto:${siteConfig.company.email}`} className="text-primary">{siteConfig.company.email}</a> | Phone: {siteConfig.company.phone}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
