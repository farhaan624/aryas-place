import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users } from "lucide-react";
import type { ProductWithCategory } from "@/types";

async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true, isAvailable: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        variants: true,
        _count: { select: { wishlistItems: true, orderItems: true } },
      },
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      take: 4,
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}

async function getAllProducts(): Promise<ProductWithCategory[]> {
  try {
    return await prisma.product.findMany({
      where: { isAvailable: true },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        variants: true,
        _count: { select: { wishlistItems: true, orderItems: true } },
      },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, categories, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getAllProducts(),
  ]);

  const tickerItems = allProducts.length > 0 ? allProducts : [];

  return (
    <div className="bg-noir text-cream">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600"
            alt="Luxury jewellery"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-7xl">
          <p className="text-gold text-xs tracking-[0.5em] mb-8 uppercase">Exclusive Pre-Order</p>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl leading-none mb-4">
            Every Piece
            <br />
            <em className="text-gold">Has a Story.</em>
          </h1>
          <p className="font-heading text-2xl md:text-4xl text-cream/70 italic mb-10">
            The Next Chapter Is Yours.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-6 mb-14">
            <Button
              asChild
              size="lg"
              className="bg-gold text-noir hover:bg-gold-dark border-0 tracking-[0.3em] text-xs h-14 px-10 uppercase"
            >
              <Link href="/products">Explore Collection</Link>
            </Button>
            <Link
              href="/register"
              className="text-xs tracking-[0.3em] uppercase text-cream/60 hover:text-gold transition-colors self-center"
            >
              Create Account →
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-8 text-cream/50 text-xs tracking-widest">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gold" />
              Secure Checkout
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              Limited Availability
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              Exclusive Members Only
            </span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gold/40" />
          <p className="text-[10px] tracking-[0.4em] text-cream/30 rotate-90 origin-center mt-4">SCROLL</p>
        </div>
      </section>

      {/* Ticker */}
      {tickerItems.length > 0 && (
        <div className="border-y border-gold/20 bg-noir/90 py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((product, i) => (
              <span key={i} className="inline-flex items-center gap-3 mx-8 text-xs tracking-widest">
                <span className="text-gold uppercase font-medium">NEW</span>
                <span className="text-cream/70">{product.name}</span>
                <span className="text-gold/40">—</span>
                <span className="text-cream/40">{product.category.name}</span>
                <span className="text-gold/20 mx-4">|</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-6 md:px-12 max-w-7xl py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.5em] text-gold mb-3 uppercase">Browse By</p>
              <h2 className="font-heading text-4xl md:text-5xl">Category</h2>
            </div>
            <Link href="/products" className="text-xs tracking-[0.3em] text-cream/40 hover:text-gold transition-colors uppercase hidden md:block">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="font-heading text-cream text-xl tracking-widest mb-1">{cat.name}</p>
                  <p className="text-gold/60 text-xs tracking-widest">{cat._count.products} pieces</p>
                </div>
                <div className="absolute top-4 right-4 w-6 h-px bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-24 border-t border-gold/10">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.5em] text-gold mb-3 uppercase">Handpicked</p>
                <h2 className="font-heading text-4xl md:text-5xl">Featured Pieces</h2>
              </div>
              <Link
                href="/products?featured=true"
                className="text-xs tracking-[0.3em] text-cream/40 hover:text-gold transition-colors uppercase hidden md:block"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="border-t border-gold/10 py-32 px-6 text-center">
        <p className="text-xs tracking-[0.5em] text-gold mb-6 uppercase">Limited Availability</p>
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight">
          Reserve Your<br /><em className="text-gold">Piece Today</em>
        </h2>
        <p className="text-cream/40 max-w-md mx-auto mb-12 leading-relaxed text-sm tracking-wide">
          Create an account to access exclusive pre-orders, track your items,
          and receive priority notifications on new arrivals.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-transparent border border-gold text-gold hover:bg-gold hover:text-noir tracking-[0.3em] text-xs h-14 px-12 uppercase transition-all duration-300"
        >
          <Link href="/register">Join Arya&apos;s Place</Link>
        </Button>
      </section>
    </div>
  );
}
