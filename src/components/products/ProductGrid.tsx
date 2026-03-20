import Link from "next/link";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PackageX } from "lucide-react";

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

interface Props {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function buildUrl(params: Record<string, string | undefined>, overrides: Record<string, string>) {
  const merged = { ...params, ...overrides };
  const qs = Object.entries(merged)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
    .join("&");
  return `/products${qs ? "?" + qs : ""}`;
}

export default function ProductGrid({ products, total, page, totalPages, searchParams }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageX className="h-16 w-16 text-white/20 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
        <p className="text-white/50 mb-6">Try adjusting your filters or search term.</p>
        <Link href="/products">
          <Button className="bg-gradient-primary text-white">Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/50">{total} results</p>
        <select
          defaultValue={searchParams.sort || "newest"}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Link
            href={buildUrl(searchParams, { page: String(Math.max(1, page - 1)) })}
            className={page <= 1 ? "pointer-events-none opacity-30" : ""}
          >
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          <span className="text-sm text-white/60 px-4">
            Page {page} of {totalPages}
          </span>

          <Link
            href={buildUrl(searchParams, { page: String(Math.min(totalPages, page + 1)) })}
            className={page >= totalPages ? "pointer-events-none opacity-30" : ""}
          >
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
