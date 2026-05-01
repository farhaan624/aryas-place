"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: session?.user.name ?? "" },
  });

  const onSubmit = async (_data: ProfileInput) => {
    setIsSaving(true);
    try {
      // In a real implementation, this would call a PATCH /api/user/profile route
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Profile updated");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="font-heading text-2xl tracking-wide">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={session?.user.email ?? ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Type</span>
              <span className="font-medium capitalize">{session?.user.role?.toLowerCase()}</span>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              To change your password, use the{" "}
              <a href="/forgot-password" className="text-gold hover:underline">
                forgot password
              </a>{" "}
              flow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
