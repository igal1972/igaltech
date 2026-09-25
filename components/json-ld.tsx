import { siteConfig } from "@/lib/site-config"

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.siteUrl}/#business`,
  name: siteConfig.businessName,
  description: `${siteConfig.businessName} — מחשוב ותחנות עבודה, ניהול רשת, התקנת שרתים, תשתיות תקשורת IP, מצלמות אבטחה וגיבוי בענן. לבית ולעסק ${siteConfig.serviceArea}.`,
  url: siteConfig.siteUrl,
  telephone: siteConfig.phoneTel,
  email: siteConfig.email,
  image: `${siteConfig.siteUrl}/og-image.png`,
  priceRange: "₪₪",
  areaServed: { "@type": "Place", name: "מרכז הארץ, ישראל" },
  address: {
    "@type": "PostalAddress",
    addressRegion: "מרכז",
    addressCountry: "IL",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "08:00",
    closes: "19:00",
  },
  sameAs: [] as string[],
} satisfies Record<string, unknown>

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function serviceSchema(service: {
  title: string
  intro: string
  slug: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.intro,
    url: `${siteConfig.siteUrl}/services/${service.slug}`,
    serviceType: service.title,
    areaServed: { "@type": "Place", name: "מרכז הארץ, ישראל" },
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.businessName,
      telephone: siteConfig.phoneTel,
      url: siteConfig.siteUrl,
    },
  }
}
