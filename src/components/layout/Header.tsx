"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/config/navigation";
import { contact } from "@/config/contact";
import { brand } from "@/config/brand";
import { GemMotif } from "@/components/ui/GemMotif";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [menuOpen]);

  // Header'da backdrop-blur bulunduğu için (CSS'te backdrop-filter, fixed
  // konumlu alt elemanlar için yeni bir containing block oluşturur), mobil
  // panel viewport'a göre değil header'a göre konumlanmasın diye header'ın
  // DIŞINDA, kardeş bir eleman olarak render edilir.
  const headerHeightClass = scrolled ? "top-16" : "top-20";

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-surface/95 backdrop-blur-[2px] transition-[height] duration-300 ease-quiet ${
          scrolled ? "border-border h-16" : "border-transparent h-20"
        }`}
      >
        <div className="container-content flex h-full items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-ink"
            aria-label={`${brand.name} — anasayfa`}
          >
            <GemMotif strokeWidth={3} className="h-4 w-4 text-accent-strong" />
            <span className="font-sans text-lg font-bold tracking-[0.12em] text-accent-strong">ALVERA</span>
          </Link>

          <nav aria-label="Ana navigasyon" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {primaryNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative inline-block py-1 text-body-sm font-medium transition-colors duration-300 ease-quiet hover:text-accent-strong ${
                        active ? "text-accent-strong" : "text-ink"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-strong transition-transform duration-300 ease-quiet group-hover:scale-x-100 ${
                          active ? "scale-x-100" : ""
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={contact.phoneHref}
            className="hidden text-body-sm font-medium text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong md:inline"
          >
            {contact.phoneDisplay}
          </a>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded md:hidden"
          >
            <span className="sr-only">{menuOpen ? "Menüyü kapat" : "Menüyü aç"}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          className={`fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-surface md:hidden ${headerHeightClass}`}
        >
          <nav aria-label="Mobil navigasyon" className="container-content flex h-full flex-col justify-between py-10">
            <ul className="flex flex-col gap-2">
              {primaryNav.map((item, index) => {
                const active = pathname === item.href;
                return (
                  <li
                    key={item.href}
                    style={{ animation: "menu-item-in 400ms cubic-bezier(0.22,1,0.36,1) both", animationDelay: `${index * 40}ms` }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block py-3 font-display text-display-md font-medium transition-colors duration-300 ease-quiet ${
                        active ? "text-accent-strong" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3 border-t border-border pt-6">
              <a href={contact.phoneHref} className="text-body-md font-medium text-ink">
                {contact.phoneDisplay}
              </a>
              <a
                href={contact.instagramHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-body-sm text-ink-soft underline decoration-border underline-offset-4"
              >
                {contact.instagramHandle}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
