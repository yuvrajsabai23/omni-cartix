"use client";

import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "",
    description: "Browse and buy products with no subscription required.",
    features: ["Browse all products", "Physical product purchases", "Basic digital downloads", "Email support", "UK VAT invoices"],
    cta: "Get Started Free",
    href: "/auth/signup",
    plan: null,
    popular: false,
    gradient: false,
  },
  {
    name: "Pro",
    price: 9.99,
    period: "/month",
    description: "Perfect for creators and frequent buyers.",
    features: ["Everything in Free", "Unlimited digital downloads", "Priority support", "Exclusive member deals", "Download history", "License key management", "Early access to new products"],
    cta: "Start 14-Day Free Trial",
    href: null,
    plan: "pro",
    popular: true,
    gradient: true,
  },
  {
    name: "Business",
    price: 29.99,
    period: "/month",
    description: "For businesses and power users.",
    features: ["Everything in Pro", "Team member access (5 seats)", "API access", "Bulk purchase discounts", "Dedicated account manager", "Custom invoicing", "SLA support", "Analytics dashboard"],
    cta: "Start 14-Day Free Trial",
    href: null,
    plan: "business",
    popular: false,
    gradient: false,
  },
  {
    name: "Enterprise",
    price: null,
    period: "",
    description: "Custom solutions for large organisations.",
    features: ["Everything in Business", "Unlimited team seats", "Custom integrations", "White-label options", "Dedicated infrastructure", "24/7 phone support", "Custom SLA", "Volume pricing"],
    cta: "Contact Sales",
    href: "/contact",
    plan: null,
    popular: false,
    gradient: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/pricing`);
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">Simple Pricing</Badge>
          <h1 className="text-5xl font-heading font-bold text-white mb-4">
            Plans for <span className="gradient-text">Every Need</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Start free, upgrade when you need more. All plans include VAT invoices and UK customer support. Prices shown ex. VAT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all hover:-translate-y-1 ${
                plan.popular
                  ? "bg-gradient-to-b from-primary/20 to-primary/5 border-primary/50 shadow-xl shadow-primary/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white border-0 shadow-lg">Most Popular</Badge>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-white/50">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price === null ? (
                  <p className="text-3xl font-bold text-white">Custom</p>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">£{plan.price === 0 ? "0" : plan.price.toFixed(2)}</span>
                    <span className="text-white/50 text-sm">{plan.period}</span>
                  </div>
                )}
                {plan.price !== null && plan.price > 0 && <p className="text-xs text-white/30 mt-1">ex. VAT</p>}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-white/70">
                    <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-primary" : "text-success"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.plan ? (
                <Button
                  onClick={() => handleSubscribe(plan.plan!)}
                  disabled={loading === plan.plan}
                  className={`w-full ${plan.gradient ? "bg-gradient-primary text-white hover:opacity-90" : "bg-transparent border border-white/20 text-white hover:bg-white/10"}`}
                  variant={plan.gradient ? "default" : "outline"}
                >
                  {loading === plan.plan ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.cta}
                </Button>
              ) : (
                <Link href={plan.href ?? "/auth/signup"}>
                  <Button
                    className={`w-full ${plan.gradient ? "bg-gradient-primary text-white hover:opacity-90" : "bg-transparent border border-white/20 text-white hover:bg-white/10"}`}
                    variant={plan.gradient ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-white/30 mt-10">
          All plans include UK VAT invoices • GDPR compliant • Cancel anytime • No hidden fees
        </p>
      </main>
      <Footer />
    </div>
  );
}
