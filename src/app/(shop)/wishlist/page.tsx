"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function WishlistPage() {
  const { data, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-28 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-5 w-5 text-gold" />
        <h1 className="font-heading text-3xl tracking-wide">Wishlist</h1>
        {data && data.length > 0 && (
          <span className="text-sm text-muted-foreground">({data.length} {data.length === 1 ? "item" : "items"})</span>
        )}
      </div>

      {!data || data.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save items you love by clicking the heart icon on any product."
          icon="♡"
          action={{ label: "Browse Collection", href: "/products" }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
