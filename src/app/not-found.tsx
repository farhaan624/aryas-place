import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-gold text-xs tracking-[0.4em] mb-4">404</p>
      <h1 className="font-heading text-5xl md:text-7xl tracking-wide mb-4">Not Found</h1>
      <p className="text-muted-foreground max-w-sm mb-10 leading-relaxed">
        The page you are looking for has either moved or does not exist.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
