import { Download, Search, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Discover",
    description:
      "Explore thousands of physical products, digital downloads, and SaaS tools. Filter by category, price, and type.",
    color: "text-primary bg-primary/20",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Buy Securely",
    description:
      "Pay with Stripe or PayPal in GBP. All transactions are encrypted and VAT-inclusive with instant invoice generation.",
    color: "text-accent bg-accent/20",
  },
  {
    icon: Download,
    step: "03",
    title: "Download or Receive",
    description:
      "Digital products delivered instantly via secure download link. Physical goods shipped to your UK address.",
    color: "text-success bg-success/20",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#080e1a] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Get started in minutes. No setup fees, no subscriptions required to browse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-primary opacity-30" />

          {steps.map(({ icon: Icon, step, title, description, color }) => (
            <div key={step} className="relative flex flex-col items-center text-center group">
              {/* Step number */}
              <div className="text-6xl font-bold text-white/5 absolute -top-4 font-heading select-none">
                {step}
              </div>

              {/* Icon */}
              <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl ${color} mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
