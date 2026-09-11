"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { brand } from "@/config/brand";

const NAV_ITEMS = [
  { href: "/admin", label: "Ana", icon: "M4 12l8-8 8 8M6 10v10h12V10" },
  { href: "/admin/urunler", label: "Ürünler", icon: "M4 7h16M4 12h16M4 17h10" },
  { href: "/admin/talepler", label: "Talepler", icon: "M4 5h16v10H8l-4 4V5z" },
  { href: "/admin/piyasa", label: "Piyasa", icon: "M4 18l5-6 4 4 7-9" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/brand/alvera-logo.png" alt={brand.name} width={2603} height={856} className="h-6 w-auto" />
          <span className="text-body-sm font-medium text-ink-faint">Yönetim</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="text-body-sm font-medium text-ink-soft underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong"
        >
          Çıkış
        </button>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav
        aria-label="Yönetim navigasyonu"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="flex">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 py-2.5 text-eyebrow ${
                    active ? "text-accent-strong" : "text-ink-faint"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
