import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-800 border-blue-200" },
  SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-800 border-purple-200" },
  DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  UNPAID: { label: "Unpaid", className: "bg-orange-100 text-orange-800 border-orange-200" },
  PAID: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  REFUNDED: { label: "Refunded", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
