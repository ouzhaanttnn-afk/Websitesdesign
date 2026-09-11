import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SkipLink } from "@/components/layout/SkipLink";
import { StructuredData } from "@/components/StructuredData";
import { brand } from "@/config/brand";
import { siteUrl } from "@/lib/site-url";

// UI/UX Pro Max skill — "Luxury Serif" font pairing, verified specifically
// for jewelry/luxury e-commerce (bkz. design-system/MASTER.md §4).
const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <StructuredData />
        <SkipLink />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
