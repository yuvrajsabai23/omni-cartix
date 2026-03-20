import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGBP } from "@/lib/utils";
import { ShoppingBag, Download, Key, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [ordersCount, downloadsCount, licensesCount, totalSpent] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.downloadLink.count({ where: { userId, expiresAt: { gte: new Date() } } }),
    prisma.licenseKey.count({ where: { userId } }),
    prisma.order.aggregate({ where: { userId, status: { in: ["PAID", "DELIVERED", "SHIPPED"] } }, _sum: { total: true } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { orderNumber: true, total: true, status: true, createdAt: true },
  });

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: ordersCount, href: "/dashboard/orders", color: "text-primary bg-primary/20" },
    { icon: Download, label: "Active Downloads", value: downloadsCount, href: "/dashboard/downloads", color: "text-accent bg-accent/20" },
    { icon: Key, label: "License Keys", value: licensesCount, href: "/dashboard/licenses", color: "text-purple-400 bg-purple-500/20" },
    { icon: CreditCard, label: "Total Spent", value: formatGBP(Number(totalSpent._sum.total || 0)), href: "/dashboard/orders", color: "text-success bg-success/20" },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400",
    PROCESSING: "text-blue-400",
    PAID: "text-success",
    SHIPPED: "text-accent",
    DELIVERED: "text-success",
    CANCELLED: "text-red-400",
    REFUNDED: "text-orange-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">
        Welcome back, {session!.user.name?.split(" ")[0] || "there"}! 👋
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, href, color }) => (
          <Link key={label} href={href}>
            <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/50 mt-1">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <p className="mb-3">No orders yet.</p>
              <Link href="/products" className="text-primary hover:underline text-sm">Browse products →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.orderNumber} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">#{order.orderNumber}</p>
                    <p className="text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatGBP(Number(order.total))}</p>
                    <p className={`text-xs ${statusColors[order.status] || "text-white/50"}`}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
