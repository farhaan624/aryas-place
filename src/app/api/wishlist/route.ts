import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: "desc" },
      include: {
        product: {
          include: { category: true, variants: true },
        },
      },
    });

    return NextResponse.json(wishlist);
  } catch {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: session.user.id, productId } },
      create: { userId: session.user.id, productId },
      update: {},
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}
