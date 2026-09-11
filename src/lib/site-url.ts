// Vercel bu değişkeni her deploy'da otomatik ayarlar; yoksa (yerel geliştirme)
// localhost'a düşer. Gerçek bir alan adı bağlanınca NEXT_PUBLIC_SITE_URL
// olarak elle de ayarlanabilir.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
