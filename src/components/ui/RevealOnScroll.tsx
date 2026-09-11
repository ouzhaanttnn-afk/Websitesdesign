"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Kontrollü, tek seferlik scroll-reveal: hafif fade + translate.
 * prefers-reduced-motion tercihinde globals.css tüm transition sürelerini
 * sıfıra indirdiği için burada ekstra bir dal gerekmez.
 */
export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Sunucuda ve IntersectionObserver desteklenmiyorsa içerik her zaman
  // görünür başlar; animasyon yalnızca istemcide, destekleniyorsa devreye
  // girer. Böylece JS geç yüklenirse/çalışmazsa içerik asla kalıcı olarak
  // gizli kalmaz (bkz. tam sayfa ekran görüntüsü testinde görülen sorun).
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;

    const reveal = () => setVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    // Güvenlik ağı: gözlemci herhangi bir sebeple tetiklenmezse (ör. sekme
    // arka planda, otomatik ekran görüntüsü araçları) içerik yine de görünür
    // hale gelir.
    const fallback = window.setTimeout(reveal, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-quiet ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
