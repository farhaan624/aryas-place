"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@prisma/client";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string | null) => void;
}

export function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  if (variants.length === 0) return null;

  // Group variants by type
  const grouped = variants.reduce((acc, variant) => {
    if (!acc[variant.type]) acc[variant.type] = [];
    acc[variant.type].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([type, options]) => (
        <div key={type}>
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">{type}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onSelect(selectedVariantId === variant.id ? null : variant.id)}
                disabled={variant.stock === 0}
                className={cn(
                  "px-4 py-2 text-sm border rounded-sm transition-colors",
                  selectedVariantId === variant.id
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                  variant.stock === 0 && "opacity-40 cursor-not-allowed line-through"
                )}
              >
                {variant.value}
                {Number(variant.priceAdj) > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    +${Number(variant.priceAdj).toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
