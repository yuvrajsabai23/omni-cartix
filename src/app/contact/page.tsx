"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-white/60">We&apos;re here to help. Expect a response within 24 hours on business days.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-sm">Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" placeholder="Jane Smith" />
                </div>
                <div>
                  <Label className="text-white/70 text-sm">Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-sm">Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" placeholder="How can we help?" />
              </div>
              <div>
                <Label className="text-white/70 text-sm">Message</Label>
                <Textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required rows={5} className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 resize-none" placeholder="Tell us more..." />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-white hover:opacity-90 py-5">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: siteConfig.company.email, href: `mailto:${siteConfig.company.email}` },
                  { icon: Phone, label: "Phone", value: siteConfig.company.phone, href: `tel:${siteConfig.company.phone}` },
                  { icon: MapPin, label: "Address", value: `${siteConfig.company.address.line1}, ${siteConfig.company.address.city}, ${siteConfig.company.address.postcode}`, href: undefined },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">{label}</p>
                      {href ? <a href={href} className="text-white hover:text-primary text-sm">{value}</a> : <p className="text-white text-sm">{value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-primary/10 border border-primary/20 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Business Hours</h3>
              <p className="text-sm text-white/60">Monday – Friday: 9am – 5pm (GMT/BST)</p>
              <p className="text-sm text-white/60">Saturday – Sunday: Closed</p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-xl text-xs text-white/40 space-y-1">
              <p className="font-semibold text-white/60">{siteConfig.company.name}</p>
              <p>Co. No. {siteConfig.company.registrationNumber} | VAT No. {siteConfig.company.vatNumber}</p>
              <p>Registered in England & Wales | Governed by English Law</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
