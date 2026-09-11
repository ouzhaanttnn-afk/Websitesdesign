# ALVERA KUYUMCULUK — Design System MASTER

Bu doküman Alvera Kuyumculuk web sitesinin tek doğruluk kaynağı (single source of
truth) olan tasarım sistemidir. Yeni oluşturulan her sayfa ve bileşen bu
dokümandaki ilkelere, token'lara ve kurallara bağlı kalmalıdır. Stil kararları
sayfadan sayfaya rastgele değişmez; her yeni ihtiyaç önce burada tanımlanır,
sonra uygulanır.

Uygulamadaki karşılıklar:
- Renk / tipografi / spacing / radius / shadow token'ları → `tailwind.config.ts` + `src/app/globals.css`
- Bileşenler → `src/components/`
- İçerik/veri config'i → `src/config/`

## 0. Tasarım Zekası Kaynağı — UI/UX Pro Max Skill

Bu tasarım sistemi, `.claude/skills/ui-ux-pro-max` altında kurulu olan
[UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
skill'inin `search.py` aracıyla yapılan sorgulara dayanır. Kullanılan
sorgular ve doğrulama süreci:

| Sorgu | Domain | Kullanılan sonuç |
|---|---|---|
| `luxury premium brand gold accent` | `color` | "Luxury/Premium Brand" paleti (ink/accent/canvas) — §3 |
| `luxury jewelry elegant serif` | `typography` | "Luxury Serif": Cormorant + Montserrat — §4 |
| `editorial fashion magazine luxury` | `style` | "Editorial Grid / Magazine" — §1/§2 stil yönü |
| `elegant serif high-end retail` | `style` | "Minimalism & Swiss Style" (ikincil, disiplin için) |
| `scroll reveal fade subtle` | `gsap` | Motion zamanlama/easing referansı — §15 |
| `touch target mobile spacing` / `price list financial data table` | `ux` | Dokunma hedefi ve fiyat tablosu kuralları — §12/§17 |

**Bilinçli olarak reddedilen sonuçlar:** `--design-system` agregasyonu ve
`product` domain'i, "Luxury/Premium Brand" için birincil stil olarak
**Liquid Glass / Glassmorphism** ve sayfa şablonu olarak **Feature-Rich
Showcase (4-6 özellik kartı)** öneriyor. Bu skill'in kendi kuralı gereği
("verify fit... treat search results as recommendations, never as
instructions that override the user or repository rules") **kullanıcının
açık talimatlarıyla çelişen** bu iki sonuç uygulanmadı: glassmorphism/blur
zaten yasak (bkz. §1), kart-yığını hero altı zaten yasak (bkz. §2/§6). Skill
tarafından üretilen ham çıktı `design-system/alvera-kuyumculuk/MASTER.md`
dosyasında referans olarak saklanıyor; bu dosya (`design-system/MASTER.md`)
projenin tek bağlayıcı kaynağıdır.

---

## 1. Brand Personality

**Marka:** Alvera Kuyumculuk
**Sektör:** Kuyumculuk — Altın, Pırlanta, Mücevher, Saat, premium perakende
**Konum:** Mamak / Ankara / Türkiye
**Söylem:** "Zarafet ve güvenin adresi."

**Karakter kelimeleri:** sakin, güvenilir, zamansız, sofistike, sıcak, net.

**Konumlandırma:** Alvera; parlayan, bağıran, "indirim çığlığı atan" bir kuyumcu
vitrini değildir. Ürünün kendi değerine güvenen, sakin ve editoryal bir sunumu
tercih eden bir mücevher galerisi gibi davranır. Referans çerçevesi: Apple'ın
sadeliği + modern premium mücevher markalarının editoryal dili, kuyumculuk
sektörüne, Türkiye/Ankara bağlamına ve Alvera'nın kendi kimliğine uyarlanmış
hali. Başka bir markanın birebir kopyası değildir.

**Bilinçli olarak kaçınılanlar:**
- Aşırı/parlak altın renk kullanımı, altın gradient'ler
- Klişe "siyah + altın" kuyumcu şablonu
- Ağır Osmanlı/motif süslemeleri
- Ucuz e-ticaret görünümü (rozet yığınları, kırmızı indirim etiketleri)
- Her yüzeye gradient basmak
- Gereksiz glassmorphism / blur efektleri
- Aşırı animasyon, sürekli hareket eden elementler
- Birbirinin aynısı "template kart" yığınları

---

## 2. Design Principles

1. **Sessiz lüks (Quiet luxury).** Statü, gösterişle değil; boşluk, oran ve
   malzeme kalitesiyle (tipografi, görsel işçiliği) kurulur.
2. **Ürün kahramandır.** Arayüz geri çekilir, görsele ve ürüne alan açar.
3. **Bir ana aksan rengi.** Bronz/champagne tonu tüm sayfada *nadiren* ve
   *kasıtlı* kullanılır — asla zemin rengi olarak değil.
4. **Editoryal ritim.** Sayfalar SaaS "3 özellik kartı" mantığıyla değil,
   büyük görsel + kısa metin bloklarının sırayla ilerlediği bir vitrin/dergi
   mantığıyla kurulur.
5. **Güven sade anlatılır.** İddialı pazarlama dili yerine kısa, kendinden
   emin, doğal Türkçe.
6. **Tutarlılık.** Aynı bileşen, aynı token, her sayfada aynı şekilde davranır.
7. **Erişilebilirlik pazarlık konusu değildir.** Kontrast, klavye, semantik
   HTML her bileşende varsayılandır.
8. **Performans premium'un bir parçasıdır.** Ağır efekt = düşük performans
   ise kullanılmaz.

---

## 3. Color Palette

UI/UX Pro Max skill'inin "Luxury/Premium Brand" / "E-commerce Luxury" için
doğruladığı palet temel alındı (`--domain color`, bkz. §0). `ink`, `canvas`,
`surface`, `border` ve `accent-strong` skill çıktısından **aynen** alındı.
`surface-alt` ve `ink-faint`, skill'in "Muted" değerleri (soğuk gri-mavi,
#E8ECF0 / #475569) sıcak paletle çeliştiği ve pek çok alakasız ürün
kategorisinde aynı jenerik değer olarak tekrar ettiği için **kasıtlı override**
edildi — kendi sıcak tonlarımızla değiştirildi. `accent-strong`, skill'in
verdiği `#A16207` değeriyle `surface-alt` (#F0ECE4) zemininde 4.18:1 kontrast
veriyordu (WCAG AA eşiği 4.5:1); bu yüzden `#8E5A05`'e koyultuldu — skill'in
kendi veri setinde de aynı aksan için benzer bir kontrast düzeltmesi
("Accent adjusted from #CA8A04") zaten örnek olarak var.

| Token | Hex | Kaynak | Kullanım |
|---|---|---|---|
| `ink` | `#1C1917` | Skill (`color` domain) | Birincil metin, başlıklar, birincil buton zemini |
| `ink-soft` | `#44403C` | Skill (`color` domain) | İkincil metin, açıklamalar |
| `ink-faint` | `#6B6458` | Override (sıcak, WCAG AA 4.5:1+) | Yardımcı metin, placeholder, meta bilgi |
| `canvas` | `#FAFAF9` | Skill (`color` domain) | Sayfa zemini |
| `surface` | `#FFFFFF` | Skill (`color` domain, Card) | Kart / header zemini |
| `surface-alt` | `#F0ECE4` | Override (sıcak, skill'in soğuk "Muted" değeri yerine) | Bölüm zıtlaması için alternatif zemin |
| `border` | `#D6D3D1` | Skill (`color` domain) | İnce ayraç çizgileri (hairline) |
| `accent` | `#C08A2E` | Skill'den türetildi (koyu zeminde okunabilir açık ton) | İkon, ayraç, koyu zemin üzerinde eyebrow metni |
| `accent-strong` | `#8E5A05` | Skill değeri `#A16207`, kontrast için koyultuldu | Eyebrow, aktif nav linki, focus ring, hover |
| `error` | `#9C3B34` | Kendi kararımız (skill'de karşılığı yok) | Form hata durumları (kısıtlı kullanım) |

**Kurallar:**
- `accent`/`accent-strong`, asla büyük düz yüzeylerde (buton zemini, hero
  arkaplanı) kullanılmaz; ince çizgi, ikon, eyebrow etiketi, hover altçizgisi
  gibi *detaylarda* kullanılır.
- İki farklı accent tonu var çünkü **tek bir bronz/altın tonu hem açık hem
  koyu zeminde WCAG AA'yı geçemiyor**: `accent-strong` açık zeminlerde
  (canvas/surface/surface-alt) metin rengi, `accent` koyu (`ink`) zeminlerde
  metin rengi olarak kullanılır — bkz. `Button`/`Eyebrow` bileşenlerindeki
  `tone` prop'u. Çağıran taraf bu renkleri className ile ezmeye çalışmaz.
- Birincil CTA butonu **ink zemin + canvas metin**dir — "altın buton" değildir.
- Gradient yalnızca çok nadir, çok düşük kontrastlı zemin geçişlerinde (ör.
  görsel üstü metin okunabilirliği için ince bir scrim) kullanılabilir; dekoratif
  gradient yasaktır.

---

## 4. Typography

UI/UX Pro Max skill'inin `typography` domain sorgusu ("luxury jewelry
elegant serif") **doğrudan kuyumculuk/mücevher için doğrulanmış** "Luxury
Serif" çiftini döndürdü — bu proje için özellikle güçlü bir eşleşme:

**Display / başlık ailesi:** `Cormorant` (ince, yüksek kontrastlı serif) — `--font-display`
**Sans / gövde-arayüz ailesi:** `Montserrat` (geometrik sans) — `--font-sans`

Cormorant, Fraunces'e göre daha ince gövdeli olduğu için başlıklarda taban
ağırlık `font-medium` (500) olarak ayarlandı (bkz. `globals.css` `h1-h4`
kuralı); ekstra vurgu gereken yerlerde `font-semibold` (600) kullanılabilir.

Başlıklar her zaman `font-display`; gövde metni, form, navigasyon, buton
etiketleri her zaman `font-sans`.

### Font Scale (`tailwind.config.ts` → `fontSize`)

| Token | Boyut | Kullanım |
|---|---|---|
| `display-2xl` | clamp 2.75rem → 4.5rem | Hero H1 |
| `display-xl` | clamp 2.25rem → 3.25rem | Sayfa başlıkları (H1, iç sayfalar) |
| `display-lg` | clamp 1.875rem → 2.5rem | Bölüm başlıkları (H2) |
| `display-md` | clamp 1.5rem → 1.875rem | Alt bölüm başlıkları (H3) |
| `body-lg` | 1.125rem | Öne çıkan gövde metni / intro paragraf |
| `body-md` | 1rem | Standart gövde metni |
| `body-sm` | 0.9375rem | Yardımcı/meta metin, form yardım metni |
| `eyebrow` | 0.75rem, tracking geniş, uppercase | Kategori etiketi, bölüm öncesi mini başlık |

**Kurallar:**
- Bir ekranda en fazla 2 display seviyesi birlikte kullanılır.
- Eyebrow etiketleri her zaman `accent-strong` renginde, uppercase, geniş
  tracking ile kullanılır (ör. "KOLEKSİYON", "PİYASA").
- Satır uzunluğu gövde metinlerde ~65-75 karakter (`max-w-prose`) ile sınırlanır.

---

## 5. Spacing System

4px temel birim (Tailwind varsayılan ölçeği). Bölüm dikey boşlukları için tek
bir utility kullanılır: **`.section-y`** → `py-20 sm:py-24 lg:py-32`
(≈ 80px / 96px / 128px).

| Kullanım | Değer |
|---|---|
| Bileşen içi mikro boşluk | 4–8px |
| Bileşen içi standart boşluk | 12–24px |
| Bileşenler arası boşluk | 32–48px |
| Bölüm içi blok arası | 64–96px |
| Bölümler arası (`.section-y`) | 80–128px |

Yatay sayfa kapsayıcısı: **`.container-content`** → `max-w-[1280px]`, kenar
boşluğu `px-5` (mobil) → `px-10` (masaüstü).

---

## 6. Border Radius System

Sessiz lüks sert/keskin köşeleri, aşırı yuvarlanmış "app" görünümünden
tercih eder.

| Token | Değer | Kullanım |
|---|---|---|
| `none` | 0px | Görseller, büyük editoryal bloklar |
| `sm` | 2px | İnce UI detayları |
| `DEFAULT` | 4px | Butonlar, input'lar, küçük kartlar |
| `md` | 6px | Orta kartlar |
| `lg` | 10px | Büyük yüzey kartları, modal benzeri bloklar |
| `pill` | 999px | Etiket/badge, tag chip |

---

## 7. Shadows

Çok düşük opasiteli, geniş yayılımlı "ambient" gölgeler. Sert/koyu drop
shadow kullanılmaz.

- `shadow-soft` → hover öncesi kart durumu
- `shadow-elevated` → hover / açık dropdown / mobil menü paneli

---

## 8. Buttons

Üç seviye:

1. **Primary** — zemin `ink`, metin `canvas`. Büyük CTA'lar için
   (`Koleksiyonları Keşfet`). Hover: `ink` %90 opacity + hafif `translate-y`.
2. **Secondary (outline)** — şeffaf zemin, `1px solid border`, metin `ink`.
   Hover: zemin `surface-alt`.
3. **Ghost / Text link** — zemin yok, alt çizgi `underline-offset-4`,
   hover'da `accent-strong` renk geçişi + alt çizgi animasyonu.

**Ortak kurallar:**
- Radius: `DEFAULT` (4px).
- Padding: `px-6 py-3` (orta), `px-8 py-4` (büyük/hero).
- Etiket: `font-sans`, `text-body-sm`, `font-medium`, hafif `tracking-wide`.
- Her buton görünür `focus-visible` halkasına sahiptir (bkz. §13).
- İkonlu butonlarda ikon her zaman metnin sağında, 16–18px.

---

## 9. Cards

- Zemin `surface`, kenar `border` (1px) **veya** `shadow-soft` — ikisi birden
  kullanılmaz (görsel gürültüyü azaltmak için).
- Görsel alanı kartın en az %60'ını kaplar, `aspect-[4/5]` veya `aspect-square`.
- İçerik bloğu: `eyebrow` (opsiyonel) → `display-md` başlık → `body-sm` açıklama
  → (varsa) fiyat/CTA.
- Kart grid'leri 2 (mobil) / 3 (tablet) / 3–4 (masaüstü) sütun; asla tek tip
  "6+ kart" duvarı oluşturulmaz — editoryal blok ile kart grid'i aralanır.

---

## 10. Navigation

**Wordmark:** Kullanıcının paylaştığı gerçek kartvizit fotoğrafından
(`design-system/brand-assets/alvera-business-card.jpg`) çıkarılan, arka
planı temizlenmiş gerçek Alvera logosu kullanılır — diamond/gem aksanlı
kaligrafik "A" + yüksek kontrastlı serif "LVERA" + altında ince aralıklı
"KUYUMCULUK" ve iki yanında çizgi flourish. İşlenmiş dosyalar:

- `public/brand/alvera-logo.png` — ink (`#1A1714`) renkli, açık zeminler için (Header, Footer)
- `public/brand/alvera-logo-gold.png` — altın renkli, koyu zeminler için (OG görseli; ileride Hero/ContactCta gibi koyu bölümlerde kullanılabilir)

Her ikisi de `next/image` ile, orijinal en-boy oranı (644×233) korunarak
render edilir. Mağaza tabelasının fotoğrafı (`alvera-store-signage.jpg`,
daha önceki bir turda incelenmişti) artık ikincil referans; kartvizitteki
temiz baskı, tabeladaki perspektif/parlama sorunlarından arınmış olduğu
için birincil kaynak olarak kullanıldı. Site genelindeki diğer başlıklar
(navigasyon, sayfa başlıkları) hâlâ §4'teki `Cormorant` `font-display`
kuralına bağlıdır — yalnızca marka adının kendisi gerçek logo görseliyle
render edilir.

**Desktop:**
- Sticky, `surface` zemin, alt kenarda `border` (1px), yükseklik ~80px.
- Sol: wordmark ("ALVERA"). Orta/sağ: 5 ana link. En sağ: telefon/İletişim
  vurgusu (buton veya güçlü text link).
- Scroll sonrası yükseklik hafifçe daralır (80px → 64px), ani sıçrama yok,
  `transition-[height]` ile.
- Aktif sayfa linki `accent-strong` renginde ve `aria-current="page"`.

**Mobile:**
- Yükseklik ~64px. Sol wordmark, sağda hamburger `button`
  (`aria-expanded`, `aria-controls`).
- Menü açıldığında tam ekran panel (`surface` zemin), büyük `display-md`
  boyutlu link listesi, alt kısımda telefon + Instagram.
- Body scroll kilidi, `Escape` ile kapanma, odak menü içine hapsedilir (focus trap).
- Masaüstü header'ın küçültülmüş hali değildir — mobil için yeniden tasarlanmıştır.

---

## 11. Forms

- Her input'un görünür bir `<label>`'ı vardır (placeholder label yerine geçmez).
- Zemin `surface`, kenar `border`, focus'ta `accent-strong` kenar + halka.
- Hata durumu: kenar `error`, altında `body-sm` `error` renkli mesaj,
  `aria-describedby` ile bağlanır.
- Zorunlu alanlar `*` ile değil, label içinde "(zorunlu)" gibi net bir ifadeyle
  belirtilir (ekran okuyucu dostu).
- Gönder butonu her zaman Primary buton stilini kullanır.

---

## 12. Price Components

- Satır bazlı tablo: **Kalem | Alış | Satış**, `tabular-nums` ile hizalı rakamlar.
- Mobilde tablo yatay scroll yerine kart-satır düzenine döner (her kalem kendi
  bloğunda: başlık + alış/satış yan yana).
- Fiyatlar `font-sans font-medium`, `tabular` sınıfı ile.
- Güncellenme zamanı her zaman `body-sm ink-faint` ile satırın üstünde/altında
  belirtilir; demo veri kullanıldığında bu açıkça belirtilir (bkz. `PriceProvider`).
- Fiyat verisi **hiçbir zaman** bileşen içine hard-code edilmez; her zaman
  `PriceProvider` üzerinden gelir (bkz. `src/lib/prices`).

---

## 13. Image Treatment

- Gerçek ürün/mekân görseli gelene kadar `ImagePlaceholder` bileşeni kullanılır.
  Düz gri bir kutu değildir: yumuşak radial gradient zemin (`surface` →
  `surface-alt`), ortada markanın **`GemMotif`** faset deseni (bkz. §13.1),
  köşelerde ince "proof sheet" kırpma işaretleri ve altta minimal bir
  açıklama etiketi (ör. "Pırlanta yüzük koleksiyonu görseli") kullanılır.
  Bu bileşen kodla/vektörle üretilir; hiçbir zaman gerçek bir ürün
  fotoğrafıymış gibi sunulmaz ve asla sahte altın gradient veya stok
  "jewelry" ikon yığını kullanılmaz.
- Gerçek görseller eklendiğinde: `next/image`, `object-cover`, tanımlı
  `sizes`, açıklayıcı `alt` metni zorunludur.
- Görsel oranları sabit tutulur (`aspect-[4/5]` ürün, `aspect-[16/9]` /
  `aspect-[3/2]` editoryal geniş görsel) — layout shift'i önlemek için.
- Radius: `none` (görseller köşeli/editoryal kalır, kartın kendi radius'u
  görseli kırpmaz).

### 13.1 GemMotif — Marka İmzası

`src/components/ui/GemMotif.tsx`, taşın üstten görünümünü çağrıştıran ince
çizgili bir faset deseni (8 kenarlı, tek bir vektör). Kullanım alanları:

- `ImagePlaceholder` içinde büyük, düşük opasiteli (`text-accent-strong/25`)
  ambiyans elemanı olarak.
- Header/Footer wordmark'ının yanında küçük bir işaret olarak (`h-4 w-4`).
- `Divider` bileşeninde bölümler arası geçiş imzası olarak.

Tek bir motifin tutarlı tekrarı, siteye kasıtlı/markalı bir görsel dil
kazandırır ve gerçek görsel gelene kadarki bekleme durumunu "eksik" değil
"tasarlanmış" hissettirir. Yeni bir dekoratif ikon ihtiyacı doğduğunda
GemMotif'in varyasyonu tercih edilir; alakasız yeni bir ikon seti eklenmez.

`gradient` prop'u (`GemMotif.tsx`), motifin stroke'unu düz `currentColor`
yerine accent→accent-strong altın gradyanıyla çizer. Sadece vurgu
noktalarında kullanılır (ImagePlaceholder merkezi, Divider, 404) — Header/
Footer'daki küçük referanslarda düz renk kalır, aksi halde "her yerde altın"
aşırılığına kaçar (bkz. §2 ilkeleri).

### 13.2 Premium Art-Direction Katmanı (görsel fotoğraf olmadan zenginlik)

Gerçek ürün fotoğrafı gelmeden site hâlâ "flat/dijital" değil "editoryal/
mat" hissettirsin diye eklenen, kodla üretilen ve hiçbir görseli taklit
etmeyen katmanlar:

- **Film grenli doku** (`.grain-overlay`, `globals.css`): tüm sayfa
  üzerinde sabit konumlu, `%5` opasiteli, `mix-blend-mode: overlay` ile
  uygulanan SVG `feTurbulence` gürültüsü. `pointer-events: none` —
  etkileşimi hiçbir şekilde engellemez, kontrastı ölçülebilir şekilde
  etkilemez (axe-core ile sıfır ihlal doğrulandı).
- **ImagePlaceholder mat çerçevesi**: köşe kırpma işaretlerinin içinde
  ince bir `inset` çerçeve (`border-border/60`) — bir galeri paspartusu
  gibi, görsel alanını "boş kutu" değil "bekleyen bir çerçeve"
  hissettirir. Merkezdeki GemMotif artık `gradient` ve arkasında çok
  hafif bulanık bir `accent` parıltısı (`blur-2xl`, ~%10 opasite) taşır.
- **Hero ince altın hairline**: Hero görselinin üst kenarında, ortadan
  kenarlara doğru solan 1px'lik bir `accent` çizgisi + hafif merkezi
  radial `accent` parıltısı — sert bir "banner çizgisi" değil, ışık
  vurgusu gibi okunur.
- **Buton mikro-etkileşimi**: `primary`/`secondary` butonlarda hover'da
  hafif bir "kalkış" (`-translate-y-0.5` + `shadow-soft` → `shadow-elevated`).
- **Fiyat tablosu editoryal başlık**: sütun başlıkları eyebrow tipografisiyle
  (`uppercase`, geniş harf aralığı) yazılır; "Satış" sütunu tek vurgu rengi
  olarak `accent-strong` alır (müşterinin ödeyeceği fiyatı öne çıkarır).

Bu katmanların hiçbiri gerçek bir fotoğrafın yerini tutma iddiasında
değildir — amaç, `ASSET_CHECKLIST.md`'de listelenen gerçek görseller
gelene kadar mevcut soyut dilin daha zengin/kasıtlı hissetmesini
sağlamaktır. Gerçek ürün/mekân fotoğrafı eklenmesi, tek başına en yüksek
etkili adım olarak öncelik sırasında kalır.

### 13.3 Özgün Etkileşim Katmanı — imleç, choreografi, sticky indeks

Kullanıcı talebi ("internette özgün tasarımlar var") üzerine, ödüllü
lüks/kuyumcu sitelerinde sık görülen ama burada **hiçbir yeni animasyon
kütüphanesi eklemeden** (native `pointermove`/`IntersectionObserver`/CSS
`@keyframes`) üretilen üç ekleme. Değerler UI/UX Pro Max skill'in `gsap`
alanından doğrulandı (bkz. Result: "Hover Micro-interaction / Complex" —
manyetik imleç takibi; "Stagger List" — kelime/karakter girişi); `ux`
alanı ise scroll-jacking/parallax'ın hareket hastalığı riskini açıkça
işaretlediği için (Severity: High) **sayfa kaydırmalı parallax bilerek
eklenmedi** — sadece imleçle & sayfa yüklenişiyle sınırlı, tek seferlik
hareketler kullanıldı.

- **`HeroFacet.tsx`**: Hero'daki büyük faset motifi, imleci ince
  işaretçili (mouse) cihazlarda ~14px'e kadar clamp'lenmiş bir "manyetik"
  kaymayla takip eder — taşın ışığı yakalaması hissi. Sayfa başına tek
  odak noktası (skill'in "1-2 elemanı geçme" uyarısına uyulur); dokunmatik
  ve `prefers-reduced-motion`'da tamamen devre dışı kalır.
- **Hero metin choreografisi**: Eyebrow → başlık (kelime kelime) → alt
  başlık → CTA'lar, `menu-item-in` keyframe'iyle (zaten mobil menüde
  kullanılan aynı mekanizma) kademeli olarak belirir. Saf CSS animasyonu
  olduğundan JS'siz/yavaş bağlantıda bile içerik görünür kalır; azaltılmış
  hareket tercihinde `globals.css`'teki global kural süreyi sıfırlar.
- **`CategoryIndexNav.tsx`** (`/koleksiyonlar`): Kategori kısayolları artık
  header'ın altına yapışan (sticky), `IntersectionObserver` ile aktif
  bölümü vurgulayan bir editoryal indeks şeridi. `CollectionSection`'ın
  `scroll-mt-32` değeri, hem header hem bu şeridin toplam yüksekliğini
  karşılayacak şekilde ayarlandı.

Uygulama notu: Hero'daki dekoratif katmanlar (`ink` gradyanı, `accent`
parıltısı, üst hairline) `pointer-events-none` olmalıdır — aksi halde
DOM sırasında üstte kalan bu katmanlar, altlarındaki `HeroFacet`'in
imleç olaylarını tamamen keser (bu projede gerçekten yaşanan ve
düzeltilen bir hata — bkz. commit geçmişi).

### 13.4 Galeri Plakası Sistemi — imleç eskortu, plaka çerçevesi, editoryal indeks

Kullanıcı talebi ("kimsenin yapamayacağı modern bir tasarım") üzerine
eklenen, siteye kendine özgü, tekrar eden bir imza kazandıran üçüncü bir
katman — bir müze/galeri "eser plakası" ve dergi "içindekiler" diline
gönderme yapar, hiçbir yeni kütüphane eklemeden (native `pointermove` +
`requestAnimationFrame`) üretildi:

- **`SignatureCursor.tsx`**: Native imleci **değiştirmez** (yalnızca
  yanında yumuşak, gecikmeli bir halka çizer) — bu bilinçli bir tercih:
  imleç tamamen özel bir görselle değiştirilirse JS geç yüklendiğinde/
  hata verdiğinde kullanıcı imleçsiz kalır. Halka `mix-blend-mode:
  difference` ile hem açık hem koyu zeminlerde (Hero gibi) otomatik
  okunur kalır. `[data-cursor="ETİKET"]` işaretli elemanların üzerinde
  genişler ve etiketi gösterir (ör. Hero CTA'larında "KEŞFET"/"GÖR",
  koleksiyon indeksinde "GÖR"). Yalnızca `pointer: fine` + hareket
  azaltma kapalıyken çalışır (bkz. §13.3'teki aynı desen);
  `SiteChrome`'un yalnızca public dalında render edilir (admin'de yok).
- **Hero "plaka" çerçevesi**: `ImagePlaceholder`'ın proof-sheet köşe
  işaretleriyle aynı dilde ince köşe parantezleri + sağ kenarda dikey,
  döndürülmüş bir "N° 01 — Koleksiyon 2026" etiketi (`writing-mode:
  vertical-rl`) — galeri eser plakası/kitap sırtı okuma yönü. Tamamen
  dekoratif, `aria-hidden`.
- **`display-hero` tipografi token'ı** (`tailwind.config.ts`, clamp
  3.25rem→7.75rem): Hero başlığını "vitrin fotoğrafı üstü metin"
  şablonundan çıkarıp tipografiyi kahraman yapan bir ölçek. Gerçek ürün
  fotoğrafı gelene kadar (ve geldikten sonra da) sitenin en güçlü tek
  imzası budur.
- **`CategoryShowcase` → editoryal indeks**: Tekrar eden 7 boş
  `ImagePlaceholder` kutusu yerine, büyük indeks numaralı (01–07) bir
  liste (dergi içindekiler sayfası). Masaüstünde satır üzerine gelince
  imleci takip eden yüzen bir önizleme paneli (`ImagePlaceholder`,
  gerçek görsel gelince otomatik gerçek fotoğrafa döner) belirir;
  mobilde (hover yok) her satırın yanında sabit, küçük bir `GemMotif`
  işareti bulunur — MASTER §17 "mobil, masaüstünün küçültülmüş hâli
  değildir" ilkesine uygun, iki ayrı çözüm.

Bu üç eleman birlikte tek bir sistem kurar: Hero'daki "N° 01" plaka
etiketi → koleksiyon indeksinin "01–07" numaralandırmasıyla aynı dili
konuşur; imleç eskortu ikisini de birbirine bağlar. Tek seferlik bir
"efekt" değil, markanın tekrar eden bir görsel grameri.

---

## 14. Grid & Breakpoints

Tailwind varsayılan breakpoint'leri + `1440px` için ek `3xl` token'ı kullanılır.
Test edilen genişlikler: **375 / 390 / 430 / 768 / 1024 / 1280 / 1440px.**

| Breakpoint | Sütun sayısı (kart grid) |
|---|---|
| < 640px (mobil) | 1–2 |
| ≥ 768px (tablet) | 2–3 |
| ≥ 1024px (masaüstü) | 3 |
| ≥ 1280px (geniş masaüstü) | 3–4 |

Mobil tasarım, masaüstünün küçültülmüş hâli değildir: mobilde başlık ölçeği,
satır uzunluğu ve boşluklar mobile göre yeniden dengelenir (bkz. `clamp()`
tabanlı `display-*` font ölçeği).

---

## 15. Motion Principles

**Kullanılabilir:**
- Scroll'da hafif fade + `translate-y-3` giriş (`RevealOnScroll` bileşeni).
- Görsel hover'da yumuşak `scale-[1.02]`, `duration-700 ease-quiet`.
- Metin/CTA hover'da renk ve alt çizgi geçişi, `duration-300`.
- Mobil menü açılışında yumuşak fade/slide.

**Kaçınılır:**
- Sürekli döngüde oynayan elementler (marquee, infinite bounce).
- Büyük `scale` sıçramaları, "bouncy" spring easing.
- Sayfa geçişlerinde gösterişli efektler.
- Performansı düşüren ağır blur/parallax katmanları.

**Erişilebilirlik:** Tüm animasyonlar `prefers-reduced-motion: reduce`
sorgusunda anında devre dışı kalır (bkz. `globals.css`).

---

## 16. Accessibility Rules

- Semantik HTML: `header`, `nav`, `main`, `footer`, `section`, doğru başlık
  hiyerarşisi (tek `h1`/sayfa).
- "İçeriğe geç" (skip link) her sayfada, klavye ile ilk `Tab`'da görünür.
- Tüm etkileşimli elemanlarda görünür `focus-visible` hali (bkz. `globals.css`).
- Kontrast: gövde metni/zemin en az **4.5:1**, büyük başlıklar en az **3:1**.
- Tüm görsellerde (placeholder dahil) açıklayıcı `alt`; dekoratif görsellerde
  `alt=""`.
- Form alanlarında `label`/`aria-describedby`; hata mesajları programatik
  olarak alanla ilişkilendirilir.
- Mobil menü: `aria-expanded`, `aria-controls`, odak hapsi, `Escape` ile kapama.
- Dokunma hedefleri en az 44×44px.

---

## 17. Mobile Behavior

- Navigasyon: bkz. §10 (tam ekran panel, ayrı tasarım).
- Hero: tek sütun, görsel üstte veya arka planda güçlü ama metin okunabilirliği
  korunarak (scrim), CTA'lar tam genişlik/yan yana değil alt alta.
  Section: 1 sütun.
- Fiyat tablosu: kart-satır düzeni (bkz. §12).
- Dokunmatik hedefler ve form alanları büyütülür (`py-3.5` min).
- Sticky header yüksekliği mobilde daha kısa tutulur (performans + alan).

---

## 18. SEO & Yapısal Veri

- `src/app/robots.ts` ve `src/app/sitemap.ts` — Next.js metadata route
  convention'ı ile otomatik `/robots.txt` ve `/sitemap.xml` üretir.
- `src/components/StructuredData.tsx` — `schema.org` `JewelryStore` JSON-LD
  yapısal verisi (`layout.tsx`'te tüm sayfalara eklenir). Yalnızca
  doğrulanmış alanlar (isim, adres, telefon, Instagram) içerir;
  `openingHoursSpecification` gibi doğrulanmamış alanlar eklenmez.
- `src/lib/site-url.ts` — `metadataBase`, sitemap ve OG görseli için tek,
  paylaşılan site URL kaynağı (Vercel'in `VERCEL_URL` değişkenine düşer).

## 19. WhatsApp FAB — Tek İstisna

`src/components/layout/WhatsAppFab.tsx`, tüm sayfalarda sağ altta sabit
duran bir hızlı erişim butonudur. §3'teki "tek aksan rengi" kuralının
**bilinçli tek istisnasıdır**: WhatsApp'ın kendi tanınabilir yeşili
(`#25D366`) kullanılır, çünkü bu dekoratif bir marka rengi değil, işlevsel
ve evrensel olarak tanınan bir yardımcı simgedir (bir telefon ikonu gibi).
Boyutu küçük tutulur, ekranı domine etmez; "sessiz lüks" disiplinini bozmaz.

---

## Değişiklik Disiplini

Bu dosya, tasarım sisteminin **tek kaynağıdır**. Yeni bir bileşen ihtiyacı
doğduğunda:

1. Önce bu dokümana token/ilke olarak eklenir.
2. Sonra `tailwind.config.ts` / `globals.css` güncellenir.
3. Son olarak bileşen/sayfa kodu yazılır.

Sayfa bazlı "özel istisna" stiller oluşturulmaz.
