"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import type { OrderWithItems } from "@/types";
import type { ShippingAddressInput } from "@/lib/validations";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

async function fetchOrder(orderId: string): Promise<OrderWithItems> {
  const res = await fetch(`/api/orders/${orderId}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const mutation = useMutation({
    mutationFn: async (update: { status?: string; paymentStatus?: string }) => {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated");
    },
    onError: () => toast.error("Failed to update order"),
  });

  if (isLoading || !order) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  const shippingAddr = order.shippingAddress as ShippingAddressInput;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl tracking-wide text-sidebar-foreground">{order.orderNumber}</h1>
          <p className="text-sidebar-foreground/40 text-sm">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Control */}
        <Card className="bg-sidebar-accent/20 border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-sm text-sidebar-foreground">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <Select
                defaultValue={order.status != null ? String(order.status) : undefined}
                onValueChange={(v) => v && mutation.mutate({ status: String(v) })}
              >
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.paymentStatus} />
              {order.paymentStatus === "UNPAID" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => mutation.mutate({ paymentStatus: "PAID" })}
                  disabled={mutation.isPending}
                >
                  Mark as Paid
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card className="bg-sidebar-accent/20 border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-sm text-sidebar-foreground">Customer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-sidebar-foreground/60 space-y-1">
            <p className="text-sidebar-foreground font-medium">{order.user?.name}</p>
            <p>{order.user?.email}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="bg-sidebar-accent/20 border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-sm text-sidebar-foreground">Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative w-12 h-14 rounded-sm overflow-hidden bg-muted shrink-0">
                <Image
                  src={item.product.images[0] ?? "/images/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-sidebar-foreground font-medium">{item.product.name}</p>
                {item.variant && (
                  <p className="text-xs text-sidebar-foreground/40">
                    {item.variant.type}: {item.variant.value}
                  </p>
                )}
                <p className="text-xs text-sidebar-foreground/40">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm text-sidebar-foreground">{formatPrice(Number(item.unitPrice) * item.quantity)}</p>
            </div>
          ))}
          <Separator className="bg-sidebar-border" />
          <div className="flex justify-between text-sidebar-foreground font-medium">
            <span>Total</span>
            <span>{formatPrice(Number(order.totalAmount))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card className="bg-sidebar-accent/20 border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-sm text-sidebar-foreground">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-sidebar-foreground/60 space-y-1">
          <p className="text-sidebar-foreground">{shippingAddr.fullName}</p>
          <p>{shippingAddr.line1}</p>
          {shippingAddr.line2 && <p>{shippingAddr.line2}</p>}
          <p>{shippingAddr.city}, {shippingAddr.state}</p>
          <p>{shippingAddr.country} {shippingAddr.zip}</p>
        </CardContent>
      </Card>
    </div>
  );
}
