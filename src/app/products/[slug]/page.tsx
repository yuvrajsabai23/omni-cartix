import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatGBP } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddToCartButton from "@/components/products/AddToCartButton";
import StarRating from "@/components/products/StarRating";
import Decimal from "decimal.js";
import type { Metadata } from "next";
import { Zap, Package, Cloud, Shield, Download, RefreshCw } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      select: { name: true, shortDesc: true, metaTitle: true, metaDesc: true },
    });
    if (!product) return {};
    return {
      title: product.metaTitle || product.name,
      description: product.metaDesc || product.shortDesc || undefined,
    };
  } catch {
    return {};
  }
}

const typeConfig = {
  PHYSICAL: { icon: Package, label: "Physical Product", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30" },
  DIGITAL: { icon: Download, label: "Digital Download", color: "text-primary", bg: "bg-primary/20 border-primary/30" },
  SAAS: { icon: Cloud, label: "SaaS / Software", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30" },
};

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug, published: true },
      include: {
        category: true,
        reviews: {
          where: { approved: true },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });
  } catch {
    notFound();
  }

  if (!product) notFound();

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const price = new Decimal(product.price.toString());
  const vatRate = new Decimal(product.vatRate.toString());
  const vatAmount = price.mul(vatRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const priceIncVAT = price.add(vatAmount);
  const comparePrice = product.comparePrice ? new Decimal(product.comparePrice.toString()) : null;

  const typeInfo = typeConfig[product.type];
  const TypeIcon = typeInfo.icon;

  const mainImage = product.thumbnailUrl || product.images[0] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop";

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.slice(0, 5).map((img, idx) => (
                  <div key={idx} className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-primary/40">
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category + Type */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-white/10 text-white/60 border-white/10 text-xs">
                {product.category.name}
              </Badge>
              <Badge className={`border text-xs ${typeInfo.bg} ${typeInfo.color}`}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeInfo.label}
              </Badge>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-heading font-bold text-white">{product.name}</h1>

            {/* Rating */}
            {product._count.reviews > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={avgRating} readonly />
                <span className="text-sm text-white/60">
                  {avgRating.toFixed(1)} ({product._count.reviews} review{product._count.reviews !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">{formatGBP(Number(price))}</span>
                {comparePrice && comparePrice.gt(price) && (
                  <span className="text-xl text-white/40 line-through">{formatGBP(Number(comparePrice))}</span>
                )}
              </div>
              <p className="text-sm text-white/50">
                ex. VAT • {formatGBP(Number(priceIncVAT))} inc. 20% VAT
              </p>
            </div>

            {/* Short description */}
            {product.shortDesc && (
              <p className="text-white/70 leading-relaxed">{product.shortDesc}</p>
            )}

            <Separator className="bg-white/10" />

            {/* Add to cart */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price.toString(),
                vatRate: product.vatRate.toString(),
                type: product.type,
                imageUrl: mainImage,
              }}
            />

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-xs text-white/60">Secure Checkout</span>
              </div>
              {product.type === "DIGITAL" ? (
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="text-xs text-white/60">Instant Delivery</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <Package className="h-5 w-5 text-accent" />
                  <span className="text-xs text-white/60">UK Shipping</span>
                </div>
              )}
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <RefreshCw className="h-5 w-5 text-primary" />
                <span className="text-xs text-white/60">14-Day Returns</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} className="bg-white/5 text-white/50 border-white/10 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full description */}
        <div className="mt-16">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Product Description</h2>
          <div className="prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </div>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">
              Customer Reviews ({product._count.reviews})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} readonly size="sm" />
                        {review.verifiedPurchase && (
                          <Badge className="bg-success/20 text-success border-success/30 text-xs">
                            ✓ Verified Purchase
                          </Badge>
                        )}
                      </div>
                      {review.title && <h4 className="font-semibold text-white mb-1">{review.title}</h4>}
                      <p className="text-white/60 text-sm">{review.body}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/30 mt-3">
                    {review.user.name || "Anonymous"} • {new Date(review.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
