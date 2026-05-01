import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: { label: string; href: string };
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center px-4", className)}>
      {icon && <div className="text-muted-foreground mb-6 text-5xl">{icon}</div>}
      <h3 className="font-heading text-xl tracking-wide mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">{description}</p>
      {action && (
        <Button asChild className="mt-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
