"use client";

import { useEffect, useRef, useState } from "react";
import type { Category } from "@/config/categories";

/**
 * Kategori bölümleri arasında gezinme için yapışkan (sticky), aktif
 * bölümü vurgulayan bir "editoryal indeks" şeridi — uzun, tek sayfalık
 * kataloglarda sıkça görülen ama burada kodla/`IntersectionObserver`
 * ile üretilen özgün bir gezinme deseni (harici animasyon kütüphanesi
 * eklemeden). Header'ın altına yapışır (`top-16`, header'ın scroll'da
 * küçülmüş yüksekliğiyle eşleşir — bkz. Header.tsx).
 */
export function CategoryIndexNav({ categories }: { categories: Category[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const list = listRef.current;
    const activeLink = list?.querySelector<HTMLElement>(`[data-slug="${activeSlug}"]`);
    activeLink?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeSlug]);

  return (
    <nav
      aria-label="Koleksiyon kısayolları"
      className="sticky top-16 z-30 w-full border-y border-border bg-canvas/95 py-3 backdrop-blur-[2px]"
    >
      <ul
        ref={listRef}
        className="container-content flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <li key={category.slug} data-slug={category.slug} className="shrink-0">
              <a
                href={`#${category.slug}`}
                aria-current={active ? "true" : undefined}
                className={`relative inline-block whitespace-nowrap py-1 text-body-sm font-medium transition-colors duration-300 ease-quiet ${
                  active ? "text-accent-strong" : "text-ink-faint hover:text-ink"
                }`}
              >
                {category.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent-strong transition-transform duration-300 ease-quiet ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
