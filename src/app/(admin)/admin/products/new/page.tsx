import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Admin — New Product" };

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-wide text-sidebar-foreground">New Product</h1>
        <p className="text-sidebar-foreground/60 text-sm mt-1">Add a new item to the catalog</p>
      </div>
      <ProductForm />
    </div>
  );
}
