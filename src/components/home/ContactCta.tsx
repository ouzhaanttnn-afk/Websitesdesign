import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { contact } from "@/config/contact";
import { brand } from "@/config/brand";

export function ContactCta() {
  return (
    <section className="section-y bg-ink text-canvas">
      <div className="container-content flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <RevealOnScroll>
          <Eyebrow tone="inverted">Ziyaret Edin</Eyebrow>
          <h2 className="max-w-lg font-display text-display-lg text-canvas">
            {brand.locationLabel}&apos;da sizi ağırlamaktan mutluluk duyarız.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={100} className="flex flex-col gap-4 sm:flex-row">
          <Button href={contact.whatsappHref} variant="primary" tone="inverted" icon>
            WhatsApp&apos;tan Yazın
          </Button>
          <Button href="/iletisim" variant="secondary" tone="inverted">
            İletişim Bilgileri
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
