"use client";

import { useEffect, useRef } from "react";

/**
 * Native imleci hiç değiştirmez/gizlemez (erişilebilirlik/güvenlik ağı için
 * — JS geç yüklenirse veya hata verirse kullanıcı imleçsiz kalmaz); sadece
 * yanında yumuşak, gecikmeli bir "eskort" halkası çizer. `[data-cursor]`
 * işaretli bir eleman üzerine gelindiğinde halka genişler ve elemanın
 * `data-cursor` değerini (ör. "GÖR", "KEŞFET") küçük bir etiket olarak
 * gösterir — kuyumcu büyütecine/dürbününe gönderme yapan sessiz bir imza.
 *
 * Yalnızca ince işaretçili (fare) cihazlarda ve `prefers-reduced-motion`
 * kapalıyken çalışır — bkz. HeroFacet.tsx'teki aynı desen.
 */
export function SignatureCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame = 0;
    let active = false;

    const render = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      tx = event.clientX;
      ty = event.clientY;
      ring.dataset.visible = "true";
      const target = (event.target as HTMLElement | null)?.closest("[data-cursor]") as HTMLElement | null;
      const next = !!target;
      if (next !== active) {
        active = next;
        ring.dataset.active = String(active);
        label.textContent = target?.dataset.cursor ?? "";
      }
    };

    const onLeave = () => {
      ring.dataset.visible = "false";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      data-visible="false"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-10 w-10 items-center justify-center rounded-full border border-canvas opacity-0 mix-blend-difference transition-[width,height,opacity,background-color,border-color] duration-300 ease-quiet data-[visible=true]:opacity-100 data-[active=true]:h-[4.5rem] data-[active=true]:w-[4.5rem] data-[active=true]:border-transparent data-[active=true]:bg-canvas data-[active=true]:mix-blend-normal md:flex"
    >
      <span
        ref={labelRef}
        className="text-[10px] font-medium uppercase tracking-widest text-ink opacity-0 transition-opacity duration-200 [[data-active=true]_&]:opacity-100"
      />
    </div>
  );
}
