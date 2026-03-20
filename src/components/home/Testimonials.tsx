import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Freelance Designer",
    location: "London, UK",
    rating: 5,
    review:
      "The template collection is absolutely brilliant. Downloaded the Canva pack and had my client presentation done in under an hour. Instant delivery, quality files — couldn't ask for more.",
    product: "Design Template Bundle",
    avatar: "ST",
  },
  {
    name: "James Whitfield",
    role: "SaaS Founder",
    location: "Manchester, UK",
    rating: 5,
    review:
      "Bought the analytics dashboard tool and it's transformed how we report to stakeholders. The license key was delivered instantly and setup was a breeze. Excellent UK-focused platform.",
    product: "Analytics Dashboard Pro",
    avatar: "JW",
  },
  {
    name: "Priya Sharma",
    role: "E-commerce Entrepreneur",
    location: "Birmingham, UK",
    rating: 5,
    review:
      "Ordered a batch of handmade craft supplies and they arrived beautifully packaged in 2 days. The checkout was smooth, VAT invoice ready immediately. Will definitely order again!",
    product: "Premium Craft Kit",
    avatar: "PS",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-dark py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
            Trusted by{" "}
            <span className="gradient-text">UK Customers</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Join over 50,000 satisfied customers who shop with Omni Cartix every month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-white/70 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Product */}
                <div className="text-xs text-accent mb-4">📦 {t.product}</div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/50">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
