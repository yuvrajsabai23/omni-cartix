import { Lock, Shield, Star, Truck, Zap } from "lucide-react";

const badges = [
  { icon: Lock, label: "Secure UK Payments", desc: "256-bit SSL encrypted" },
  { icon: Shield, label: "UK Registered", desc: "Companies House verified" },
  { icon: Zap, label: "Instant Delivery", desc: "Digital products in seconds" },
  { icon: Star, label: "4.9/5 Rating", desc: "From 10,000+ reviews" },
  { icon: Truck, label: "Free Returns", desc: "14-day return policy" },
];

export default function TrustBadges() {
  return (
    <section className="bg-dark border-y border-white/10 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {badges.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-white/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
