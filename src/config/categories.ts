export interface Category {
  slug: string;
  label: string;
  description: string;
  imageAlt: string;
}

/**
 * Gerçek koleksiyon/ürün verisi henüz mevcut değil. Bu liste kolayca
 * güncellenebilir tek bir noktadır — yeni kategori eklemek veya metni
 * değiştirmek için sadece bu dosya düzenlenir.
 */
export const categories: Category[] = [
  {
    slug: "altin",
    label: "Altın",
    description: "Günlük ve özel gün için zamansız altın parçalar.",
    imageAlt: "Alvera Kuyumculuk altın koleksiyonu görseli",
  },
  {
    slug: "pirlanta",
    label: "Pırlanta",
    description: "Seçilmiş taşlarla hazırlanan pırlanta tasarımlar.",
    imageAlt: "Alvera Kuyumculuk pırlanta koleksiyonu görseli",
  },
  {
    slug: "bilezik",
    label: "Bilezik",
    description: "Yatırımlık ve günlük kullanım için bilezik modelleri.",
    imageAlt: "Alvera Kuyumculuk bilezik koleksiyonu görseli",
  },
  {
    slug: "kolye",
    label: "Kolye",
    description: "İnce işçilikle hazırlanmış kolye ve pandantifler.",
    imageAlt: "Alvera Kuyumculuk kolye koleksiyonu görseli",
  },
  {
    slug: "yuzuk",
    label: "Yüzük",
    description: "Alyanslardan özel tasarım yüzüklere geniş bir seçki.",
    imageAlt: "Alvera Kuyumculuk yüzük koleksiyonu görseli",
  },
  {
    slug: "kupe",
    label: "Küpe",
    description: "Sade ve iddialı modellerle tamamlayıcı detaylar.",
    imageAlt: "Alvera Kuyumculuk küpe koleksiyonu görseli",
  },
  {
    slug: "saat",
    label: "Saat",
    description: "Seçkin markalardan zamansız saat modelleri.",
    imageAlt: "Alvera Kuyumculuk saat koleksiyonu görseli",
  },
];
