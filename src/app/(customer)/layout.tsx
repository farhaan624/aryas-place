import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { User, ShoppingBag } from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/account", label: "Account Settings", icon: User },
  { href: "/orders", label: "My Orders", icon: ShoppingBag },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-28 pb-16">
        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-48 shrink-0">
            <p className="text-[10px] tracking-[0.5em] text-gold mb-6 uppercase">My Account</p>
            <nav className="space-y-1">
              {SIDEBAR_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-gold hover:bg-gold/5 transition-colors rounded-sm"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}
