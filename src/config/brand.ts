export const brand = {
  name: "Alvera Kuyumculuk",
  shortName: "Alvera",
  tagline: "Zarafet ve güvenin adresi.",
  description:
    "Mamak, Ankara'da altın, pırlanta, mücevher ve saat üzerine premium bir kuyumculuk adresi.",
  locationLabel: "Mamak / Ankara",
  // Kartvizitten doğrulandı.
  addressLine: "Cengizhan Mahallesi, Natoyolu Cad. No: 209/C, Mamak / Ankara",
  // Yapısal veri (JSON-LD) için aynı adresin bileşenleri — addressLine ile senkron tutulmalı.
  address: {
    streetAddress: "Cengizhan Mahallesi, Natoyolu Cad. No: 209/C",
    addressLocality: "Mamak",
    addressRegion: "Ankara",
    addressCountry: "TR",
  },
  // Doğrulanmış çalışma saatleri bilgisi elimizde yok — placeholder.
  workingHours: "Çalışma saatleri yakında eklenecek",
} as const;
