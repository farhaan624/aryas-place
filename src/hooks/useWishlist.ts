"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWishlistStore } from "@/store/wishlistStore";
import { useEffect } from "react";
import type { WishlistItemWithProduct } from "@/types";
import { toast } from "sonner";

async function fetchWishlist(): Promise<WishlistItemWithProduct[]> {
  const res = await fetch("/api/wishlist");
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
}

export function useWishlist() {
  const { setWishlist } = useWishlistStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  useEffect(() => {
    if (query.data) {
      setWishlist(query.data.map((item) => item.productId));
    }
  }, [query.data, setWishlist]);

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to add to wishlist");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => toast.error("Failed to add to wishlist"),
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove from wishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => toast.error("Failed to remove from wishlist"),
  });

  return { ...query, addMutation, removeMutation };
}
