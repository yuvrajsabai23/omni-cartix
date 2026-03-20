import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerLinks } from "@/config/navigation";

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <span className="text-sm font-bold text-white">OC</span>
              </div>
              <span className="text-xl font-heading font-bold gradient-text">Omni Cartix</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-xs">
              {siteConfig.tagline} — Your UK marketplace for physical goods, digital downloads, and SaaS solutions.
            </p>
            <div className="flex items-center gap-3">
              <Link href={siteConfig.social.twitter} className="text-white/40 hover:text-accent transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href={siteConfig.social.linkedin} className="text-white/40 hover:text-accent transition-colors">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href={siteConfig.social.instagram} className="text-white/40 hover:text-accent transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href={siteConfig.social.facebook} className="text-white/40 hover:text-accent transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* UK Company Info */}
            <div className="text-xs text-white/40 space-y-1">
              <p>
                <strong className="text-white/60">{siteConfig.company.name}</strong> — Registered in England & Wales
              </p>
              <p>
                Company No. {siteConfig.company.registrationNumber} | VAT No.{" "}
                {siteConfig.company.vatNumber} | ICO No. {siteConfig.company.icoNumber}
              </p>
              <p>
                {siteConfig.company.address.line1}, {siteConfig.company.address.city},{" "}
                {siteConfig.company.address.postcode}, {siteConfig.company.address.country}
              </p>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 mr-1">Secure payments:</span>
              {["VISA", "MC", "PayPal", "Apple Pay"].map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center justify-center px-2 py-1 rounded bg-white/10 text-xs text-white/60 font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} {siteConfig.company.name}. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              🇬🇧 UK-registered company | GDPR compliant | VAT registered | Governed by English law
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
