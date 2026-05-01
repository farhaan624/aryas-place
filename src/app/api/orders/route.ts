import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const showAll = req.nextUrl.searchParams.get("all") === "true";

    const where = isAdmin && showAll ? {} : { userId: session.user.id };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { items, shippingAddress, notes } = parsed.data;

    // Fetch products and validate stock
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isAvailable: true },
      include: { variants: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
    }

    // Build order items with price snapshots
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const variant = item.variantId
        ? product.variants.find((v) => v.id === item.variantId)
        : null;

      const unitPrice =
        Number(product.price) + (variant ? Number(variant.priceAdj) : 0);
      totalAmount += unitPrice * item.quantity;

      return {
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        unitPrice,
      };
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        totalAmount,
        shippingAddress,
        notes: notes ?? null,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true, variant: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
