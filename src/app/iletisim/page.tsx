import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/contact/ContactForm";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";

const mapsQuery = encodeURIComponent(`${brand.name}, ${brand.addressLine}`);

export const metadata: Metadata = {
  title: "İletişim",
  description: "Alvera Kuyumculuk ile iletişime geçin — telefon, WhatsApp ve Instagram.",
};

export default function ContactPage() {
  return (
    <section className="section-y">
      <div className="container-content">
        <Eyebrow>İletişim</Eyebrow>
        <h1 className="max-w-2xl font-display text-display-xl">Bize Ulaşın</h1>
        <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
          Sorularınız için formu doldurabilir veya doğrudan telefon ve WhatsApp
          üzerinden bize ulaşabilirsiniz.
        </p>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="flex flex-col gap-12">
            <dl className="flex flex-col gap-8">
              <div>
                <dt className="eyebrow mb-2">Telefon</dt>
                <dd>
                  <a
                    href={contact.phoneHref}
                    className="text-body-lg text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
                  >
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">WhatsApp</dt>
                <dd>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-body-lg text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
                  >
                    {contact.whatsappDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Instagram</dt>
                <dd>
                  <a
                    href={contact.instagramHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-body-lg text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
                  >
                    {contact.instagramHandle}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Adres</dt>
                <dd className="text-body-lg text-ink-soft">
                  {brand.locationLabel}
                  <br />
                  <span className="text-body-sm text-ink-faint">{brand.addressLine}</span>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Çalışma Saatleri</dt>
                <dd className="text-body-lg text-ink-soft">{brand.workingHours}</dd>
              </div>
            </dl>

            <div>
              <div className="aspect-[4/3] w-full overflow-hidden border border-border grayscale-[15%]">
                <iframe
                  title="Alvera Kuyumculuk konumu"
                  src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-body-sm font-medium text-ink underline decoration-border underline-offset-4 transition-colors duration-300 ease-quiet hover:text-accent-strong hover:decoration-accent-strong"
              >
                Google Haritalar&apos;da yol tarifi alın
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-8 sm:p-10">
            <h2 className="font-display text-display-md">Mesaj Gönderin</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
