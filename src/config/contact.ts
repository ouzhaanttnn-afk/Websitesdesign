const phoneDisplay = "+90 312 390 24 25";
const phoneDigits = "903123902425";

// Mağaza sabit hattından farklı, ayrı bir WhatsApp/cep numarası (kartvizit).
const whatsappDisplay = "+90 533 485 30 40";
const whatsappDigits = "905334853040";

export const contact = {
  phoneDisplay,
  phoneHref: `tel:+${phoneDigits}`,
  whatsappDisplay,
  whatsappHref: `https://wa.me/${whatsappDigits}`,
  instagramHandle: "@alvera_kuyumculuk",
  instagramHref: "https://instagram.com/alvera_kuyumculuk",
} as const;
