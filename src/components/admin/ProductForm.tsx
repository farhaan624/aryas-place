"use client";

import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createProductSchema, type CreateProductInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "./ImageUploader";
import { VariantBuilder } from "./VariantBuilder";

interface ProductFormProps {
  productId?: string;
  defaultValues?: Partial<CreateProductInput>;
}

async function fetchCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export function ProductForm({ productId, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!productId;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateProductInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      images: [],
      variants: [],
      stockLevel: 0,
      isAvailable: true,
      isFeatured: false,
      ...defaultValues,
    },
  });

  const images = watch("images");

  const onSubmit = async (data: CreateProductInput) => {
    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/products/${productId}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let json: { error?: string } = {};
      try {
        json = await res.json();
      } catch {
        toast.error("Server returned an unexpected response");
        return;
      }

      if (!res.ok) {
        toast.error(json.error ?? "Failed to save product");
        return;
      }

      toast.success(isEditing ? "Product updated" : "Product created");
      window.location.assign("/admin/products");
    } catch (err) {
      console.error("Product save error:", err);
      toast.error("Network error — please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<CreateProductInput>) => {
    console.error("Form validation errors:", errors);
    const firstError = Object.values(errors)[0];
    const message = firstError && "message" in firstError ? firstError.message as string : "Please fill in all required fields";
    toast.error(message ?? "Please fill in all required fields");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide text-sidebar-foreground">Basic Information</h2>
        <div className="space-y-1.5">
          <Label>Product Name *</Label>
          <Input {...register("name")} placeholder="e.g. Patek Philippe Nautilus" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Description *</Label>
          <Textarea {...register("description")} rows={5} placeholder="Detailed product description…" />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category">
                      {field.value
                        ? categories.find((c: { id: string; name: string }) => c.id === field.value)?.name ?? "Select category"
                        : "Select category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: { id: string; name: string }) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Stock Level</Label>
            <Input type="number" {...register("stockLevel", { valueAsNumber: true })} min={0} />
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Pricing */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide text-sidebar-foreground">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Price (₦) *</Label>
            <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="0.00" />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Compare-at Price (optional)</Label>
            <Input type="number" step="0.01" {...register("comparePrice", { valueAsNumber: true, setValueAs: (v) => v === "" || isNaN(v) ? null : v })} placeholder="Original price" />
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Images */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide text-sidebar-foreground">Images *</h2>
        <ImageUploader
          images={images}
          onChange={(urls) => setValue("images", urls, { shouldValidate: true })}
        />
        {errors.images && <p className="text-xs text-destructive">{errors.images.message}</p>}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Variants */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide text-sidebar-foreground">Variants</h2>
        <VariantBuilder control={control} />
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Settings */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide text-sidebar-foreground">Settings</h2>
        <div className="flex items-center justify-between">
          <div>
            <Label>Available for Pre-order</Label>
            <p className="text-xs text-muted-foreground">Show this product in the catalog</p>
          </div>
          <Controller
            control={control}
            name="isAvailable"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Featured Product</Label>
            <p className="text-xs text-muted-foreground">Show on homepage featured section</p>
          </div>
          <Controller
            control={control}
            name="isFeatured"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="px-8">
          {isSubmitting ? "Saving…" : isEditing ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
