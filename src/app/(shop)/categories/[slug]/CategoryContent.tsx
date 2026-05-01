"use client";

import type { Category } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";

interface Props {
  category: Category;
}

export function CategoryContent({ category }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") ?? 1);

  const { data, isLoading } = useProducts({ category: category.slug, page, limit: 12 });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <p className="text-xs tracking-[0.4em] text-muted-foreground mb-3">COLLECTION</p>
        <h1 className="font-heading text-3xl md:text-4xl tracking-wide">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            {category.description}
          </p>
        )}
        {data && (
          <p className="text-xs text-muted-foreground mt-3">{data.total} items</p>
        )}
      </div>

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          title="No items in this category"
          description="Check back soon for new arrivals."
          icon="🏷️"
          action={{ label: "Browse All", href: "/products" }}
        />
      ) : (
        <>
          <ProductGrid products={data?.data ?? []} isLoading={isLoading} />
          {data && data.totalPages > 1 && (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(p) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(p));
                router.push(`/categories/${category.slug}?${params.toString()}`);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
