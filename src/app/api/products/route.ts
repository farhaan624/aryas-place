import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createProductSchema, productFilterSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsed = productFilterSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid filter parameters" }, { status: 400 });
    }

    const { search, category, minPrice, maxPrice, available, featured, sort, page, limit } = parsed.data;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }

    if (available !== undefined) {
      where.isAvailable = available;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    const orderBy = (() => {
      switch (sort) {
        case "price_asc": return { price: "asc" as const };
        case "price_desc": return { price: "desc" as const };
        case "name_asc": return { name: "asc" as const };
        case "oldest": return { createdAt: "asc" as const };
        default: return { createdAt: "desc" as const };
      }
    })();

    const skip = (page - 1) * limit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          variants: true,
          _count: { select: { wishlistItems: true, orderItems: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { variants, ...productData } = parsed.data;
    const slug = slugify(productData.name);

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        price: productData.price,
        comparePrice: productData.comparePrice ?? null,
        variants: {
          create: variants.map((v) => ({
            type: v.type,
            value: v.value,
            stock: v.stock,
            priceAdj: v.priceAdj,
            sku: v.sku?.trim() || null,
          })),
        },
      },
      include: { category: true, variants: true },
    });

    revalidatePath("/admin/products");
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create product";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "A product with this name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
