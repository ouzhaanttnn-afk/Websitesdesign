import type { PriceProvider, PriceSnapshot } from "./types";

/**
 * Birincil (canlı) sağlayıcı başarısız olursa (ağ hatası, zaman aşımı,
 * kaynak sitenin yapısı değişti vb.) sessizce yedek sağlayıcıya döner.
 * Fiyatlar sayfası bu sayede asla kırılmaz — en kötü ihtimalle "Demo veri"
 * etiketiyle döner.
 */
export class ResilientPriceProvider implements PriceProvider {
  constructor(
    private readonly primary: PriceProvider,
    private readonly fallback: PriceProvider,
  ) {}

  async getSnapshot(): Promise<PriceSnapshot> {
    try {
      return await this.primary.getSnapshot();
    } catch (error) {
      console.error("[prices] Birincil kaynağa ulaşılamadı, demo veriye dönülüyor:", error);
      return this.fallback.getSnapshot();
    }
  }
}
