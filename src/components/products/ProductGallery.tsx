"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ["/images/placeholder.png"];

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex flex-col gap-2 w-16 shrink-0">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border-2 transition-colors",
                i === activeIndex ? "border-gold" : "border-transparent hover:border-muted"
              )}
            >
              <Image src={img} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-[3/4] overflow-hidden rounded-sm bg-muted">
        <Image
          src={safeImages[activeIndex]}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
