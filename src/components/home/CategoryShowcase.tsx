"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { GemMotif } from "@/components/ui/GemMotif";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { categories } from "@/config/categories";

/**
 * Kategori bölümü, tekrar eden 7 boş görsel kutusu yerine bir "editoryal
 * indeks" olarak kurulur — dergi içindekiler sayfası mantığı. Gerçek ürün
 * fotoğrafı gelene kadar tipografi kahramandır; masaüstünde imleci takip
 * eden bir önizleme paneli her satırın karşılığını gösterir, mobilde her
 * satırın yanında sabit küçük bir işaret bulunur (hover mobilde yok).
 * Bkz. design-system/MASTER.md §13.4.
 */
export function CategoryShowcase() {
  const [active, setActive] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  const movePanel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    posRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const panel = panelRef.current;
      if (!panel) return;
      const x = Math.min(posRef.current.x + 32, window.innerWidth - 280);
      const y = Math.max(Math.min(posRef.current.y - 170, window.innerHeight - 360), 16);
      panel.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  return (
    <section
      className="section-y"
      onPointerMove={movePanel}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setActive(null);
      }}
    >
      <div className="container-content">
        <RevealOnScroll>
          <Eyebrow>Koleksiyon</Eyebrow>
          <h2 className="max-w-xl font-display text-display-lg">Her parça, zamanın ötesinde bir zarafet taşır.</h2>
        </RevealOnScroll>
      </div>

      <RevealOnScroll className="container-content mt-14 sm:mt-16" delay={80}>
        <ul className="border-t border-border">
          {categories.map((category, index) => (
            <li key={category.slug} className="border-b border-border">
              <Link
                href={`/koleksiyonlar#${category.slug}`}
                data-cursor="Gör"
                className="group flex items-center justify-between gap-5 py-6 transition-colors duration-300 ease-quiet sm:gap-8 sm:py-8"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(index);
                }}
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="tabular shrink-0 text-body-sm text-ink-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-display text-display-md text-ink transition-colors duration-300 ease-quiet group-hover:text-accent-strong group-focus-visible:text-accent-strong sm:text-display-lg">
                    {category.label}
                  </span>
                </span>

                <span className="hidden max-w-[24ch] shrink-0 text-right text-body-sm text-ink-faint md:block">
                  {category.description}
                </span>

                <span
                  aria-hidden="true"
                  className="relative block h-14 w-14 shrink-0 overflow-hidden bg-surface-alt sm:hidden"
                >
                  <GemMotif
                    gradient
                    strokeWidth={0.6}
                    className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 opacity-45"
                  />
                </span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="hidden h-5 w-5 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-[transform,opacity] duration-300 ease-quiet group-hover:translate-x-0 group-hover:text-accent-strong group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:text-accent-strong group-focus-visible:opacity-100 sm:block"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </RevealOnScroll>

      {/* Masaüstü: imleci takip eden yüzen önizleme paneli. */}
      <div
        ref={panelRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden w-64 transition-opacity duration-300 ease-quiet sm:block ${
          active !== null ? "opacity-100" : "opacity-0"
        }`}
      >
        {active !== null && (
          <ImagePlaceholder label={categories[active]!.imageAlt} aspect="aspect-[4/5]" className="shadow-elevated" />
        )}
      </div>
    </section>
  );
}
