import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog", description: "Tips, guides, and news from Omni Cartix." };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, tags: true },
    take: 20,
  }).catch(() => []);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Omni Cartix <span className="gradient-text">Blog</span></h1>
          <p className="text-white/60">Tips, guides, and news from our team.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                  {post.coverImage && (
                    <div className="relative h-48 bg-gradient-dark overflow-hidden">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-white/40 mb-2">{post.publishedAt ? formatDate(post.publishedAt) : ""}</p>
                    <h2 className="font-semibold text-white group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-white/60 line-clamp-2">{post.excerpt}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
