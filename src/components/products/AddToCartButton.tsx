"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { ProductType } from "@prisma/client";

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    vatRate: string;
    type: ProductType;
    imageUrl: string;
  };
}

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      vatRate: product.vatRate,
      type: product.type,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAdd}
      size="lg"
      className="w-full bg-gradient-primary text-white hover:opacity-90 py-6 text-base font-semibold shadow-lg shadow-primary/20"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {added ? "Added to Cart ✓" : "Add to Cart"}
    </Button>
  );
}
