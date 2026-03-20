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
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="bg-[#080e1a] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-white/60">Hand-picked by our team — highest quality, best value.</p>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <p>No featured products yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/products?featured=true" className="text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-1">
            View all featured products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
