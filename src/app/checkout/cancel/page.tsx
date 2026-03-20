import { XCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 mx-auto mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Payment Cancelled</h1>
        <p className="text-white/60 mb-8">Your payment was cancelled and you have not been charged. Your cart items are still saved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/cart"><Button className="bg-gradient-primary text-white">Return to Cart</Button></Link>
          <Link href="/products"><Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Browse Products</Button></Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
