export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Koleksiyonlar", href: "/koleksiyonlar" },
  { label: "Fiyatlar", href: "/fiyatlar" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];
