"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import type { AnalyticsData } from "@/types";
import Link from "next/link";
import Image from "next/image";

async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch("/api/admin/analytics");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export function AnalyticsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAnalytics,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(data?.totalRevenue ?? 0),
      icon: TrendingUp,
      sub: "From paid orders",
    },
    {
      title: "Total Orders",
      value: String(data?.totalOrders ?? 0),
      icon: ShoppingCart,
      sub: `${data?.ordersByStatus?.PENDING ?? 0} pending`,
    },
    {
      title: "Confirmed",
      value: String(data?.ordersByStatus?.CONFIRMED ?? 0),
      icon: Package,
      sub: `${data?.ordersByStatus?.SHIPPED ?? 0} shipped`,
    },
    {
      title: "Delivered",
      value: String(data?.ordersByStatus?.DELIVERED ?? 0),
      icon: Users,
      sub: `${data?.ordersByStatus?.CANCELLED ?? 0} cancelled`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading tracking-wide">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Products */}
      {data?.topProducts && data.topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4">{idx + 1}</span>
                  <div className="relative w-10 h-12 rounded-sm overflow-hidden bg-muted shrink-0">
                    {product.images[0] && (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-sm font-medium hover:text-gold transition-colors line-clamp-1">
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.orderCount} orders</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatPrice(product.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
