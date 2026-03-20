import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGBP, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PAID: "bg-success/20 text-success border-success/30",
  SHIPPED: "bg-accent/20 text-accent border-accent/30",
  DELIVERED: "bg-success/20 text-success border-success/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  REFUNDED: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: {
      items: { select: { productName: true, quantity: true, total: true, productType: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-heading font-bold text-white mb-6">My Orders</h1>
        <div className="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-white/10">
          <p>You haven&apos;t placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">My Orders ({orders.length})</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold text-white">#{order.orderNumber}</p>
                <p className="text-xs text-white/40">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{formatGBP(Number(order.total))}</p>
                <Badge className={`text-xs border mt-1 ${statusColors[order.status] || ""}`}>
                  {order.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{item.productName} × {item.quantity}</span>
                  <span className="text-white/50">{formatGBP(Number(item.total))}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
