import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gold/10 text-cream mt-auto">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <p className="font-heading text-2xl tracking-[0.3em] mb-5">ARYA&apos;S PLACE</p>
            <p className="text-sm text-cream/40 leading-relaxed max-w-xs tracking-wide">
              Curating the world&apos;s most coveted luxury items for discerning collectors and connoisseurs.
            </p>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.5em] text-gold mb-6 uppercase">Shop</p>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "All Collections" },
                { href: "/categories/watches", label: "Watches" },
                { href: "/categories/jewellery", label: "Jewellery" },
                { href: "/categories/bags", label: "Bags" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs tracking-widest text-cream/40 hover:text-gold transition-colors uppercase">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.5em] text-gold mb-6 uppercase">Account</p>
            <ul className="space-y-3">
              {[
                { href: "/login", label: "Sign In" },
                { href: "/register", label: "Create Account" },
                { href: "/orders", label: "My Orders" },
                { href: "/wishlist", label: "Wishlist" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs tracking-widest text-cream/40 hover:text-gold transition-colors uppercase">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.3em] text-cream/20 uppercase">
            © {new Date().getFullYear()} Arya&apos;s Place. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
              <Link key={item} href="#" className="text-[10px] tracking-[0.3em] text-cream/20 hover:text-gold transition-colors uppercase">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
