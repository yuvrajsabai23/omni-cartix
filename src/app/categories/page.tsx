import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { categories } from "@/config/categories";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Categories",
  description: "Explore all product categories — physical goods, digital downloads, and SaaS tools.",
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Browse <span className="gradient-text">All Categories</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Discover 30 categories across physical, digital, and software products.
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat.slug} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{cat.name}</h2>
                  <p className="text-sm text-white/50">SIC {cat.sicCode} — {cat.description}</p>
                </div>
              </div>
              <Link
                href={`/categories/${cat.slug}`}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cat.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/products?category=${sub.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all text-center"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{sub.icon}</span>
                  <span className="text-xs text-white/70 group-hover:text-white transition-colors">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
