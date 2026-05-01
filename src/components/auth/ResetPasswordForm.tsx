"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  if (!token) {
    return (
      <Card className="shadow-lg border-border/50 text-center">
        <CardContent className="pt-10 pb-8 space-y-4">
          <p className="text-muted-foreground">Invalid or missing reset token.</p>
          <Link href="/forgot-password" className="text-accent hover:underline text-sm">
            Request a new reset link
          </Link>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to reset password");
      } else {
        toast.success("Password updated! Please sign in with your new password.");
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-2xl text-center tracking-wide">New Password</CardTitle>
        <CardDescription className="text-center text-sm">
          Choose a strong password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />
          <div className="space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" placeholder="Min. 8 characters" {...register("password")} disabled={isLoading} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Repeat password" {...register("confirmPassword")} disabled={isLoading} />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Updating…" : "Set New Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
