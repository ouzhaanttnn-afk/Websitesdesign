import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { siteUrl } from "@/lib/site-url";

/**
 * schema.org JewelryStore yapılandırılmış verisi — Google'ın arama
 * sonuçlarında ve Google Haritalar'da işletmeyi doğru tanıması için.
 * Yalnızca kartvizitten doğrulanmış alanlar (isim, adres, telefon,
 * Instagram) dahil edildi; çalışma saatleri gibi doğrulanmamış bilgiler
 * (openingHoursSpecification) kasıtlı olarak eklenmedi.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: brand.name,
    description: brand.description,
    url: siteUrl,
    telephone: contact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      ...brand.address,
    },
    sameAs: [contact.instagramHref],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
