import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { categories } from "@/config/categories";

const categoryColors = {
  PHYSICAL: "border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]",
  DIGITAL: "border-primary/20 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.06)]",
  SAAS: "border-purple-500/20 hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.06)]",
};

const categoryTextColors = {
  PHYSICAL: "text-emerald-400",
  DIGITAL: "text-primary-light",
  SAAS: "text-purple-400",
};

const categoryIconBg = {
  PHYSICAL: "bg-emerald-500/10",
  DIGITAL: "bg-primary/10",
  SAAS: "bg-purple-500/10",
};

export default function CategoryGrid() {
  return (
    <section className="bg-dark py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header — left-aligned for asymmetry */}
        <div className="max-w-lg mb-14">
          <h2 className="text-display font-heading font-bold text-white mb-3">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            From tangible goods to digital assets and powerful software — discover everything you need in one place.
          </p>
        </div>

        {/* 3 main category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`group relative p-7 rounded-xl border bg-white/[0.02] ${categoryColors[cat.productType]} transition-all duration-300 ease-out-expo hover:-translate-y-0.5`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-lg ${categoryIconBg[cat.productType]} mb-5`}>
                <span className="text-2xl">{cat.icon}</span>
              </div>

              {/* Name */}
              <h3 className={`text-lg font-heading font-semibold mb-2 ${categoryTextColors[cat.productType]}`}>
                {cat.name}
              </h3>

              {/* Description */}
              <p className="text-white/35 text-sm mb-5 leading-relaxed">{cat.description}</p>

              {/* Subcategory preview */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {cat.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub.slug}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.04]"
                  >
                    {sub.icon} {sub.name}
                  </span>
                ))}
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.02] text-white/25">
                  +{cat.subcategories.length - 3} more
                </span>
              </div>

              {/* CTA */}
              <div className={`flex items-center gap-2 text-sm font-medium ${categoryTextColors[cat.productType]} group-hover:gap-3 transition-all duration-200 ease-out-expo`}>
                Browse {cat.name}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors duration-200"
          >
            View all subcategories
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
