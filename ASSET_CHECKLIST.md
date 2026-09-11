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
| Logo — mağaza tabela fotoğrafı | `design-system/brand-assets/alvera-store-signage.jpg` | **Alındı.** Gerçek tabelanın fotoğrafı; wordmark'ın tipografi/renk karakterini (kalın sans-serif, altın) kalibre etmek için kullanıldı (bkz. `design-system/MASTER.md` §10). Kendisi doğrudan sitede kullanılmıyor (ham fotoğraf, kırpılmamış/arka plan temizlenmemiş). |
| Logo — temiz vektör/PNG dosyası | `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` | **Hâlâ eksik.** Şu an tabelaya sadık bir metin wordmark'ı (`font-sans font-bold`, altın renk) kullanılıyor. Kenarları temiz, arka planı şeffaf bir logo dosyası (SVG/PNG) verilirse `next/image` ile birebir değiştirilebilir. |
| Favicon / site ikonu | `src/app/icon.svg`, `src/app/favicon.ico` | Şu an marka renklerinden üretilmiş basit bir mücevher ikonu kullanılıyor (gerçek logodan değil). |

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
| Konum / harita görseli | `src/app/iletisim/page.tsx` | 4:3 oranlı; gerçek harita/konum görüntüsü veya embed harita ile değiştirilebilir. |

## 6. Doğrulanamayan Metin Verileri

Aşağıdaki alanlar, doğrulanmış bilgi elimizde olmadığı için **placeholder**
olarak bırakıldı (`src/config/brand.ts`):

| Alan | Şu anki değer | Not |
|---|---|---|
| Açık adres | "Adres bilgisi yakında eklenecek" | Sadece "Mamak / Ankara" doğrulanmış konum bilgisi olarak kullanıldı. |
| Çalışma saatleri | "Çalışma saatleri yakında eklenecek" | — |

Bu iki alan `src/config/brand.ts` dosyasından güncellenince site genelinde
(footer, hakkımızda, iletişim) otomatik olarak değişir.

## 7. Fiyat Verisi

`src/lib/prices/mock-provider.ts` içindeki tüm fiyatlar **demo amaçlıdır**,
gerçek piyasa verisi değildir. Gerçek bir fiyat kaynağı bağlanacağında:

1. `src/lib/prices/types.ts` içindeki `PriceProvider` arayüzünü uygulayan
   yeni bir sınıf yazın (ör. `live-provider.ts`).
2. `src/lib/prices/index.ts` içindeki `getPriceProvider()` fonksiyonunun
   döndürdüğü sınıfı değiştirin.

UI bileşenleri (`PriceTable`, `PriceTeaser`) hiçbir değişiklik gerektirmez.
