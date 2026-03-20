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
    <section className="bg-[#080e1a] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/30 via-dark to-accent/20 border border-white/10 p-10 sm:p-16 text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30">
                <Mail className="h-7 w-7 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              Get 10% Off Your First Order
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Subscribe to our newsletter and receive exclusive deals, new product launches, and insider UK tech news.
              Unsubscribe anytime.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-primary text-white hover:opacity-90 whitespace-nowrap"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe & Save 10%"}
              </Button>
            </form>

            <p className="text-xs text-white/30 mt-4">
              By subscribing, you agree to our Privacy Policy. We respect your data under UK GDPR.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
