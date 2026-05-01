import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateProductSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: productId }, { slug: productId }],
      },
      include: {
        category: true,
        variants: true,
        _count: { select: { wishlistItems: true, orderItems: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { productId } = await params;
    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { variants, name, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updateData,
        ...(variants !== undefined && {
          variants: {
            deleteMany: {},
            create: variants.map((v) => ({
              type: v.type,
              value: v.value,
              stock: v.stock ?? 0,
              priceAdj: v.priceAdj ?? 0,
              sku: v.sku?.trim() || null,
            })),
          },
        }),
      },
      include: { category: true, variants: true },
    });

    revalidatePath("/admin/products");
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { productId } = await params;

    await prisma.product.update({
      where: { id: productId },
      data: { isAvailable: false },
    });

    revalidatePath("/admin/products");
    return NextResponse.json({ message: "Product removed from catalog" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
