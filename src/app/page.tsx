import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustBadges from "@/components/home/TrustBadges";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts, { FeaturedProductsSkeleton } from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import NewsletterSection from "@/components/home/NewsletterSection";
import { prisma } from "@/lib/prisma";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { published: true, featured: true },
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const productIds = products.map((p) => p.id);
    const ratings = await prisma.review.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds }, approved: true },
      _avg: { rating: true },
    });
    const ratingMap = Object.fromEntries(ratings.map((r) => [r.productId, r._avg.rating]));

    const productsWithRating = products.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      vatRate: Number(product.vatRate),
      averageRating: ratingMap[product.id] ?? undefined,
    }));

    return productsWithRating;
  } catch {
    return [];
  }
}

async function FeaturedProductsSection() {
  const products = await getFeaturedProducts();
  return <FeaturedProducts products={products} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBadges />
        <CategoryGrid />
        <Suspense fallback={
          <section className="bg-[#080e1a] py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <FeaturedProductsSkeleton />
            </div>
          </section>
        }>
          <FeaturedProductsSection />
        </Suspense>
        <HowItWorks />
        <Testimonials />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
