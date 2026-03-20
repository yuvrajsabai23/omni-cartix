import { prisma } from "@/lib/prisma";
import { formatGBP } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [totalOrders, totalCustomers, totalProducts, revenueData] = await Promise.all([
    prisma.order.count({ where: { status: { in: ["PAID", "DELIVERED", "SHIPPED"] } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { published: true } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "DELIVERED", "SHIPPED"] } },
      _sum: { total: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING", "PENDING"] } },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { items: { select: { productName: true } }, user: { select: { name: true, email: true } } },
  });

  const stats = [
    { icon: TrendingUp, label: "Total Revenue", value: formatGBP(Number(revenueData._sum.total || 0)), color: "text-success bg-success/20" },
    { icon: ShoppingBag, label: "Total Orders", value: totalOrders, color: "text-primary bg-primary/20" },
    { icon: Users, label: "Customers", value: totalCustomers, color: "text-accent bg-accent/20" },
    { icon: Package, label: "Products", value: totalProducts, color: "text-purple-400 bg-purple-500/20" },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400",
    PROCESSING: "text-blue-400",
    PAID: "text-success",
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="bg-white/5 border-white/10">
            <CardContent className="p-5">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/50 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">#{order.orderNumber}</p>
                  <p className="text-xs text-white/40">{order.user?.name || order.guestEmail || "Guest"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatGBP(Number(order.total))}</p>
                  <p className={`text-xs ${statusColors[order.status] || "text-white/50"}`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
