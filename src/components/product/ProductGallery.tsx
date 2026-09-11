"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <ImagePlaceholder label={alt} aspect="aspect-[4/5]" />;
  }

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-alt">
        {/* Ürün görselleri admin panelinden yüklenen veri URI'leri — sabit bir host
            olmadığından next/image yerine düz <img> kullanılır. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src.slice(0, 40) + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}. görseli göster`}
              aria-current={active === i}
              className={`h-16 w-16 shrink-0 overflow-hidden border transition-colors duration-300 ease-quiet ${
                active === i ? "border-accent-strong" : "border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
