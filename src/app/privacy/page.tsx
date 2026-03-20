import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", description: "Omni Cartix Privacy Policy — UK GDPR compliant." };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-white/50 text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Who We Are</h2>
            <p>{siteConfig.company.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a company registered in England and Wales (Company No. {siteConfig.company.registrationNumber}), VAT No. {siteConfig.company.vatNumber}. Our registered address is {siteConfig.company.address.line1}, {siteConfig.company.address.city}, {siteConfig.company.address.postcode}, {siteConfig.company.address.country}.</p>
            <p>We are registered with the Information Commissioner&apos;s Office (ICO) under reference {siteConfig.company.icoNumber}.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Data We Collect</h2>
            <p>Under UK GDPR (Article 13), we inform you that we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Account data:</strong> name, email address, hashed password</li>
              <li><strong className="text-white">Order data:</strong> purchase history, billing address, payment tokens (not card numbers)</li>
              <li><strong className="text-white">Technical data:</strong> IP address, browser type, pages visited</li>
              <li><strong className="text-white">Marketing data:</strong> email preferences (only with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. Legal Basis for Processing</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Contract performance:</strong> processing orders, delivering products</li>
              <li><strong className="text-white">Legal obligation:</strong> VAT records, financial compliance</li>
              <li><strong className="text-white">Legitimate interests:</strong> fraud prevention, site security</li>
              <li><strong className="text-white">Consent:</strong> marketing emails (you can withdraw at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Data Retention</h2>
            <p>We retain order and financial data for 7 years (HMRC requirement). Account data is kept while your account is active. You may request deletion subject to legal obligations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
            <p>Under UK GDPR you have the right to: access your data, correct inaccuracies, erasure, portability, object to processing, and lodge a complaint with the ICO (ico.org.uk).</p>
            <p>Contact us: <a href={`mailto:${siteConfig.company.email}`} className="text-primary">{siteConfig.company.email}</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Cookies</h2>
            <p>We use strictly necessary cookies (session, cart) and optional analytics cookies. You can manage your preferences via our cookie banner.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Third Parties</h2>
            <p>We share data with: Stripe (payments), PayPal (payments), Supabase (database), Cloudflare R2 (file storage), Resend (email), Vercel (hosting). All are GDPR-compliant processors.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
