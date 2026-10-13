import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingContact } from "@/components/floating-contact"
import { Hero } from "@/components/home/hero"
import { ServicesOverview } from "@/components/home/services-overview"
import { WhyUs } from "@/components/home/why-us"
import { CtaSection } from "@/components/cta-section"
import { JsonLd, localBusinessSchema } from "@/components/json-ld"
import { services } from "@/lib/services"
import { siteConfig } from "@/lib/site-config"

const homeTitle = `שירותי מחשוב ותקשורת לעסקים ${siteConfig.serviceArea} | ${siteConfig.businessName}`
const homeDescription =
  "טכנאי מחשבים ותקשורת לעסק ולבית במרכז: ניהול רשת, התקנת שרתים, מצלמות אבטחה וגיבוי בענן. התקשרו או שלחו וואטסאפ להצעת מחיר ללא התחייבות."

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: { title: homeTitle, description: homeDescription, url: "/" },
  twitter: { title: homeTitle, description: homeDescription },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.businessName,
  url: siteConfig.siteUrl,
  inLanguage: "he-IL",
}

const offerCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: `שירותי ${siteConfig.businessName}`,
  itemListElement: services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.title,
      description: service.short,
      url: `${siteConfig.siteUrl}/services/${service.slug}`,
    },
  })),
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <ServicesOverview />
        <WhyUs />
        <CtaSection />
      </main>
      <SiteFooter />
      <FloatingContact />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={offerCatalogSchema} />
    </div>
  )
}
