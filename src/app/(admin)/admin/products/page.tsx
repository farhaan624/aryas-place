import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import { DeleteProductButton } from "./DeleteProductButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl tracking-wide text-sidebar-foreground">Products</h1>
          <p className="text-sidebar-foreground/60 text-sm mt-1">{products.length} products total</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-sidebar-accent/20 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sidebar-border text-xs tracking-widest text-sidebar-foreground/40">
              <th className="text-left px-4 py-3">PRODUCT</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">CATEGORY</th>
              <th className="text-left px-4 py-3">PRICE</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">STOCK</th>
              <th className="text-left px-4 py-3">STATUS</th>
              <th className="text-right px-4 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-12 rounded-sm overflow-hidden bg-muted shrink-0">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                      )}
                    </div>
                    <span className="text-sm text-sidebar-foreground font-medium line-clamp-1">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-sidebar-foreground/60">{product.category.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-sidebar-foreground">{formatPrice(Number(product.price))}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-sidebar-foreground/60">{product.stockLevel}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.isAvailable ? "default" : "secondary"} className="text-[10px]">
                    {product.isAvailable ? "Active" : "Hidden"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-sidebar-foreground/40 text-sm">
            No products yet. Add your first product.
          </div>
        )}
      </div>
    </div>
  );
}
