import { create } from "zustand";

interface WishlistState {
  productIds: Set<string>;
  setWishlist: (ids: string[]) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggle: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  productIds: new Set<string>(),

  setWishlist: (ids) => set({ productIds: new Set(ids) }),

  addItem: (productId) =>
    set((state) => ({
      productIds: new Set([...state.productIds, productId]),
    })),

  removeItem: (productId) =>
    set((state) => {
      const next = new Set(state.productIds);
      next.delete(productId);
      return { productIds: next };
    }),

  toggle: (productId) => {
    const { productIds } = get();
    if (productIds.has(productId)) {
      get().removeItem(productId);
    } else {
      get().addItem(productId);
    }
  },

  isInWishlist: (productId) => get().productIds.has(productId),
}));
