"use client";

import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatGBP } from "@/lib/utils";
import Decimal from "decimal.js";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const typeLabels = { PHYSICAL: "Physical", DIGITAL: "Digital", SAAS: "SaaS" };
const typeBadgeStyles = {
  PHYSICAL: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  DIGITAL: "bg-primary/20 text-primary border-primary/30",
  SAAS: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum.add(new Decimal(item.price).mul(item.quantity)),
    new Decimal(0)
  );
  const vatTotal = items
    .reduce((sum, item) => {
      const price = new Decimal(item.price).mul(item.quantity);
      return sum.add(price.mul(new Decimal(item.vatRate)));
    }, new Decimal(0))
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const grandTotal = subtotal.add(vatTotal);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState<{ amount: Decimal; code: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.toUpperCase(), subtotal: subtotal.toNumber() }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscount({ amount: new Decimal(data.discountAmount), code: couponCode.toUpperCase() });
        toast.success(`Coupon applied! You save ${formatGBP(data.discountAmount)}`);
      } else {
        toast.error(data.error || "Invalid coupon code.");
      }
    } catch {
      toast.error("Failed to validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-24 text-center">
          <ShoppingBag className="h-20 w-20 text-white/20 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-white/50 mb-8">Browse our products and add something you love.</p>
          <Link href="/products">
            <Button className="bg-gradient-primary text-white px-8 py-5">Browse Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const finalTotal = discount ? grandTotal.sub(discount.amount) : grandTotal;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-heading font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = new Decimal(item.price);
              const vatRate = new Decimal(item.vatRate);
              const vatAmount = price.mul(vatRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
              const lineTotal = price.add(vatAmount).mul(item.quantity);

              return (
                <div key={item.productId} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge className={`text-xs border mb-1 ${typeBadgeStyles[item.type]}`}>
                          {typeLabels[item.type]}
                        </Badge>
                        <Link href={`/products/${item.slug}`} className="block font-semibold text-white hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-xs text-white/40 mt-1">
                          {formatGBP(price.toNumber())} ex. VAT + {formatGBP(vatAmount.toNumber())} VAT
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.productId)} className="text-white/30 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-7 w-7 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-7 w-7 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-white">{formatGBP(lineTotal.toNumber())}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-white mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal (ex. VAT)</span>
                  <span>{formatGBP(subtotal.toNumber())}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>VAT (20%)</span>
                  <span>{formatGBP(vatTotal.toNumber())}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({discount.code})</span>
                    <span>-{formatGBP(discount.amount.toNumber())}</span>
                  </div>
                )}
                <Separator className="bg-white/10" />
                <div className="flex justify-between font-bold text-white text-base">
                  <span>Total</span>
                  <span>{formatGBP(finalTotal.toNumber())}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-5">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Link href="/checkout" className="block mt-5">
                <Button className="w-full bg-gradient-primary text-white hover:opacity-90 py-5 font-semibold text-base">
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <div className="mt-4 text-center">
                <Link href="/products" className="text-xs text-white/40 hover:text-white">
                  ← Continue Shopping
                </Link>
              </div>

              {/* Trust */}
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/30">
                <span>🔒</span>
                <span>Secure checkout · VAT inclusive</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
