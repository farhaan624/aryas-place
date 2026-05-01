"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong");
      } else {
        setSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <Card className="shadow-lg border-border/50 text-center">
        <CardContent className="pt-10 pb-8 space-y-4">
          <div className="text-4xl">✉️</div>
          <h2 className="font-heading text-xl tracking-wide">Check Your Email</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If an account exists with that address, we&apos;ve sent a password reset
            link. Please check your inbox and spam folder.
          </p>
          <Link href="/login" className="text-sm text-accent hover:underline">
            Return to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-2xl text-center tracking-wide">Reset Password</CardTitle>
        <CardDescription className="text-center text-sm">
          Enter your email address and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} disabled={isLoading} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href="/login" className="text-foreground hover:text-accent font-medium transition-colors">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
