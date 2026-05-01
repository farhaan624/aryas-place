import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0] ?? "/images/placeholder.png";

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-muted aspect-[3/4] rounded-sm">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <Badge className="bg-gold text-noir text-[10px] tracking-widest border-0">
              FEATURED
            </Badge>
          )}
          {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
            <Badge variant="destructive" className="text-[10px] tracking-widest border-0">
              SALE
            </Badge>
          )}
          {!product.isAvailable && (
            <Badge variant="secondary" className="text-[10px] tracking-widest">
              SOLD OUT
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} className="bg-background/80 backdrop-blur-sm" />
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
          {product.category.name}
        </p>
        <h3 className="font-heading text-base tracking-wide group-hover:text-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        <PriceDisplay price={Number(product.price)} comparePrice={product.comparePrice ? Number(product.comparePrice) : null} size="sm" />
      </div>
    </Link>
  );
}
