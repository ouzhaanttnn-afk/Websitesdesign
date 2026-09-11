import type { MetadataRoute } from "next";
import { primaryNav } from "@/config/navigation";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return primaryNav.map((item) => ({
    url: `${siteUrl}${item.href}`,
    lastModified: new Date(),
    changeFrequency: item.href === "/fiyatlar" ? "daily" : "weekly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
