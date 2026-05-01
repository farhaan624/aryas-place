import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="bg-muted/30 rounded-sm p-6 space-y-4">
      <h2 className="font-heading text-lg tracking-wide">Order Summary</h2>
      <Separator />
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative w-12 h-14 rounded-sm overflow-hidden bg-muted shrink-0">
              <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="48px" />
              <span className="absolute -top-1 -right-1 bg-muted-foreground text-background text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
              {item.variantLabel && (
                <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
              )}
            </div>
            <span className="text-sm shrink-0">{formatPrice(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
