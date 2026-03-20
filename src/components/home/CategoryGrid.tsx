import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { categories } from "@/config/categories";

const categoryColors = {
  PHYSICAL: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/50",
  DIGITAL: "from-primary/20 to-accent/20 border-primary/30 hover:border-primary/50",
  SAAS: "from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-400/50",
};

const categoryTextColors = {
  PHYSICAL: "text-emerald-400",
  DIGITAL: "text-primary",
  SAAS: "text-purple-400",
};

export default function CategoryGrid() {
  return (
    <section className="bg-dark py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
            Browse by{" "}
            <span className="gradient-text">Category</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            From tangible goods to digital assets and powerful software — discover everything you need in one place.
          </p>
        </div>

        {/* 3 main category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`group relative p-8 rounded-2xl border bg-gradient-to-br ${categoryColors[cat.productType]} backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{cat.icon}</div>

              {/* Name */}
              <h3 className={`text-xl font-bold mb-2 ${categoryTextColors[cat.productType]}`}>
                {cat.name}
              </h3>

              {/* Description */}
              <p className="text-white/60 text-sm mb-4">{cat.description}</p>

              {/* Subcategory preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cat.subcategories.slice(0, 4).map((sub) => (
                  <span
                    key={sub.slug}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60"
                  >
                    {sub.icon} {sub.name}
                  </span>
                ))}
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                  +{cat.subcategories.length - 4} more
                </span>
              </div>

              {/* CTA */}
              <div className={`flex items-center gap-2 text-sm font-medium ${categoryTextColors[cat.productType]} group-hover:gap-3 transition-all`}>
                Browse {cat.name}
                <ArrowRight className="h-4 w-4" />
              </div>

              {/* SIC code badge */}
              <div className="absolute top-4 right-4 text-xs text-white/30">
                SIC {cat.sicCode}
              </div>
            </Link>
          ))}
        </div>

        {/* Subcategory grid teaser */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            View all 30 subcategories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
