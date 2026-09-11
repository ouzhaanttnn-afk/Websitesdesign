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
  "inline-flex items-center justify-center gap-2 rounded font-sans text-body-sm font-medium tracking-wide transition-colors duration-300 ease-quiet focus-visible:outline-2 focus-visible:outline-offset-2";

const styles: Record<Variant, Record<Tone, string>> = {
  primary: {
    default: "bg-ink text-canvas px-8 py-4 hover:bg-ink/90 active:bg-ink/85",
    inverted: "bg-canvas text-ink px-8 py-4 hover:bg-canvas/90 active:bg-canvas/85",
  },
  secondary: {
    default: "border border-border text-ink px-8 py-4 hover:bg-surface-alt",
    inverted: "border border-canvas/40 text-canvas px-8 py-4 hover:bg-canvas/10",
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
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  tone = "default",
  className = "",
  href,
  children,
  ...rest
}: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${styles[variant][tone]} ${className}`.trim()} {...rest}>
      {children}
    </Link>
  );
}
