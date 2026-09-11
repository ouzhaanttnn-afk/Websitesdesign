"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";
import { PageViewTracker } from "./PageViewTracker";
import { SignatureCursor } from "@/components/ui/SignatureCursor";

/**
 * Admin paneli (`/admin/*`) mağaza vitrini değil, ayrı ve sade bir iç araç —
 * markanın Header/Footer/WhatsApp FAB'ını taşımaz (kendi sade chrome'unu
 * `src/app/admin/layout.tsx` sağlar). Tek bir root layout korunarak (bkz.
 * `layout.tsx`), bu istemci bileşeni pathname'e göre hangi chrome'un
 * render edileceğine karar verir — böylece iki ayrı root layout'a
 * bölünüp mevcut, çalışan sayfa yapısını riske atmaya gerek kalmaz.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <PageViewTracker />
      <SignatureCursor />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
