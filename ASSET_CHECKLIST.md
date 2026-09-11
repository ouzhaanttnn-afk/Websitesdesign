# Asset Checklist — Alvera Kuyumculuk

Bu doküman, sitede şu anda **geçici görsel alanı (`ImagePlaceholder`)** ile
gösterilen ve gerçek görsel/veri ile değiştirilmesi gereken tüm noktaları
listeler. Repository içinde kullanılabilir gerçek bir ürün fotoğrafı veya
mekân görseli bulunmadığı için hiçbir görsel uydurulmadı.

Bir gerçek görsel geldiğinde yapılacak işlem her yerde aynıdır:
`ImagePlaceholder` bileşenini `next/image` ile değiştirin ve **aynı `alt`
metnini** kullanın.

## 1. Marka

| Alan | Konum | Durum |
|---|---|---|
| Logo | `public/brand/alvera-logo.png`, `public/brand/alvera-logo-gold.png` (iki dosya da aynı içerik — gerçek marka altını hem açık hem koyu zeminde iyi okunuyor) | **Yükseltildi — gerçek vektör kaynak kullanılıyor.** Kullanıcının paylaştığı `alveralogo.pdf` (vektör, 1920×1080pt sayfa) headless Chromium ile yüksek çözünürlükte render edilip (2603×856px), luminance-tabanlı alfa maskeleme ile şeffaf PNG'e dönüştürüldü. Önceki sürüm bir kartvizit fotoğrafından (644×233px, düşük çözünürlük) kırpılmıştı; bu artık gerçek, keskin kenarlı bir vektör render — büyük kullanımlarda (hero, büyük başlıklar) da bozulmadan kullanılabilir. |
| Favicon / site ikonu | `src/app/icon.svg`, `src/app/favicon.ico` | Şu an marka renklerinden üretilmiş basit bir mücevher ikonu kullanılıyor (gerçek logodan değil — küçük boyutta "ALVERA" yazısı okunaksız kalacağı için kasıtlı olarak soyut bırakıldı). |

## 2. Ana Sayfa (`/`)

| Alan | Konum | Açıklama |
|---|---|---|
| Hero görseli | `src/components/home/Hero.tsx` | Vitrin/atölye editoryal görseli gerekiyor (geniş, yatay, güçlü kompozisyon). |
| Kategori görselleri (Altın, Pırlanta, Bilezik) | `src/components/home/CategoryShowcase.tsx` | Her biri için dikey (4:5) ürün görseli. |
| Kategori görselleri (Kolye, Yüzük, Küpe, Saat) | `src/components/home/CategoryShowcase.tsx` | Kare (1:1) grid görselleri. |
| Mağaza içi görsel | `src/components/home/AboutTeaser.tsx` | 3:2 oranlı mağaza/atölye görseli. |

## 3. Koleksiyonlar (`/koleksiyonlar`)

| Alan | Konum | Açıklama |
|---|---|---|
| 7 kategori görseli (Altın, Pırlanta, Bilezik, Kolye, Yüzük, Küpe, Saat) | `src/components/collections/CollectionSection.tsx` (`src/config/categories.ts` üzerinden) | Her kategori için 4:5 oranlı, gerçek ürün fotoğrafı. |
| Ürün kataloğu / fiyat verisi | — | Şu an ürün bazlı katalog yok; bilinçli olarak kapsam dışı bırakıldı (bkz. proje talebi §8). Mimari ileride ürün/kategori/detay/favoriler eklenecek şekilde hazır. |

## 4. Hakkımızda (`/hakkimizda`)

| Alan | Konum | Açıklama |
|---|---|---|
| Ekip / mağaza görseli | `src/app/hakkimizda/page.tsx` | 4:5 oranlı, mağaza içi veya ekip görseli. |
| Dış cephe / konum görseli | `src/app/hakkimizda/page.tsx` | 4:3 oranlı, mağazanın dış cephesi. |

## 5. İletişim (`/iletisim`)

| Alan | Konum | Açıklama |
|---|---|---|
| Konum / harita | `src/app/iletisim/page.tsx` | **Tamamlandı.** Placeholder yerine gerçek adresle çalışan bir Google Haritalar `iframe` gömülü (API anahtarı gerektirmeyen embed formatı) + "Yol tarifi al" linki. |

## 6. Doğrulanamayan Metin Verileri

| Alan | Şu anki değer | Not |
|---|---|---|
| Açık adres | "Cengizhan Mahallesi, Natoyolu Cad. No: 209/C, Mamak / Ankara" | **Doğrulandı** (kartvizitten, `src/config/brand.ts` + `brand.address` — JSON-LD yapısal veri için ayrı alanlara da bölündü). |
| WhatsApp numarası | +90 533 485 30 40 | **Doğrulandı** (kartvizitten, `src/config/contact.ts`). Mağaza sabit hattından (+90 312 390 24 25) farklı, ayrı bir cep numarası — önceki sürümde yanlışlıkla sabit hat kullanılıyordu, düzeltildi. |
| Çalışma saatleri | "Çalışma saatleri yakında eklenecek" | Hâlâ doğrulanmış bilgi yok, placeholder olarak kalıyor (`src/config/brand.ts`). |

Bu alanlar `src/config/brand.ts` / `src/config/contact.ts` dosyalarından
güncellenince site genelinde otomatik olarak değişir.

## 7. Fiyat Verisi

**Canlı — bağlandı.** `src/lib/prices/live-provider.ts` (`OzanDovizPriceProvider`),
ozandoviz.com'un kendi ön yüzünün kullandığı, dokümante edilmemiş uç
noktalarından (`centergoldpagedata.php` vb.) veri çekiyor. Kimlik doğrulama
gerektirmiyor, `robots.txt` kısıtlaması yok — ama **resmi/dokümante edilmiş
bir public API değil**; kaynak sitenin yapısı değişirse entegrasyon
bozulabilir.

**Bu yüzden hiçbir zaman doğrudan kullanılmıyor:**
`src/lib/prices/index.ts` → `getPriceProvider()`, canlı kaynağı
`ResilientPriceProvider` ile sarmalar. Canlı istek başarısız olursa
(zaman aşımı, kaynak site değişti, ağ hatası) otomatik ve sessizce
`MockPriceProvider`'a döner — fiyatlar sayfası **asla kırılmaz**, en kötü
ihtimalle "Demo veri" etiketiyle gösterir.

**Kapsam / eşleme:** 16 kalem gösteriliyor — Has Altın, Gram Altın, Dolar,
Euro, ve 6 sikke türünün hem "Yeni" hem "Eski" (antika) fiyatı: Çeyrek,
Yarım, Tam, Gremse, Ata Lirası, Ata Beşli. Sikke verisi
`onlinesarrafiyetlpagedataredis.php`'den geliyor (ozandoviz.com/csarrafiye.php
sayfasının kullandığı uç nokta) — bu tek istek Yeni+Eski tüm varyantları
birden döndürüyor. Aynı sayfa ayrıca "Has karşılığı" (gram eşdeğeri) ve
"işçilik" ayrıntılarını da sunuyor ama **bilerek alınmadı**: işçilik
verisinde bariz hatalar tespit edildi (bazı kalemlerde negatif satış
değeri) — güvenilmeyen bir alt veriyi göstermek istemedik. Önceki mock
listesindeki "Cumhuriyet Altını" ve "22 Ayar Bilezik" bu kaynakta
mevcut değil, yerlerine kaynağın gerçekten sunduğu kalemler kondu.

**Nezaket/performans:** Kaynak site kendi sayfasında 30 saniyede bir
sorguluyor; biz Next.js'in fetch cache'i üzerinden **60 saniyede bir**
tazeliyoruz (`next: { revalidate: 60 }`) — her ziyaretçi isteğinde
yeniden çekmiyoruz.

**Başka bir kaynağa geçmek/eklemek için:**
1. `src/lib/prices/types.ts` içindeki `PriceProvider` arayüzünü uygulayan
   yeni bir sınıf yazın.
2. `src/lib/prices/index.ts` içindeki `getPriceProvider()`'da
   `ResilientPriceProvider`'a verilen birincil sağlayıcıyı değiştirin.

UI bileşenleri (`PriceTable`, `PriceTeaser`) hiçbir değişiklik gerektirmez.
