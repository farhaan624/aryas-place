import type { User, Product, Category, Order, OrderItem, ProductVariant, WishlistItem } from "@prisma/client";

// ─── Extended types ──────────────────────────────────────────────────────────

export type ProductWithCategory = Product & {
  category: Category;
  variants: ProductVariant[];
  _count?: { wishlistItems: number; orderItems: number };
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
    variant: ProductVariant | null;
  })[];
  user?: Pick<User, "id" | "name" | "email">;
};

export type WishlistItemWithProduct = WishlistItem & {
  product: ProductWithCategory;
};

// ─── Cart types ──────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
  productName: string;
  productSlug: string;
  imageUrl: string;
  variantLabel?: string;
}

// ─── NextAuth type augmentation ──────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// ─── API response types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  topProducts: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    orderCount: number;
    revenue: number;
  }[];
  recentOrders: OrderWithItems[];
}
