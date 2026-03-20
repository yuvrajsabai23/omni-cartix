import { prisma } from "@/lib/prisma";
import { formatGBP } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const typeBadge = { PHYSICAL: "bg-emerald-500/20 text-emerald-400", DIGITAL: "bg-primary/20 text-primary", SAAS: "bg-purple-500/20 text-purple-400" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-white">Products ({products.length})</h1>
        <Link href="/admin/products/new">
          <Button className="bg-gradient-primary text-white hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Product</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Type</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Price</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Stock</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-5 py-3">
                  <p className="font-medium text-white truncate max-w-xs">{p.name}</p>
                  <p className="text-xs text-white/40">{p.category.name}</p>
                </td>
                <td className="px-5 py-3">
                  <Badge className={`text-xs ${typeBadge[p.type]}`}>{p.type}</Badge>
                </td>
                <td className="px-5 py-3 text-white">{formatGBP(Number(p.price))}</td>
                <td className="px-5 py-3 text-white/60">{p.type === "PHYSICAL" ? p.stock : "—"}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs ${p.published ? "text-success" : "text-white/40"}`}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/products/${p.id}`}>
                    <Button variant="ghost" size="sm" className="text-white/50 hover:text-white h-7 w-7 p-0">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
