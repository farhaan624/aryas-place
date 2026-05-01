import { z } from "zod";

// ─── Auth ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ─── Product ─────────────────────────────────────────────────────────────────

export const productVariantSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "Variant type is required"),
  value: z.string().min(1, "Variant value is required"),
  stock: z.number().int().min(0).default(0),
  priceAdj: z.number().default(0),
  sku: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional().nullable(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  categoryId: z.string().min(1, "Category is required"),
  stockLevel: z.number().int().min(0).default(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  variants: z.array(productVariantSchema).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  available: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc", "name_asc"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

// ─── Category ────────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// ─── Order ───────────────────────────────────────────────────────────────────

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  country: z.string().min(2, "Country is required"),
  zip: z.string().min(3, "Postal code is required"),
  phone: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional().nullable(),
    quantity: z.number().int().positive(),
  })).min(1, "Order must have at least one item"),
  shippingAddress: shippingAddressSchema,
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED"]).optional(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
