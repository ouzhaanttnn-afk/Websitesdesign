import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
/**
 * `default` = ivory/canvas zemin üzerinde kullanım (standart).
 * `inverted` = koyu (`ink`) veya görsel zemin üzerinde kullanım (ör. Hero, ContactCta).
 *
 * Renkler variant+tone kombinasyonuyla sabit olarak tanımlanır; çağıran
 * bileşenler `className` üzerinden bg/text/border rengini ezmeye
 * çalışmamalıdır — Tailwind'de aynı özelliği hedefleyen iki utility class
 * birlikte verildiğinde hangisinin kazanacağı class string sırasına değil,
 * üretilen CSS'in iç sırasına bağlıdır ve öngörülemezdir.
 */
type Tone = "default" | "inverted";

const base =
  "inline-flex items-center justify-center gap-2 rounded font-sans text-body-sm font-medium tracking-wide transition duration-300 ease-quiet focus-visible:outline-2 focus-visible:outline-offset-2";

const styles: Record<Variant, Record<Tone, string>> = {
  primary: {
    default:
      "bg-ink text-canvas px-8 py-4 shadow-soft hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-elevated active:translate-y-0 active:bg-ink/85",
    inverted:
      "bg-canvas text-ink px-8 py-4 shadow-soft hover:-translate-y-0.5 hover:bg-canvas/90 hover:shadow-elevated active:translate-y-0 active:bg-canvas/85",
  },
  secondary: {
    default:
      "border border-border text-ink px-8 py-4 hover:-translate-y-0.5 hover:border-ink/30 hover:bg-surface-alt active:translate-y-0",
    inverted:
      "border border-canvas/40 text-canvas px-8 py-4 hover:-translate-y-0.5 hover:border-canvas/70 hover:bg-canvas/10 active:translate-y-0",
  },
  ghost: {
    default:
      "text-ink underline underline-offset-4 decoration-border hover:text-accent-strong hover:decoration-accent-strong px-0 py-1",
    inverted:
      "text-canvas underline underline-offset-4 decoration-canvas/40 hover:text-accent hover:decoration-accent px-0 py-1",
  },
};

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  tone?: Tone;
  /** İnce bir ok ikonu ekler; hover'da hafifçe sağa kayar. Yalnızca birincil CTA'larda kullanılır. */
  icon?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  tone = "default",
  icon = false,
  className = "",
  href,
  children,
  ...rest
}: ButtonProps) {
  return (
    <Link href={href} className={`group ${base} ${styles[variant][tone]} ${className}`.trim()} {...rest}>
      {children}
      {icon && (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-quiet group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Link>
  );
}
