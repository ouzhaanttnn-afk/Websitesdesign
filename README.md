# Alvera Kuyumculuk — Website + Lead Engine

Alvera Kuyumculuk (Mamak / Ankara) için "quiet luxury" tasarım diliyle
hazırlanmış kurumsal web sitesi. Next.js App Router + TypeScript + Tailwind
CSS ile geliştirildi.

Site artık yalnızca bir vitrin değil — ürün → fiyat → WhatsApp/fiyat
talebi/rezervasyon akışını uçtan uca yöneten, ölçülebilir bir **Lead
Engine** içeriyor (ürün kataloğu, admin paneli, talep/lead yönetimi,
analytics). Mimari detayları için aşağıdaki **Lead Engine** bölümüne bakın.

## Tasarım Sistemi

Sitenin tüm tasarım kararları (renk, tipografi, spacing, bileşen kuralları,
motion, erişilebilirlik) tek bir kaynakta toplanır:

- **[`design-system/MASTER.md`](./design-system/MASTER.md)**

Yeni bir sayfa veya bileşen eklerken önce bu dokümana bakın.

## Başlarken

Lead Engine'in veritabanı katmanı gerçek bir Postgres bağlantısı ister
(`POSTGRES_URL` ortam değişkeni — bkz. aşağıdaki "Veritabanı" bölümü).
Yerel geliştirme için `.env.local`'e bir `POSTGRES_URL` eklemeniz gerekir.

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
  koleksiyonlar/            Koleksiyonlar (artık gerçek ürünleri de listeler)
  fiyatlar/                  Fiyatlar (güncel altın/döviz — canlı ticker)
  hakkimizda/               Hakkımızda
  iletisim/                   İletişim
  urun/[slug]/              Ürün detay sayfası (Lead Engine)
  admin/                    Yönetim paneli (Lead Engine, auth korumalı)
  api/                      Route handler'lar (leads, analytics, admin/*, qr/*)
src/components/
  layout/                    Header, Footer, SkipLink, SiteChrome (public/admin chrome ayrımı)
  ui/                          Button, Container, Eyebrow, ImagePlaceholder, RevealOnScroll
  home/                     Ana sayfa bölümleri (Hero, kategori vitrini, fiyat özeti, …)
  collections/               Koleksiyon sayfası bölümleri
  prices/                     Fiyat tablosu
  contact/                    İletişim formu
  product/                    Ürün sayfası bileşenleri (galeri, CTA'lar, quick lead modal, …)
  admin/                      Admin paneli bileşenleri (shell, ürün formu)
src/domains/                Lead Engine iş mantığı (bkz. Lead Engine bölümü)
src/config/                Marka, navigasyon, iletişim, kategori config'i
  brand.ts
  navigation.ts
  contact.ts
  categories.ts
src/lib/prices/            Genel altın/döviz ticker soyutlaması (bkz. aşağıda)
src/lib/db/                Lead Engine veritabanı istemcisi (Postgres, `pg`)
src/middleware.ts          /admin ve /api/admin/* oturum koruması
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

## Lead Engine

Ürün kataloğu, fiyat motoru, lead/talep yönetimi ve admin paneli — mevcut
tasarım sistemine dokunmadan, ayrı domain katmanları olarak eklendi.

### Domain katmanları (`src/domains/`)

| Domain | Sorumluluk |
|---|---|
| `products/` | Ürün modeli, stok durumu (`AVAILABLE/RESERVED/SOLD/HIDDEN`), repository |
| `pricing/` | `PriceProvider` arayüzü, `ManualPriceProvider` (admin'in girdiği piyasa değerleri), `calculateProductPrice` motoru. **Not:** `/fiyatlar` sayfasındaki canlı Ozan Döviz ticker'ından (`src/lib/prices/`) tamamen ayrı bir domain — birbirine bağımlı değiller. |
| `leads/` | Talep (lead) modeli ve repository — `PRICE_REQUEST/WHATSAPP/RESERVATION/PRODUCT_INFO/SIMILAR_PRODUCT` |
| `analytics/` | `trackEvent()` istemci soyutlaması + sunucu tarafı event kaydı (`product_view`, `whatsapp_click`, `price_request_created`, …) |
| `whatsapp/` | `createWhatsAppMessage()` — WhatsApp mesajı tek yerden üretilir |
| `admin/` | Şifre doğrulama + imzalı, HttpOnly çerez tabanlı oturum (bkz. aşağıda) |

### Veritabanı — Vercel Postgres (Neon)

Kalıcı katman `src/lib/db/client.ts` — `pg` (`node-postgres`) ile gerçek
bir Postgres'e bağlanır. Bağlantı dizesi `POSTGRES_URL` ortam
değişkeninden okunur; Vercel projesinde **Storage → Postgres** bağlanınca
bu değişken otomatik enjekte edilir.

**Neden Postgres (ve neden önce SQLite denendi):** V0.1'in ilk sürümünde
Node'un yerleşik `node:sqlite` modülü, işletim sisteminin geçici
dizininde (`os.tmpdir()`) tutulan tek dosyalık bir veritabanıyla
çalışıyordu — hesap/kimlik bilgisi gerektirmediği için hızlıca teslim
edilebiliyordu. Ancak canlıda ortaya çıktı ki Vercel, Next.js'in her
route/sayfasını **ayrı bir serverless fonksiyon** olarak çalıştırabiliyor;
her biri kendi izole `/tmp` dosya sistemine sahip. Admin panelinden
eklenen bir ürün bir fonksiyonun `/tmp`'ine yazılıyordu, müşterinin
gördüğü sayfa ise başka bir fonksiyonda çalışıp hiç göremiyordu — yani
"admin ürün ekler → müşteri görür" akışı canlıda güvenilir çalışmıyordu.
Bu yüzden ağ üzerinden erişilen, gerçekten paylaşılan bir veritabanına
(Postgres) geçildi. Şema (`SCHEMA` sabiti, `src/lib/db/client.ts`) ilk
istekte otomatik kurulur (`CREATE TABLE IF NOT EXISTS`) — ayrı bir
migration adımı gerekmez.

**Yerel geliştirme:** `.env.local`'e Vercel'in verdiği `POSTGRES_URL`
değerini (veya kendi Postgres'inizin bağlantı dizesini) ekleyin.

**Başka bir Postgres sağlayıcısına geçiş:** Sadece `POSTGRES_URL` ortam
değişkenini değiştirin — kod, herhangi bir standart Postgres'e (Supabase,
Neon, RDS, …) bağlanacak şekilde yazıldı, Vercel'e özel bir SDK
kullanılmıyor.

### Admin paneli (`/admin`)

Supabase Auth yok — tek, paylaşımlı bir mağaza şifresiyle korunan, imzalı
(HMAC, Web Crypto) HttpOnly çerez tabanlı basit bir oturum sistemi
(`src/domains/admin/`, `src/middleware.ts`). Gerekli ortam değişkenleri:

```
ADMIN_PASSWORD=...          # admin paneli şifresi
ADMIN_SESSION_SECRET=...    # oturum çerezini imzalamak için rastgele anahtar
```

Yerel geliştirme için `.env.local`'de zaten tanımlı (gitignore'da, asla
commit'lenmez). **Üretimde mutlaka Vercel proje ayarlarından farklı,
güçlü değerlerle değiştirin.**

Ekranlar: `/admin` (bugünün özeti), `/admin/urunler` (arama/filtre + hızlı
SATILDI aksiyonu + yeni ürün), `/admin/talepler` (lead listesi/durum),
`/admin/piyasa` (Gram Altın/22/18/14 Ayar/Dolar/Euro merkezi değerleri).
Hepsi 390px öncelikli, mobil-ilk tasarlandı.

### Ürün görselleri

V0.1'de admin panelinden yüklenen fotoğraflar tarayıcıda küçültülüp
(`src/domains/products/images.ts`) veritabanında base64 data URI olarak
saklanır — ayrı bir dosya depolama servisi (Supabase Storage/Vercel Blob)
henüz bağlı değil. Gerçek depolamaya geçişte yalnızca bu dosya ve
`ProductForm`'un upload akışı değişir.

## Eksik Görseller

Gerçek marka logosu artık kullanılıyor (bkz. `ASSET_CHECKLIST.md` §1).
Ürün fotoğrafları hâlâ eksik — admin panelinden gerçek fotoğraflar
yüklenene kadar tüm ürün/kategori görsel alanları nötr bir
`ImagePlaceholder` bileşeniyle işaretlenir. Detaylar için
**[`ASSET_CHECKLIST.md`](./ASSET_CHECKLIST.md)** dosyasına bakın.

## Teknoloji

- [Next.js](https://nextjs.org/) 15 (App Router)
- TypeScript
- Tailwind CSS
- `next/font` ile Cormorant (display) + Montserrat (sans) fontları
- Tasarım kararları [UI/UX Pro Max skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
  ile doğrulandı (`.claude/skills/ui-ux-pro-max`) — bkz. `design-system/MASTER.md` §0
