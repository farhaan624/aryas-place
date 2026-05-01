"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateProductInput } from "@/lib/validations";

interface VariantBuilderProps {
  control: Control<CreateProductInput>;
}

export function VariantBuilder({ control }: VariantBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Product Variants</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ type: "", value: "", stock: 0, priceAdj: 0, sku: "" })}
          className="gap-1.5"
        >
          <Plus className="h-3 w-3" />
          Add Variant
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">No variants added. Add variants for size, color, or material options.</p>
      )}

      {fields.map((field, idx) => (
        <div key={field.id} className="grid grid-cols-5 gap-2 items-end p-3 bg-muted/30 rounded-sm">
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
            <Input
              {...control.register(`variants.${idx}.type`)}
              placeholder="e.g. Size"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Value</Label>
            <Input
              {...control.register(`variants.${idx}.value`)}
              placeholder="e.g. Large"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Stock</Label>
            <Input
              type="number"
              {...control.register(`variants.${idx}.stock`, { valueAsNumber: true })}
              className="h-8 text-xs"
              min={0}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Price Adj.</Label>
            <Input
              type="number"
              {...control.register(`variants.${idx}.priceAdj`, { valueAsNumber: true })}
              placeholder="0"
              className="h-8 text-xs"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => remove(idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
