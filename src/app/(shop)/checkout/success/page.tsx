"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    fetch(`/api/paystack/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          clearCart();
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [reference, clearCart]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
        <p className="text-muted-foreground">Verifying your payment…</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-destructive" strokeWidth={1} />
        </div>
        <h1 className="font-heading text-3xl tracking-wide mb-4">Payment Failed</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Your payment could not be verified. If you were charged, please contact support.
        </p>
        <Button asChild variant="outline">
          <Link href="/cart">Return to Cart</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-xl text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-gold" strokeWidth={1} />
      </div>
      <h1 className="font-heading text-3xl md:text-4xl tracking-wide mb-4">
        Order Confirmed
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Thank you for your pre-order. You will receive a confirmation email shortly,
        and we will notify you when your order status changes.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/orders">View My Orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
