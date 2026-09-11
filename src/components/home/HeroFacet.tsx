"use client";

import { useEffect, useRef } from "react";
import { GemMotif } from "@/components/ui/GemMotif";

/**
 * Hero'daki büyük faset motifi, imleç hareketine göre çok hafif bir "ışığı
 * yakalama" hissi vermesi için ince bir manyetik kaydırma uygular. Yalnızca
 * ince işaretçili (fare) cihazlarda ve `prefers-reduced-motion` kapalıyken
 * çalışır; dokunmatikte veya azaltılmış hareket tercihinde motif sabit kalır.
 *
 * Değerler UI/UX Pro Max skill'in "Hover Micro-interaction / Complex" veri
 * setinden doğrulandı: manyetik çekim gücü clamp'lenir (elemanın kendi
 * kutusundan asla tam çıkmaz) ve sayfa başına yalnızca 1-2 odak elemanında
 * kullanılması önerilir — burada tek kullanım bu.
 */
export function HeroFacet() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const gem = gemRef.current;
    if (!wrap || !gem) return;

    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const py = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      const x = Math.max(-1, Math.min(1, px)) * 14;
      const y = Math.max(-1, Math.min(1, py)) * 14;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        gem.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${x * 0.4}deg)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      gem.style.transform = "translate(-50%, -50%)";
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="absolute inset-0">
      <span
        className="absolute left-1/2 top-[38%] h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/14 opacity-90 blur-2xl"
      />
      <div
        ref={gemRef}
        className="absolute left-1/2 top-1/2 h-2/5 w-2/5 max-h-80 max-w-80 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-quiet"
      >
        <GemMotif gradient strokeWidth={0.5} className="h-full w-full opacity-70" />
      </div>
    </div>
  );
}
