"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { OrderWithItems } from "@/types";

async function fetchAllOrders(): Promise<OrderWithItems[]> {
  const res = await fetch("/api/orders?all=true");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAllOrders,
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-wide text-sidebar-foreground">Orders</h1>
        <p className="text-sidebar-foreground/60 text-sm mt-1">{orders?.length ?? 0} orders total</p>
      </div>

      <div className="bg-sidebar-accent/20 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sidebar-border text-xs tracking-widest text-sidebar-foreground/40">
              <th className="text-left px-4 py-3">ORDER</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">CUSTOMER</th>
              <th className="text-left px-4 py-3">TOTAL</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">DATE</th>
              <th className="text-left px-4 py-3">STATUS</th>
              <th className="text-right px-4 py-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/10">
                <td className="px-4 py-3">
                  <span className="text-xs text-sidebar-foreground/60 font-mono">{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div>
                    <p className="text-sm text-sidebar-foreground">{order.user?.name}</p>
                    <p className="text-xs text-sidebar-foreground/40">{order.user?.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-sidebar-foreground">{formatPrice(Number(order.totalAmount))}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs text-sidebar-foreground/60">{formatDate(order.createdAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <OrderStatusBadge status={order.status} />
                    <OrderStatusBadge status={order.paymentStatus} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/orders/${order.id}`}>Manage</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <div className="text-center py-12 text-sidebar-foreground/40 text-sm">No orders yet.</div>
        )}
      </div>
    </div>
  );
}
