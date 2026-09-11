const phoneDisplay = "+90 312 390 24 25";
const phoneDigits = "903123902425";

export const contact = {
  phoneDisplay,
  phoneHref: `tel:+${phoneDigits}`,
  whatsappHref: `https://wa.me/${phoneDigits}`,
  instagramHandle: "@alvera_kuyumculuk",
  instagramHref: "https://instagram.com/alvera_kuyumculuk",
} as const;
