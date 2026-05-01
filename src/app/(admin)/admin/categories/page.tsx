"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

async function fetchCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
      setOpen(false);
      reset();
    },
    onError: () => toast.error("Failed to create category"),
  });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl tracking-wide text-sidebar-foreground">Categories</h1>
          <p className="text-sidebar-foreground/60 text-sm mt-1">{categories?.length ?? 0} categories</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input {...register("name")} placeholder="e.g. Watches" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Description (optional)</Label>
                <Input {...register("description")} placeholder="Short description" />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Creating…" : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((cat: { id: string; name: string; description?: string; _count: { products: number } }) => (
          <div key={cat.id} className="bg-sidebar-accent/20 border border-sidebar-border rounded-sm p-4">
            <p className="font-heading text-lg text-sidebar-foreground tracking-wide">{cat.name}</p>
            {cat.description && <p className="text-xs text-sidebar-foreground/50 mt-1">{cat.description}</p>}
            <p className="text-xs text-gold mt-2">{cat._count.products} products</p>
          </div>
        ))}
      </div>
    </div>
  );
}
