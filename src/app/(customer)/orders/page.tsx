"use client";

import { useOrders } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl tracking-wide mb-6">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place a pre-order, it will appear here."
          icon="📦"
          action={{ label: "Browse Collection", href: "/products" }}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border border-border rounded-sm p-4 hover:border-gold/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs tracking-widest text-muted-foreground">
                    ORDER {order.orderNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  <p className="font-medium">{formatPrice(Number(order.totalAmount))}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1.5">
                    <OrderStatusBadge status={order.status} />
                    <OrderStatusBadge status={order.paymentStatus} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {order.items.length} {order.items.length === 1 ? "item" : "items"} —{" "}
                {order.items.map((i) => i.product.name).join(", ")}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
