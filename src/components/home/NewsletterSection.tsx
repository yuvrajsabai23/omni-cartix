"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("You're subscribed! Check your inbox for your 10% discount code.");
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-dark-surface py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.01] p-10 sm:p-16 text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-primary/[0.04] blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent/[0.03] blur-[100px]" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <Mail className="h-5 w-5 text-accent/70" />
              </div>
            </div>

            <h2 className="text-display font-heading font-bold text-white mb-3">
              Get 10% Off Your First Order
            </h2>
            <p className="text-white/35 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Subscribe to our newsletter for exclusive deals, new product launches, and insider UK tech news.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-accent/30 h-10 text-sm"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-primary text-white hover:opacity-90 whitespace-nowrap h-10 rounded-full px-6 text-sm"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>

            <p className="text-[11px] text-white/20 mt-4">
              By subscribing, you agree to our Privacy Policy. We respect your data under UK GDPR.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
