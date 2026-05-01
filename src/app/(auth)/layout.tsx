import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-noir flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.72_0.12_78_/_0.05)_0%,_transparent_70%)]" />
      <Link
        href="/"
        className="font-heading text-2xl tracking-[0.3em] text-cream mb-10 hover:text-gold transition-colors relative z-10 uppercase"
      >
        Arya&apos;s Place
      </Link>
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}
