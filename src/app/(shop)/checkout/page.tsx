"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, totalAmount } = useCartStore();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }
    createOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createOrder = async () => {
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: {
            fullName: "Pending",
            line1: "Pending",
            city: "Pending",
            state: "Pending",
            country: "Nigeria",
            zip: "00000",
          },
        }),
      });

      if (!orderRes.ok) {
        const error = await orderRes.json();
        toast.error(error.error ?? "Failed to create order");
        router.replace("/cart");
        return;
      }

      const order = await orderRes.json();
      setOrderId(order.id);
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !orderId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <LoadingSpinner className="mx-auto" />
          <p className="text-sm text-muted-foreground">Preparing your order…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-28 pb-16 max-w-5xl">
      <h1 className="font-heading text-3xl tracking-wide mb-10">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <CheckoutForm orderId={orderId} />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary items={items} total={totalAmount()} />
        </div>
      </div>
    </div>
  );
}
