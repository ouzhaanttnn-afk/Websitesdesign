const TR_MAP: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
};

export function slugify(input: string): string {
  const ascii = input
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .toLowerCase();
  return ascii
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** slug çakışırsa kısa bir rastgele son ek ekler. */
export function uniqueSlug(base: string, exists: (candidate: string) => boolean): string {
  const root = slugify(base) || "urun";
  if (!exists(root)) return root;
  for (let i = 2; i < 50; i++) {
    const candidate = `${root}-${i}`;
    if (!exists(candidate)) return candidate;
  }
  return `${root}-${Date.now()}`;
}
