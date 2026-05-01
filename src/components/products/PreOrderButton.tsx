"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory } from "@/types";
import type { ProductVariant } from "@prisma/client";

interface PreOrderButtonProps {
  product: ProductWithCategory;
  selectedVariant: ProductVariant | null;
}

export function PreOrderButton({ product, selectedVariant }: PreOrderButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const maxQty = selectedVariant ? selectedVariant.stock : product.stockLevel;
  const isAvailable = product.isAvailable && maxQty > 0;
  const unitPrice = Number(product.price) + (selectedVariant ? Number(selectedVariant.priceAdj) : 0);

  const handleAddToCart = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!product.isAvailable) {
      toast.error("This item is not available for pre-order");
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      quantity,
      unitPrice,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: product.images[0] ?? "/images/placeholder.png",
      variantLabel: selectedVariant
        ? `${selectedVariant.type}: ${selectedVariant.value}`
        : undefined,
    });

    toast.success(`${product.name} added to your pre-order bag`);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Stepper */}
      {isAvailable && (
        <div className="flex items-center gap-4">
          <p className="text-xs tracking-widest text-muted-foreground">QUANTITY</p>
          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty}
              className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          {maxQty <= 5 && (
            <p className="text-xs text-gold">{maxQty} remaining</p>
          )}
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={!isAvailable}
        className="w-full h-12 tracking-widest text-sm"
        size="lg"
      >
        {isAvailable ? "PRE-ORDER NOW" : "SOLD OUT"}
      </Button>

      {!isAvailable && (
        <p className="text-xs text-muted-foreground text-center">
          This item is currently sold out. Check back soon.
        </p>
      )}
    </div>
  );
}
