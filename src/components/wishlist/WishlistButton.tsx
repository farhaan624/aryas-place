"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlistStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const queryClient = useQueryClient();
  const inWishlist = isInWishlist(productId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (inWishlist) {
        const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed");
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error("Failed");
      }
    },
    onMutate: () => {
      // Optimistic update
      if (inWishlist) {
        removeItem(productId);
      } else {
        addItem(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    },
    onError: () => {
      // Rollback
      if (inWishlist) {
        addItem(productId);
      } else {
        removeItem(productId);
      }
      toast.error("Failed to update wishlist");
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push("/login");
      return;
    }
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isPending}
      className={cn(
        "p-2 rounded-full transition-colors",
        inWishlist
          ? "text-red-500 hover:text-red-600"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
    </button>
  );
}
