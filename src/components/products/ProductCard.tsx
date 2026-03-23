"use client";

import { ShoppingCart, Star, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import Decimal from "decimal.js";

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

const typeBadgeStyles = {
  PHYSICAL: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  DIGITAL: "bg-primary/15 text-primary-light border-primary/20",
  SAAS: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

const typeLabels = {
  PHYSICAL: "Physical",
  DIGITAL: "Digital",
  SAAS: "SaaS",
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const imageUrl =
    product.thumbnailUrl || product.images?.[0] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop";

  const priceIncVAT = new Decimal(product.price)
    .mul(new Decimal(1).add(product.vatRate))
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl,
      price: product.price.toString(),
      vatRate: product.vatRate.toString(),
      type: product.type,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.02]">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Type badge */}
          <div className="absolute top-2.5 left-2.5">
            <Badge className={`text-[10px] border ${typeBadgeStyles[product.type]} backdrop-blur-md font-medium`}>
              {product.type === "DIGITAL" && <Zap className="h-2.5 w-2.5 mr-1" />}
              {typeLabels[product.type]}
            </Badge>
          </div>

          {/* Discount badge */}
          {product.comparePrice && product.comparePrice > product.price && (
            <div className="absolute top-2.5 right-2.5">
              <Badge className="bg-red-500/90 text-white border-0 text-[10px] font-medium">
                -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </Badge>
            </div>
          )}

          {/* Quick add overlay */}
          <div className="absolute inset-0 bg-dark/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-white text-dark hover:bg-white/90 shadow-lg text-[13px] font-medium rounded-full px-5 scale-95 group-hover:scale-100 transition-transform duration-300 ease-out-expo"
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-[11px] text-white/25 mb-1.5 uppercase tracking-wider font-medium">{product.category.name}</p>

          {/* Name */}
          <h3 className="text-sm font-medium text-white/80 line-clamp-2 mb-2 group-hover:text-white transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          {product._count.reviews > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] text-white/35">
                {product.averageRating?.toFixed(1) || "5.0"} ({product._count.reviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-heading font-semibold text-white">
                  {formatGBP(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-[11px] text-white/25 line-through">
                    {formatGBP(product.comparePrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/20 mt-0.5">ex. VAT ({formatGBP(priceIncVAT)} inc.)</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
