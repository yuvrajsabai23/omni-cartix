import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="text-8xl font-heading font-bold gradient-text mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/50 max-w-md mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button className="bg-gradient-primary text-white hover:opacity-90">Go Home</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Browse Products
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
