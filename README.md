# Alvera Kuyumculuk — Website

Alvera Kuyumculuk (Mamak / Ankara) için "quiet luxury" tasarım diliyle
hazırlanmış kurumsal web sitesi. Next.js App Router + TypeScript + Tailwind
CSS ile geliştirildi.

## Tasarım Sistemi

Sitenin tüm tasarım kararları (renk, tipografi, spacing, bileşen kuralları,
motion, erişilebilirlik) tek bir kaynakta toplanır:

- **[`design-system/MASTER.md`](./design-system/MASTER.md)**

Yeni bir sayfa veya bileşen eklerken önce bu dokümana bakın.

## Başlarken

```bash
npm install
npm run dev
```

Site [http://localhost:3000](http://localhost:3000) adresinde açılır.

### Diğer komutlar

```bash
npm run build      # production build
npm run start       # production build'i çalıştırır
npm run lint         # ESLint
npm run typecheck  # TypeScript tip kontrolü (tsc --noEmit)
```

## Proje Yapısı

```
design-system/MASTER.md   Tek doğruluk kaynağı: tasarım sistemi
src/app/                  Next.js App Router sayfaları
  page.tsx                 Ana Sayfa (/)
  koleksiyonlar/            Koleksiyonlar
  fiyatlar/                  Fiyatlar (güncel altın/döviz)
  hakkimizda/               Hakkımızda
  iletisim/                   İletişim
src/components/
  layout/                    Header, Footer, SkipLink
  ui/                          Button, Container, Eyebrow, ImagePlaceholder, RevealOnScroll
  home/                     Ana sayfa bölümleri (Hero, kategori vitrini, fiyat özeti, …)
  collections/               Koleksiyon sayfası bölümleri
  prices/                     Fiyat tablosu
  contact/                    İletişim formu
src/config/                Marka, navigasyon, iletişim, kategori config'i
  brand.ts
  navigation.ts
  contact.ts
  categories.ts
src/lib/prices/            Fiyat verisi soyutlaması (bkz. aşağıda)
```

## Fiyat Mimarisi

Fiyatlar `PriceProvider` arayüzü (`src/lib/prices/types.ts`) üzerinden
gelir. Canlı kaynak `OzanDovizPriceProvider` (`live-provider.ts`) —
ozandoviz.com'un dokümante edilmemiş uç noktalarından veri çeker, 60
saniyede bir tazelenir. `ResilientPriceProvider` bunu sarmalar: canlı
istek başarısız olursa otomatik olarak `MockPriceProvider`'a
(demo veri) döner, sayfa asla kırılmaz. Detaylar için
`ASSET_CHECKLIST.md` §7'ye bakın. Farklı/ek bir kaynak bağlanacağında
yalnızca `src/lib/prices/index.ts` içindeki `getPriceProvider()`
fonksiyonu değiştirilir — UI bileşenleri değişmeden kalır.

## Eksik Görseller

Repository içinde henüz gerçek Alvera logosu veya ürün fotoğrafı
bulunmuyor; bu yüzden tüm görsel alanları nötr bir `ImagePlaceholder`
bileşeniyle işaretlendi. Hangi görsellerin nereye ekleneceğinin tam
listesi için **[`ASSET_CHECKLIST.md`](./ASSET_CHECKLIST.md)** dosyasına
bakın.

## Teknoloji

- [Next.js](https://nextjs.org/) 15 (App Router)
- TypeScript
- Tailwind CSS
- `next/font` ile Cormorant (display) + Montserrat (sans) fontları
- Tasarım kararları [UI/UX Pro Max skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
  ile doğrulandı (`.claude/skills/ui-ux-pro-max`) — bkz. `design-system/MASTER.md` §0
