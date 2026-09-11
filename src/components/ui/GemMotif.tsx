import { useId } from "react";

/**
 * Alvera'nın görsel imzası: taşın üstten görünümünü çağrıştıran, ince
 * çizgili faset (facet) deseni. Tamamen vektörel/kodla üretilir — gerçek
 * bir ürün fotoğrafı yerine geçtiği iddiasında değildir; ImagePlaceholder,
 * Hero arka planı, wordmark yanı ve bölüm ayraçlarında tutarlı bir marka
 * motifi olarak kullanılır (bkz. design-system/MASTER.md §13).
 *
 * `gradient` = stroke'u düz `currentColor` yerine accent→accent-strong altın
 * gradyanıyla çizer (daha zengin, "kuyumcu" hissi veren vurgu noktalarında).
 */
export function GemMotif({
  className = "",
  strokeWidth = 1,
  gradient = false,
}: {
  className?: string;
  strokeWidth?: number;
  gradient?: boolean;
}) {
  const reactId = useId();
  const gradientId = `gem-gradient-${reactId}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={gradient ? `url(#${gradientId})` : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    >
      {gradient && (
        <defs>
          <linearGradient id={gradientId} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--color-accent))" />
            <stop offset="100%" stopColor="rgb(var(--color-accent-strong))" />
          </linearGradient>
        </defs>
      )}
      <polygon points="50,8 79.7,20.3 92,50 79.7,79.7 50,92 20.3,79.7 8,50 20.3,20.3" />
      <polygon points="50,34 61.31,38.69 66,50 61.31,61.31 50,66 38.69,61.31 34,50 38.69,38.69" />
      <path
        d="M50 8 L50 34 M79.7 20.3 L61.31 38.69 M92 50 L66 50 M79.7 79.7 L61.31 61.31
           M50 92 L50 66 M20.3 79.7 L38.69 61.31 M8 50 L34 50 M20.3 20.3 L38.69 38.69"
      />
    </svg>
  );
}
