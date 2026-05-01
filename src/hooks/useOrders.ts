"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderWithItems } from "@/types";

async function fetchOrders(): Promise<OrderWithItems[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

async function fetchOrder(orderId: string): Promise<OrderWithItems> {
  const res = await fetch(`/api/orders/${orderId}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  });
}
