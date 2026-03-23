import { Lock, Shield, Star, Truck, Zap } from "lucide-react";

const badges = [
  { icon: Lock, label: "Secure Payments", desc: "256-bit SSL" },
  { icon: Shield, label: "UK Registered", desc: "Companies House" },
  { icon: Zap, label: "Instant Delivery", desc: "Digital in seconds" },
  { icon: Star, label: "4.9/5 Rating", desc: "Verified reviews" },
  { icon: Truck, label: "Free Returns", desc: "14-day policy" },
];

export default function TrustBadges() {
  return (
    <section className="bg-dark border-y border-white/[0.04] py-5">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {badges.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-200">
                <Icon className="h-3.5 w-3.5 text-white/30 group-hover:text-accent/70 transition-colors duration-200" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white/60">{label}</p>
                <p className="text-[11px] text-white/25">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
