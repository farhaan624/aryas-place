"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-destructive text-xs tracking-[0.4em] mb-4">ERROR</p>
      <h1 className="font-heading text-4xl tracking-wide mb-4">Something went wrong</h1>
      <p className="text-muted-foreground max-w-sm mb-10 leading-relaxed">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    </div>
  );
}
