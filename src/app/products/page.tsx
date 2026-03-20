import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full range of physical products, digital downloads, and SaaS tools.",
};

async function getProducts(searchParams: {
  category?: string;
  type?: string;
  sort?: string;
  page?: string;
  q?: string;
  featured?: string;
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 24;
  const skip = (page - 1) * limit;

  const where: import("@prisma/client").Prisma.ProductWhereInput = { published: true };

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
      { shortDesc: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.type) {
    where.type = searchParams.type as import("@prisma/client").ProductType;
  }

  if (searchParams.featured === "true") {
    where.featured = true;
  }

  const orderBy: import("@prisma/client").Prisma.ProductOrderByWithRelationInput =
    searchParams.sort === "price-asc"
      ? { price: "asc" }
      : searchParams.sort === "price-desc"
      ? { price: "desc" }
      : searchParams.sort === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" };

  try {
    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({
        where: { parentId: { not: null } },
        select: { name: true, slug: true, sicCode: true },
        orderBy: { name: "asc" },
      }),
    ]);

    const productIds = products.map((p) => p.id);
    const ratings = await prisma.review.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds }, approved: true },
      _avg: { rating: true },
    });
    const ratingMap = Object.fromEntries(ratings.map((r) => [r.productId, r._avg.rating]));

    const productsWithRating = products.map((p) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      vatRate: Number(p.vatRate),
      averageRating: ratingMap[p.id] ?? undefined,
    }));

    return { products: productsWithRating, total, categories, page, limit };
  } catch {
    return { products: [], total: 0, categories: [], page, limit };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    type?: string;
    sort?: string;
    page?: string;
    q?: string;
    featured?: string;
  };
}) {
  const { products, total, categories, page, limit } = await getProducts(searchParams);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            {searchParams.q ? `Search: "${searchParams.q}"` : searchParams.featured === "true" ? "Featured Products" : "All Products"}
          </h1>
          <p className="text-white/50 text-sm">{total} product{total !== 1 ? "s" : ""} found</p>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters categories={categories} />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              total={total}
              page={page}
              totalPages={totalPages}
              searchParams={searchParams}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
