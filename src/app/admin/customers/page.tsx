import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customers — Admin" };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Customers ({customers.length})</h1>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Orders</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="px-5 py-3 text-white">{c.name || "—"}</td>
                <td className="px-5 py-3 text-white/60">{c.email}</td>
                <td className="px-5 py-3 text-white/60">{c._count.orders}</td>
                <td className="px-5 py-3 text-white/40 text-xs">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
