import type { MetadataRoute } from "next"
import { getPublishedArticleSlugs } from "@/lib/articles"
import { services } from "@/lib/services"
import { siteConfig } from "@/lib/site-config"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticleSlugs()
  const now = new Date()

  return [
    { url: siteConfig.siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.siteUrl}/articles`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...services.map((service) => ({
      url: `${siteConfig.siteUrl}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${siteConfig.siteUrl}/articles/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
