import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsContent } from "./ProductsContent";

export const metadata: Metadata = {
  title: "Collection",
  description: "Browse our full collection of luxury pre-order items.",
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
