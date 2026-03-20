import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { categories } from "@/config/categories";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const catConfig = categories.find((c) => c.slug === params.slug);

  if (!catConfig) {
    // Try to find as subcategory
    const subCat = categories
      .flatMap((c) => c.subcategories.map((s) => ({ ...s, parentSlug: c.slug })))
      .find((s) => s.slug === params.slug);
    if (!subCat) notFound();
  }


  let productsWithRating: {
    id: string; name: string; slug: string; price: number; comparePrice: number | null;
    vatRate: number; type: string; images: string[]; shortDesc: string | null;
    category: { name: string; slug: string } | null; _count: { reviews: number };
    averageRating: number | undefined;
  }[] = [];

  try {
    const products = await prisma.product.findMany({
      where: {
        published: true,
        category: catConfig
          ? { OR: catConfig.subcategories.map((s) => ({ slug: s.slug })) }
          : { slug: params.slug },
      },
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 24,
    });

    productsWithRating = await Promise.all(
      products.map(async (p) => {
        const agg = await prisma.review.aggregate({
          where: { productId: p.id, approved: true },
          _avg: { rating: true },
        });
        return {
          ...p,
          price: Number(p.price),
          comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
          vatRate: Number(p.vatRate),
          averageRating: agg._avg.rating ?? undefined,
        };
      })
    );
  } catch {
    // DB unavailable — show empty state
  }

  const heading = catConfig?.name || params.slug;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">{heading}</h1>
          <p className="text-white/50">{products.length} products</p>
        </div>

        {productsWithRating.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productsWithRating.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
