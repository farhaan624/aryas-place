import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ProductVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  return { title: `Admin — Edit ${product?.name ?? "Product"}` };
}

export default async function EditProductPage({ params }: Props) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-wide text-sidebar-foreground">Edit Product</h1>
        <p className="text-sidebar-foreground/60 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm
        productId={productId}
        defaultValues={{
          name: product.name,
          description: product.description,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          images: product.images,
          categoryId: product.categoryId,
          stockLevel: product.stockLevel,
          isAvailable: product.isAvailable,
          isFeatured: product.isFeatured,
          variants: product.variants.map((v: ProductVariant) => ({
            id: v.id,
            type: v.type,
            value: v.value,
            stock: v.stock,
            priceAdj: Number(v.priceAdj),
            sku: v.sku ?? undefined,
          })),
        }}
      />
    </div>
  );
}
