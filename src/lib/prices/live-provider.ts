import type { PriceProvider, PriceQuote, PriceQuoteId, PriceSnapshot } from "./types";

/**
 * ozandoviz.com'un kendi ön yüzünün kullandığı, dokümante edilmemiş
 * uç noktaları (kimlik doğrulama gerektirmiyor, robots.txt kısıtlaması
 * yok — bkz. tarayıcıdan `assets` içindeki inline script). Resmi bir
 * public API DEĞİLDİR; site kendi sayfa yapısını değiştirirse bu entegrasyon
 * bozulabilir. Bu yüzden her zaman `ResilientPriceProvider` ile
 * sarmalanmalı (bkz. index.ts) — hata durumunda sessizce demo veriye döner.
 *
 * Kendi sitelerinde 30 saniyede bir sorguluyorlar; biz nazik bir tüketici
 * olmak için Next.js'in fetch cache'i üzerinden 60 saniyede bir tazeliyoruz
 * (bkz. `next: { revalidate: 60 }`) — her sayfa isteğinde yeniden çekmiyoruz.
 */
const BASE_URL = "https://ozandoviz.com";
const SOURCE_NAME = "Ozan Döviz";
const REQUEST_TIMEOUT_MS = 5000;
const REVALIDATE_SECONDS = 60;

interface RawEntry {
  code: string;
  alis: string;
  satis: string;
}

interface RawResponse {
  data: Record<string, RawEntry>;
}

interface QuotePick {
  id: PriceQuoteId;
  label: string;
  unit: string;
  endpoint: string;
  key: string;
}

const PICKS: QuotePick[] = [
  { id: "has-altin", label: "Has Altın", unit: "TRY / gr", endpoint: "centergoldpagedata.php", key: "ALTIN" },
  { id: "gram-altin", label: "Gram Altın", unit: "TRY / gr", endpoint: "centergramgoldpagedata.php", key: "gram13" },
  { id: "ceyrek-altin", label: "Çeyrek Altın", unit: "TRY / adet", endpoint: "centersarrafiyepagedata.php", key: "stl1" },
  { id: "yarim-altin", label: "Yarım Altın", unit: "TRY / adet", endpoint: "centersarrafiyepagedata.php", key: "stl3" },
  { id: "tam-altin", label: "Tam Altın", unit: "TRY / adet", endpoint: "centersarrafiyepagedata.php", key: "stl5" },
  { id: "ata-besli", label: "Ata Beşli", unit: "TRY / adet", endpoint: "centersarrafiyepagedata.php", key: "stl11" },
  { id: "usd", label: "Dolar", unit: "TRY", endpoint: "centerpagedata.php", key: "USDTRY" },
  { id: "eur", label: "Euro", unit: "TRY", endpoint: "centerpagedata.php", key: "EURTRY" },
];

/** Kaynak sayıları "1,234.56" (virgül binlik, nokta ondalık) formatında döner. */
function parseAmount(raw: string): number {
  const value = Number.parseFloat(raw.replace(/,/g, ""));
  if (Number.isNaN(value)) {
    throw new Error(`Ozan Döviz'den beklenmeyen sayı formatı: "${raw}"`);
  }
  return value;
}

async function fetchEndpoint(path: string): Promise<RawResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "select=true",
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      throw new Error(`Ozan Döviz isteği başarısız: ${path} (HTTP ${res.status})`);
    }

    return (await res.json()) as RawResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export class OzanDovizPriceProvider implements PriceProvider {
  async getSnapshot(): Promise<PriceSnapshot> {
    const endpoints = Array.from(new Set(PICKS.map((pick) => pick.endpoint)));
    const responses = await Promise.all(endpoints.map((endpoint) => fetchEndpoint(endpoint)));
    const dataByEndpoint = new Map(endpoints.map((endpoint, i) => [endpoint, responses[i]]));

    const quotes: PriceQuote[] = PICKS.map((pick) => {
      const entry = dataByEndpoint.get(pick.endpoint)?.data[pick.key];
      if (!entry) {
        throw new Error(`Ozan Döviz yanıtında beklenen kalem bulunamadı: ${pick.endpoint} / ${pick.key}`);
      }
      return {
        id: pick.id,
        label: pick.label,
        buy: parseAmount(entry.alis),
        sell: parseAmount(entry.satis),
        unit: pick.unit,
      };
    });

    return {
      quotes,
      updatedAt: new Date().toISOString(),
      isLive: true,
      source: SOURCE_NAME,
    };
  }
}
