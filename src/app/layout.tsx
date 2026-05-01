import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";

export const metadata: Metadata = {
  title: {
    default: "Arya's Place — Luxury Pre-Order",
    template: "%s | Arya's Place",
  },
  description:
    "Discover and pre-order the world's most coveted luxury items. Exclusive access to limited editions and bespoke collections.",
  keywords: ["luxury", "preorder", "fashion", "exclusive", "bespoke"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
