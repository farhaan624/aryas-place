import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "Order Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

const ORDER_INDEX: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: -1,
};

export function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm">
        <span className="h-2 w-2 rounded-full bg-destructive" />
        Order Cancelled
      </div>
    );
  }

  const currentIndex = ORDER_INDEX[status] ?? 0;

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const completed = idx < currentIndex;
        const active = idx === currentIndex;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs",
                  completed
                    ? "bg-gold border-gold text-noir"
                    : active
                    ? "border-gold text-gold"
                    : "border-muted text-muted-foreground"
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : <span className="font-medium">{idx + 1}</span>}
              </div>
              <span className={cn("text-[10px] mt-1 tracking-wide hidden md:block", active ? "text-gold" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn("h-0.5 w-10 md:w-20 -mt-5", idx < currentIndex ? "bg-gold" : "bg-muted")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
