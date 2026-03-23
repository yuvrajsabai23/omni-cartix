import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/products/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  vatRate: number;
  type: "PHYSICAL" | "DIGITAL" | "SAAS";
  thumbnailUrl: string | null;
  images: string[];
  category: { name: string; slug: string };
  _count: { reviews: number };
  averageRating?: number;
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-xl bg-white/[0.04]" />
          <Skeleton className="h-4 w-3/4 bg-white/[0.04]" />
          <Skeleton className="h-4 w-1/2 bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="bg-dark-surface py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-display font-heading font-bold text-white mb-2">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-white/35 text-sm">Hand-picked by our team — highest quality, best value.</p>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-white/25">
            <p className="text-sm">No featured products yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-8 text-center">
          <Link href="/products?featured=true" className="text-sm text-white/40 hover:text-white/70 flex items-center justify-center gap-1 transition-colors duration-200">
            View all featured products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
