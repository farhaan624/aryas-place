"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <EmptyState
          title="Your bag is empty"
          description="Browse our collection and add items to your pre-order bag."
          icon="🛍️"
          action={{ label: "Explore Collection", href: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-28 pb-16 max-w-4xl">
      <h1 className="font-heading text-3xl tracking-wide mb-8">Your Pre-Order Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, idx) => (
            <div key={`${item.productId}-${item.variantId}-${idx}`}>
              <div className="flex gap-4">
                <Link href={`/products/${item.productSlug}`} className="shrink-0">
                  <div className="relative w-20 h-24 rounded-sm overflow-hidden bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productSlug}`} className="font-heading text-base tracking-wide hover:text-gold transition-colors line-clamp-1">
                    {item.productName}
                  </Link>
                  {item.variantLabel && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.variantLabel}</p>
                  )}
                  <PriceDisplay price={item.unitPrice} className="mt-1" size="sm" />

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-border rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2 py-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2 py-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {idx < items.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-muted/30 rounded-sm p-6 space-y-4 sticky top-24">
            <h2 className="font-heading text-lg tracking-wide">Order Summary</h2>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(totalAmount())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">Calculated at checkout</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(totalAmount())}</span>
            </div>
            <Button asChild className="w-full h-11 tracking-widest text-sm mt-2">
              <Link href="/checkout">PROCEED TO CHECKOUT</Link>
            </Button>
            <Link href="/products" className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
