"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { formatGBP } from "@/lib/utils";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Decimal from "decimal.js";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items } = useCartStore();

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
  const [loading, setLoading] = useState(false);
  const [digitalWaiver, setDigitalWaiver] = useState(false);

  const [form, setForm] = useState({
    email: session?.user?.email || "",
    name: session?.user?.name || "",
    line1: "",
    line2: "",
    city: "",
    county: "",
    postcode: "",
  });

  useEffect(() => {
    if (session?.user?.email) setForm((f) => ({ ...f, email: session.user!.email!, name: session.user!.name || "" }));
  }, [session]);

  const hasDigital = items.some((i) => i.type === "DIGITAL" || i.type === "SAAS");

  const handleStripeCheckout = async () => {
    if (!form.email || !form.name || !form.line1 || !form.city || !form.postcode) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (hasDigital && !digitalWaiver) {
      toast.error("Please accept the digital goods waiver to continue.");
      return;
    }
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          customerEmail: form.email,
          customerName: form.name,
          billingAddress: { line1: form.line1, line2: form.line2, city: form.city, county: form.county, postcode: form.postcode, country: "GB" },
          digitalWaiver: hasDigital ? digitalWaiver : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Checkout failed. Please try again.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <main className="mx-auto max-w-xl px-4 py-24 text-center">
          <ShoppingBag className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Nothing to checkout</h1>
          <Link href="/products"><Button className="bg-gradient-primary text-white">Browse Products</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const field = (id: string, label: string, placeholder: string, required = true, half = false) => (
    <div className={half ? "flex-1" : ""}>
      <Label htmlFor={id} className="text-white/70 text-sm">{label}{required && " *"}</Label>
      <Input
        id={id}
        value={(form as Record<string, string>)[id]}
        onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
        placeholder={placeholder}
        required={required}
        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-heading font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Form */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-4">Contact & Billing Details</h2>
              <div className="space-y-4">
                {field("email", "Email", "you@example.com")}
                {field("name", "Full Name", "Jane Smith")}
                {field("line1", "Address Line 1", "123 Main Street")}
                {field("line2", "Address Line 2", "Flat 4 (optional)", false)}
                <div className="flex gap-3">
                  {field("city", "City", "London", true, true)}
                  {field("postcode", "Postcode", "EC1A 1BB", true, true)}
                </div>
                {field("county", "County", "Greater London (optional)", false)}
              </div>
            </div>

            {hasDigital && (
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="digital-waiver"
                    checked={digitalWaiver}
                    onCheckedChange={(v) => setDigitalWaiver(!!v)}
                    className="mt-0.5 border-accent/50"
                  />
                  <Label htmlFor="digital-waiver" className="text-sm text-white/80 cursor-pointer leading-relaxed">
                    <strong className="text-white">Digital Goods Waiver (required):</strong> I confirm that I want immediate access to the digital content in my order. I understand that by requesting immediate delivery, I waive my 14-day right of withdrawal under UK consumer law for these digital items.
                  </Label>
                </div>
              </div>
            )}

            <Button
              onClick={handleStripeCheckout}
              disabled={loading}
              size="lg"
              className="w-full bg-gradient-primary text-white hover:opacity-90 py-6 text-base font-semibold"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Lock className="h-5 w-5 mr-2" />}
              Pay Securely with Stripe
            </Button>
            <p className="text-xs text-white/30 text-center">
              Payments processed by Stripe. Your card details are never stored on our servers.
            </p>
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-white mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
                {items.map((item) => {
                  const price = new Decimal(item.price);
                  const vat = price.mul(new Decimal(item.vatRate)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
                  return (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-white">{formatGBP(price.add(vat).mul(item.quantity).toNumber())}</p>
                    </div>
                  );
                })}
              </div>
              <Separator className="bg-white/10 mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/60"><span>Subtotal (ex. VAT)</span><span>{formatGBP(subtotal.toNumber())}</span></div>
                <div className="flex justify-between text-white/60"><span>VAT (20%)</span><span>{formatGBP(vatTotal.toNumber())}</span></div>
                <Separator className="bg-white/10 my-2" />
                <div className="flex justify-between text-white font-bold text-base"><span>Total</span><span>{formatGBP(grandTotal.toNumber())}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
