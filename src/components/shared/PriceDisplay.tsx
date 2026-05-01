import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number | string;
  comparePrice?: number | string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function PriceDisplay({ price, comparePrice, className, size = "md" }: PriceDisplayProps) {
  const hasDiscount = comparePrice && Number(comparePrice) > Number(price);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-medium text-foreground", sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className={cn("text-muted-foreground line-through", size === "xl" ? "text-base" : "text-sm")}>
          {formatPrice(comparePrice!)}
        </span>
      )}
    </div>
  );
}
