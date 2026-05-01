"use client";

import { useQuery } from "@tanstack/react-query";
import type { ProductWithCategory } from "@/types";

async function fetchProduct(slug: string): Promise<ProductWithCategory> {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });
}
