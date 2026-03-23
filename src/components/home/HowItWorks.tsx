import { Download, Search, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Discover",
    description:
      "Explore physical products, digital downloads, and SaaS tools. Filter by category, price, and type.",
    color: "text-primary-light",
    bg: "bg-primary/10",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Buy Securely",
    description:
      "Pay with Stripe in GBP. All transactions are encrypted and VAT-inclusive with instant invoice generation.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Download,
    step: "03",
    title: "Download or Receive",
    description:
      "Digital products delivered instantly via secure download link. Physical goods shipped to your UK address.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-dark-surface py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="max-w-lg mb-14">
          <h2 className="text-display font-heading font-bold text-white mb-3">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/35 text-sm leading-relaxed">
            Get started in minutes. No setup fees, no subscriptions required to browse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-emerald-500/20" />

          {steps.map(({ icon: Icon, step, title, description, color, bg }) => (
            <div key={step} className="relative p-7 rounded-xl border border-white/[0.04] bg-white/[0.01] group hover:border-white/[0.08] transition-all duration-300">
              {/* Step number — large background watermark */}
              <div className="absolute top-4 right-5 text-5xl font-heading font-bold text-white/[0.03] select-none">
                {step}
              </div>

              {/* Icon */}
              <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg ${bg} mb-5 group-hover:scale-105 transition-transform duration-300 ease-out-expo`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>

              <h3 className="text-base font-heading font-semibold text-white mb-2">{title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
