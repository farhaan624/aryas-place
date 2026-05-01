"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const filters = {
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    limit: 12,
  };

  const { data, isLoading } = useProducts(filters);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-28 pb-16">
      {/* Header */}
      <div className="mb-12 border-b border-gold/10 pb-8">
        <p className="text-[10px] tracking-[0.5em] text-gold mb-3 uppercase">Browse</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl tracking-wide">The Collection</h1>
            {data && (
              <p className="text-xs tracking-widest text-muted-foreground mt-2 uppercase">
                {data.total} {data.total === 1 ? "piece" : "pieces"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search collection…"
                className="pl-9 h-9 text-xs tracking-wide bg-transparent border-gold/20 focus:border-gold/50"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden gap-2 border-gold/20 text-cream/60 text-xs tracking-widest">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto bg-noir border-gold/10">
                <div className="pt-6">
                  <ProductFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-52 shrink-0">
          <ProductFilters />
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {!isLoading && data?.data.length === 0 ? (
            <EmptyState
              title="No items found"
              description="Try adjusting your filters or search terms."
              icon="🔍"
              action={{ label: "Clear Filters", href: "/products" }}
            />
          ) : (
            <>
              <ProductGrid products={data?.data ?? []} isLoading={isLoading} />
              {data && data.totalPages > 1 && (
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
