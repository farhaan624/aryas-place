import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      revenueData,
      totalOrders,
      ordersByStatus,
      topProductsRaw,
      recentOrders,
    ] = await prisma.$transaction([
      // Total revenue from paid orders
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { totalAmount: true },
      }),

      // Total order count
      prisma.order.count(),

      // Orders grouped by status
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        orderBy: { status: "asc" },
      }),

      // Top 5 products by order item count
      prisma.orderItem.groupBy({
        by: ["productId"],
        _count: { _all: true },
        _sum: { unitPrice: true },
        orderBy: { _count: { productId: "desc" } },
        take: 5,
      }),

      // Recent 5 orders
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true, variant: true } },
        },
      }),
    ]);

    // Fetch product details for top products
    const productIds = topProductsRaw.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, slug: true, images: true },
    });

    const topProducts = topProductsRaw.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: product?.name ?? "Unknown",
        slug: product?.slug ?? "",
        images: product?.images ?? [],
        orderCount: (item._count as { _all: number })._all,
        revenue: Number((item._sum as { unitPrice?: { toNumber?: () => number } | null } | undefined)?.unitPrice ?? 0),
      };
    });

    const ordersByStatusMap = ordersByStatus.reduce(
      (acc, item) => ({ ...acc, [item.status]: (item._count as { _all: number })._all }),
      {} as Record<string, number>
    );

    return NextResponse.json({
      totalRevenue: Number(revenueData._sum.totalAmount ?? 0),
      totalOrders,
      ordersByStatus: ordersByStatusMap,
      topProducts,
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
