import { getPublishedArticles } from "@/lib/articles"
import { services } from "@/lib/services"
import { siteConfig } from "@/lib/site-config"

export const revalidate = 3600

export async function GET() {
  const articles = await getPublishedArticles(50).catch(() => [])
  const url = siteConfig.siteUrl

  const lines = [
    `# ${siteConfig.businessName} (IgalTech)`,
    "",
    `> ${siteConfig.businessName} היא עסק שירותי IT ${siteConfig.serviceArea}, ישראל, המספק לבתים ולעסקים: מחשוב ותחנות עבודה, ניהול רשת, התקנת שרתים, תשתיות תקשורת IP, מצלמות אבטחה וגיבוי בענן.`,
    "",
    "## פרטי העסק",
    `- שם: ${siteConfig.businessName} (IgalTech)`,
    `- תחום: שירותי מחשוב, רשתות ואבטחת מידע`,
    `- אזור שירות: מרכז הארץ, ישראל`,
    `- טלפון: ${siteConfig.phoneDisplay} (${siteConfig.phoneTel})`,
    `- וואטסאפ: https://wa.me/${siteConfig.whatsapp}`,
    `- אימייל: ${siteConfig.email}`,
    `- שעות פעילות: ראשון עד חמישי, 08:00–19:00`,
    `- אתר: ${url}`,
    "",
    "## שירותים",
    ...services.map(
      (s) => `- [${s.title}](${url}/services/${s.slug}): ${s.short} עיקרי השירות: ${s.features.join("; ")}.`,
    ),
    "",
    "## מאמרים מקצועיים",
    `- [כל המאמרים](${url}/articles): מדריכים וטיפים בנושאי מחשוב, רשתות, שרתים, מצלמות וגיבוי.`,
    ...articles.map((a) => `- [${a.title}](${url}/articles/${a.slug}): ${a.excerpt}`),
    "",
    "## מידע נוסף",
    `- [מפת אתר](${url}/sitemap.xml)`,
    `- [הצהרת נגישות](${url}/accessibility)`,
    `- [מדיניות פרטיות](${url}/privacy)`,
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
