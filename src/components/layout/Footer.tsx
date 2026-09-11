import Link from "next/link";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { primaryNav } from "@/config/navigation";
import { GemMotif } from "@/components/ui/GemMotif";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-content grid gap-12 py-16 sm:py-20 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2.5 font-display text-lg font-medium tracking-[0.08em] text-ink">
            <GemMotif strokeWidth={3} className="h-4 w-4 text-accent-strong" />
            ALVERA
          </p>
          <p className="mt-3 max-w-[32ch] text-body-sm text-ink-soft">{brand.tagline}</p>
          <p className="mt-1 text-body-sm text-ink-faint">{brand.locationLabel}</p>
        </div>

        <nav aria-label="Alt navigasyon">
          <p className="eyebrow mb-4">Sayfalar</p>
          <ul className="flex flex-col gap-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-body-sm text-ink-soft transition-colors duration-300 ease-quiet hover:text-accent-strong"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-4">İletişim</p>
          <ul className="flex flex-col gap-2 text-body-sm text-ink-soft">
            <li>
              <a href={contact.phoneHref} className="transition-colors duration-300 ease-quiet hover:text-accent-strong">
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={contact.instagramHref}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors duration-300 ease-quiet hover:text-accent-strong"
              >
                {contact.instagramHandle}
              </a>
            </li>
            <li className="text-ink-faint">{brand.addressLine}</li>
            <li className="text-ink-faint">{brand.workingHours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-content flex flex-col gap-2 py-6 text-body-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
