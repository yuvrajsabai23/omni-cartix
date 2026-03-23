import { Star } from "lucide-react";

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
    <section className="bg-dark py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="max-w-lg mb-14">
          <h2 className="text-display font-heading font-bold text-white mb-3">
            Trusted by{" "}
            <span className="gradient-text">UK Customers</span>
          </h2>
          <p className="text-white/35 text-sm leading-relaxed">
            Real feedback from real customers who shop with Omni Cartix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-7 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] transition-all duration-300 ease-out-expo hover:-translate-y-0.5"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review */}
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Product */}
              <div className="text-[11px] text-accent/70 mb-5 font-medium tracking-wide uppercase">
                {t.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/[0.04]">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[11px] font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">{t.name}</p>
                  <p className="text-[11px] text-white/30">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
