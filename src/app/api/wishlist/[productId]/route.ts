import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await params;

    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id, productId },
    });

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
