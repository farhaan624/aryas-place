"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse, ProductWithCategory } from "@/types";

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

async function fetchProducts(filters: ProductFilters): Promise<PaginatedResponse<ProductWithCategory>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });
}
