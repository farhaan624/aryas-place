"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

async function fetchCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(priceRange[0]));
    params.set("maxPrice", String(priceRange[1]));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearAll = () => {
    router.push(pathname);
    setPriceRange([0, 100000]);
  };

  const activeCategory = searchParams.get("category");
  const activeSort = searchParams.get("sort") ?? "newest";

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-xs tracking-widest text-muted-foreground">SORT</Label>
        <Select value={activeSort} onValueChange={(v) => updateParam("sort", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-xs tracking-widest text-muted-foreground">CATEGORY</Label>
        <div className="space-y-1">
          <button
            onClick={() => updateParam("category", null)}
            className={`block w-full text-left text-sm py-1 transition-colors ${
              !activeCategory ? "text-gold font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat: { slug: string; name: string }) => (
            <button
              key={cat.slug}
              onClick={() => updateParam("category", cat.slug)}
              className={`block w-full text-left text-sm py-1 transition-colors ${
                activeCategory === cat.slug ? "text-gold font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-xs tracking-widest text-muted-foreground">PRICE RANGE</Label>
        <Slider
          min={0}
          max={100000}
          step={500}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handlePriceApply}>
          Apply
        </Button>
      </div>

      <Separator />

      {/* Clear All */}
      <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={handleClearAll}>
        Clear Filters
      </Button>
    </div>
  );
}
