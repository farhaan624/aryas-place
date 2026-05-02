"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/products/ProductGallery";
import { VariantSelector } from "@/components/products/VariantSelector";
import { PreOrderButton } from "@/components/products/PreOrderButton";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { SerializedProductWithCategory } from "@/types";

interface Props {
  product: SerializedProductWithCategory;
}

export function ProductDetailContent({ product }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) ?? null;

  const finalPrice = Number(product.price) + (selectedVariant ? Number(selectedVariant.priceAdj) : 0);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-foreground transition-colors">Collection</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div className="space-y-6">
          {/* Category & badges */}
          <div className="flex items-center justify-between">
            <Link href={`/categories/${product.category.slug}`} className="text-xs tracking-widest text-muted-foreground hover:text-gold transition-colors uppercase">
              {product.category.name}
            </Link>
            <div className="flex gap-2">
              {product.isFeatured && (
                <Badge className="bg-gold text-noir text-[10px] tracking-widest border-0">FEATURED</Badge>
              )}
              {!product.isAvailable && (
                <Badge variant="secondary" className="text-[10px]">SOLD OUT</Badge>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-heading text-3xl md:text-4xl tracking-wide leading-tight">{product.name}</h1>
            <WishlistButton productId={product.id} />
          </div>

          {/* Price */}
          <PriceDisplay
            price={finalPrice}
            comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
            size="xl"
          />

          <Separator />

          {/* Variants */}
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />

          {/* Pre-order CTA */}
          <PreOrderButton product={product} selectedVariant={selectedVariant} />

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <p className="text-xs tracking-widest text-muted-foreground">DESCRIPTION</p>
            <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Stock Info */}
          {product.stockLevel > 0 && product.stockLevel <= 10 && (
            <p className="text-xs text-gold tracking-wide">
              Only {product.stockLevel} {product.stockLevel === 1 ? "piece" : "pieces"} remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
