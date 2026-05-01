"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import type { ShippingAddressInput } from "@/lib/validations";

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const shippingAddr = order.shippingAddress as ShippingAddressInput;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl tracking-wide">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="border border-border rounded-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <OrderStatusBadge status={order.paymentStatus} />
        </div>
        <OrderTimeline status={order.status} />
      </div>

      {/* Order Items */}
      <div className="border border-border rounded-sm p-6 space-y-4">
        <h2 className="font-heading text-lg tracking-wide">Items</h2>
        <Separator />
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <Link href={`/products/${item.product.slug}`} className="shrink-0">
              <div className="relative w-16 h-20 rounded-sm overflow-hidden bg-muted">
                <Image
                  src={item.product.images[0] ?? "/images/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{item.product.name}</p>
              {item.variant && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.variant.type}: {item.variant.value}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium">{formatPrice(Number(item.unitPrice) * item.quantity)}</p>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(Number(order.totalAmount))}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border border-border rounded-sm p-6 space-y-3">
        <h2 className="font-heading text-lg tracking-wide">Shipping Address</h2>
        <Separator />
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="text-foreground font-medium">{shippingAddr.fullName}</p>
          <p>{shippingAddr.line1}</p>
          {shippingAddr.line2 && <p>{shippingAddr.line2}</p>}
          <p>{shippingAddr.city}, {shippingAddr.state}</p>
          <p>{shippingAddr.country} {shippingAddr.zip}</p>
        </div>
      </div>
    </div>
  );
}
