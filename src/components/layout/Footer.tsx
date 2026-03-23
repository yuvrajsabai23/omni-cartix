import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerLinks } from "@/config/navigation";

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/[0.04] text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary">
                <span className="text-xs font-bold text-white">OC</span>
              </div>
              <span className="text-base font-heading font-semibold text-white/90">Omni Cartix</span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed mb-5 max-w-xs">
              {siteConfig.tagline} — Your UK marketplace for physical goods, digital downloads, and SaaS solutions.
            </p>
            <div className="flex items-center gap-2.5">
              <Link href={siteConfig.social.twitter} className="text-white/20 hover:text-white/50 transition-colors duration-200">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href={siteConfig.social.linkedin} className="text-white/20 hover:text-white/50 transition-colors duration-200">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href={siteConfig.social.instagram} className="text-white/20 hover:text-white/50 transition-colors duration-200">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href={siteConfig.social.facebook} className="text-white/20 hover:text-white/50 transition-colors duration-200">
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-semibold text-white/40 mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[11px] font-semibold text-white/40 mb-4 uppercase tracking-wider">Products</h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-semibold text-white/40 mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.04] mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* UK Company Info */}
            <div className="text-[11px] text-white/20 space-y-0.5">
              <p>
                <span className="text-white/30">{siteConfig.company.name}</span> — Registered in England & Wales
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
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/20 mr-1">Payments:</span>
              {["VISA", "MC", "PayPal", "Apple Pay"].map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded-sm bg-white/[0.03] text-[10px] text-white/30 font-medium border border-white/[0.04]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-[11px] text-white/15">
              &copy; {new Date().getFullYear()} {siteConfig.company.name}. All rights reserved.
            </p>
            <p className="text-[11px] text-white/15">
              UK registered | GDPR compliant | VAT registered | English law
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
