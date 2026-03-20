"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface Category {
  name: string;
  slug: string;
  sicCode: string;
}

const productTypes = [
  { value: "PHYSICAL", label: "Physical", color: "text-emerald-400" },
  { value: "DIGITAL", label: "Digital", color: "text-primary" },
  { value: "SAAS", label: "SaaS", color: "text-purple-400" },
];

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clearAll = () => router.push("/products");

  const hasFilters = searchParams.get("category") || searchParams.get("type");

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-white/50 hover:text-white h-auto p-0 text-xs gap-1"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Product Type */}
      <div className="mb-5">
        <h4 className="text-sm font-medium text-white/70 mb-3">Product Type</h4>
        <div className="space-y-2">
          {productTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={searchParams.get("type") === type.value}
                onCheckedChange={(checked) =>
                  updateFilter("type", checked ? type.value : null)
                }
                className="border-white/20"
              />
              <Label
                htmlFor={`type-${type.value}`}
                className={`text-sm cursor-pointer ${searchParams.get("type") === type.value ? type.color : "text-white/60"}`}
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10 mb-5" />

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-white/70 mb-3">Category</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
          {categories.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={searchParams.get("category") === cat.slug}
                onCheckedChange={(checked) =>
                  updateFilter("category", checked ? cat.slug : null)
                }
                className="border-white/20"
              />
              <Label
                htmlFor={`cat-${cat.slug}`}
                className={`text-sm cursor-pointer ${searchParams.get("category") === cat.slug ? "text-white" : "text-white/60"}`}
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
