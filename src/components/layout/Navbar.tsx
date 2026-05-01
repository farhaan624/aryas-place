"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LEFT_LINKS = [
  { href: "/products", label: "Collection" },
  { href: "/categories/watches", label: "Watches" },
  { href: "/categories/jewellery", label: "Jewellery" },
];

const RIGHT_LINKS = [
  { href: "/categories/bags", label: "Bags" },
  { href: "/categories/accessories", label: "Accessories" },
];

export function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-noir/95 backdrop-blur border-b border-gold/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto px-6 md:px-10 h-16 flex items-center justify-between max-w-[1600px]">

        {/* Left Nav */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {LEFT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.3em] text-cream/50 hover:text-gold transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center Logo */}
        <Link
          href="/"
          className="font-heading text-lg md:text-xl tracking-[0.3em] text-cream hover:text-gold transition-colors uppercase mx-8"
        >
          Arya&apos;s Place
        </Link>

        {/* Right Nav */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {RIGHT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.3em] text-cream/50 hover:text-gold transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}

          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="w-36 h-7 text-xs border-b border-gold/40 bg-transparent outline-none placeholder:text-cream/30 text-cream px-1"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X className="h-3.5 w-3.5 text-cream/40" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-cream/40 hover:text-gold transition-colors">
              <Search className="h-4 w-4" />
            </button>
          )}

          {/* Wishlist */}
          {session && (
            <Link href="/wishlist" className="text-cream/40 hover:text-gold transition-colors">
              <Heart className="h-4 w-4" />
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative text-cream/40 hover:text-gold transition-colors">
            <ShoppingBag className="h-4 w-4" />
            {mounted && totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-noir text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </Link>

          {/* User */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-cream/40 hover:text-gold hover:bg-transparent">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-noir border-gold/20 text-cream">
                <div className="px-2 py-1.5 text-xs text-cream/40">{session.user.email}</div>
                <DropdownMenuSeparator className="bg-gold/10" />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="text-cream/70 hover:text-cream cursor-pointer">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="text-cream/70 hover:text-cream cursor-pointer">My Orders</Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator className="bg-gold/10" />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="text-gold/80 hover:text-gold cursor-pointer">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-gold/10" />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-gold text-noir hover:bg-gold-dark border-0 tracking-[0.2em] text-[10px] h-8 px-5 uppercase"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative text-cream/60 hover:text-gold transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-noir text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </Link>
          <button className="text-cream/60 hover:text-gold" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-noir border-t border-gold/10 overflow-hidden transition-all duration-300",
        mobileOpen ? "max-h-96" : "max-h-0"
      )}>
        <nav className="px-6 py-6 flex flex-col gap-5">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-xs tracking-[0.3em] text-cream/60 hover:text-gold transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gold/10 pt-5 flex gap-4">
            {!session ? (
              <Button asChild size="sm" className="bg-gold text-noir border-0 tracking-widest text-xs uppercase">
                <Link href="/login">Sign In</Link>
              </Button>
            ) : (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs tracking-widest text-cream/40 uppercase"
              >
                Sign Out
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
