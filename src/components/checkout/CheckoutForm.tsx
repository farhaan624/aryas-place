"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { shippingAddressSchema, type ShippingAddressInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CheckoutFormProps {
  orderId: string;
}

export function CheckoutForm({ orderId }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
  });

  const onSubmit = async (data: ShippingAddressInput) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: data }),
      });

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        toast.error("Failed to initialize payment. Please try again.");
        return;
      }

      const { authorization_url } = await res.json();
      window.location.href = authorization_url;
    } catch {
      toast.error("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <h2 className="font-heading text-xl tracking-wide">Shipping Address</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input placeholder="Your full name" {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Address Line 1</Label>
            <Input placeholder="Street address" {...register("line1")} />
            {errors.line1 && <p className="text-xs text-destructive">{errors.line1.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Address Line 2 (Optional)</Label>
            <Input placeholder="Apartment, suite, etc." {...register("line2")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input placeholder="City" {...register("city")} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input placeholder="State" {...register("state")} />
              {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input placeholder="Nigeria" {...register("country")} />
              {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Postal Code</Label>
              <Input placeholder="Postal code" {...register("zip")} />
              {errors.zip && <p className="text-xs text-destructive">{errors.zip.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Phone (Optional)</Label>
            <Input placeholder="+234 800 000 0000" {...register("phone")} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h2 className="font-heading text-xl tracking-wide">Payment</h2>
        <p className="text-sm text-muted-foreground">
          You will be securely redirected to Paystack to complete your payment.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-sm p-3">
          <span>🔒</span>
          <span>Secured by Paystack — supports cards, bank transfer, and USSD</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 tracking-widest text-sm"
        size="lg"
      >
        {isSubmitting ? "Redirecting to Paystack…" : "PAY WITH PAYSTACK"}
      </Button>
    </form>
  );
}
