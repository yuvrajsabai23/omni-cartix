import { CheckCircle, Download, Package, Mail } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatGBP } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; order_id?: string };
}) {
  let order = null;

  if (searchParams.session_id) {
    order = await prisma.order.findFirst({
      where: { stripeSessionId: searchParams.session_id },
      include: {
        items: { include: { product: { select: { name: true, type: true } } } },
        downloadLinks: { include: { product: { select: { name: true } } } },
      },
    }).catch(() => null);
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        {/* Success icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>

        <h1 className="text-3xl font-heading font-bold text-white mb-3">
          Order Confirmed! 🎉
        </h1>

        {order ? (
          <>
            <p className="text-white/60 mb-2">
              Order <strong className="text-white">#{order.orderNumber}</strong>
            </p>
            <p className="text-white/60 mb-8">
              Total: <strong className="text-white">{formatGBP(Number(order.total))}</strong>
            </p>

            {/* Digital downloads */}
            {order.downloadLinks.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Download className="h-5 w-5 text-accent" />
                  <h2 className="font-semibold text-white">Your Downloads</h2>
                </div>
                <div className="space-y-3">
                  {order.downloadLinks.map((link: { id: string; token: string; product: { name: string } }) => (
                    <div key={link.id} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-white/70">{link.product.name}</span>
                      <Link href={`/api/downloads/${link.token}`}>
                        <Button size="sm" className="bg-accent text-white hover:bg-accent/90 text-xs">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-4">
                  ⏰ Links expire in 24 hours (max 3 downloads each). Check your email for a copy.
                </p>
              </div>
            )}

            {/* Physical items */}
            {order.items.some((i: { productType: string }) => i.productType === "PHYSICAL") && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-emerald-400" />
                  <h2 className="font-semibold text-white">Shipping Info</h2>
                </div>
                <p className="text-sm text-white/60">
                  Your physical items will be dispatched within 1-2 business days. You&apos;ll receive a tracking email.
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-white/60 mb-8">
            Your order is being processed. You&apos;ll receive a confirmation email shortly.
          </p>
        )}

        {/* Email notice */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm text-white/50">
          <Mail className="h-4 w-4" />
          <span>A confirmation email has been sent to your inbox.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/orders">
            <Button className="bg-gradient-primary text-white hover:opacity-90">View My Orders</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Continue Shopping</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
