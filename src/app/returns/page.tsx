import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & Refunds Policy" };

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Returns & Refunds Policy</h1>
        <p className="text-white/50 text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-white">Physical Products — 14-Day Right of Withdrawal</h2>
            <p>Under the Consumer Contracts Regulations 2013, you have 14 days from the date of delivery to return physical goods without providing a reason. To initiate a return, email <a href={`mailto:${siteConfig.company.email}`} className="text-primary">{siteConfig.company.email}</a> with your order number.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Items must be returned in original, unused condition</li>
              <li>You are responsible for return postage costs unless the item is faulty</li>
              <li>Refunds issued within 14 days of receiving the returned item</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Digital Products — No Refunds After Download</h2>
            <p>By law, digital content is exempt from the 14-day right of withdrawal once you have given consent for immediate supply and acknowledged that you lose the right to withdraw. You confirm this at checkout.</p>
            <p>If a digital product is defective or not as described, please contact us within 7 days and we will endeavour to provide a replacement or refund at our discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">SaaS & Subscriptions</h2>
            <p>Subscriptions can be cancelled at any time from your dashboard. You retain access until the end of your billing period. No partial refunds for unused time unless required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Faulty or Incorrect Items</h2>
            <p>If you receive a faulty or incorrect item, contact us at <a href={`mailto:${siteConfig.company.email}`} className="text-primary">{siteConfig.company.email}</a> within 30 days. We will arrange a replacement or full refund including return postage.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
