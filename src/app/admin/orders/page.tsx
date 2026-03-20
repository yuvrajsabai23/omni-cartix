import { prisma } from "@/lib/prisma";
import { formatGBP, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Admin" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PAID: "bg-success/20 text-success border-success/30",
  SHIPPED: "bg-accent/20 text-accent border-accent/30",
  DELIVERED: "bg-success/20 text-success border-success/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  REFUNDED: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const orders = await prisma.order.findMany({
    where: searchParams.status ? { status: searchParams.status as import("@prisma/client").OrderStatus } : {},
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { productName: true, quantity: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Orders ({orders.length})</h1>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Order</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Customer</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Items</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Total</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Date</th>
              <th className="text-left px-5 py-3 text-white/50 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5">
                <td className="px-5 py-3 font-mono text-white/70 text-xs">{order.orderNumber}</td>
                <td className="px-5 py-3">
                  <p className="text-white text-xs">{order.user?.name || order.guestEmail || "Guest"}</p>
                  <p className="text-white/40 text-xs">{order.user?.email || ""}</p>
                </td>
                <td className="px-5 py-3 text-white/60 text-xs">{order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}</td>
                <td className="px-5 py-3 font-semibold text-white">{formatGBP(Number(order.total))}</td>
                <td className="px-5 py-3 text-white/40 text-xs">{formatDateTime(order.createdAt)}</td>
                <td className="px-5 py-3">
                  <Badge className={`text-xs border ${statusColors[order.status] || ""}`}>{order.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
