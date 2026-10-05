import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Clock3 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { CtaSection } from "@/components/cta-section"
import { FloatingContact } from "@/components/floating-contact"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getArticleBySlug, normalizeArticleContent } from "@/lib/articles"
import { services } from "@/lib/services"
import { siteConfig } from "@/lib/site-config"

export const dynamic = "force-dynamic"
export const revalidate = 3600

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const categoryServiceSlugs: Record<string, string> = {
  "טכנאי מחשבים": "computers",
  "טכנאות מחשבים": "computers",
  "ניהול רשת": "network",
  "התקנת שרתים": "servers",
  "תשתיות תקשורת IP": "ip-infrastructure",
  "מצלמות אבטחה": "security-cameras",
  "גיבוי בענן": "cloud-backup",
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "he_IL",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt.toISOString(),
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const serviceSlug = article.serviceSlug ?? categoryServiceSlugs[article.category]
  const service = services.find((item) => item.slug === serviceSlug)
  const normalizedContent = normalizeArticleContent(article.content)
  const pageUrl = `${siteConfig.siteUrl}/articles/${article.slug}`
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.createdAt.toISOString(),
    image: `${siteConfig.siteUrl}/og-image.png`,
    inLanguage: "he-IL",
    author: { "@type": "Organization", name: siteConfig.businessName },
    publisher: { "@type": "Organization", name: siteConfig.businessName, url: siteConfig.siteUrl },
    mainEntityOfPage: pageUrl,
  }
  const faqSchema = article.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "דף הבית", item: siteConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: "מאמרים", item: `${siteConfig.siteUrl}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <article>
          <header className="border-b border-border bg-secondary/60 py-14 md:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <Link href="/articles" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                <ArrowRight className="size-4" aria-hidden="true" />
                חזרה לכל המאמרים
              </Link>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="rounded-full bg-card px-3 py-1 font-medium text-foreground shadow-sm">{article.category}</span>
                <time dateTime={article.publishedAt.toISOString()}>{dateFormatter.format(article.publishedAt)}</time>
                <span className="flex items-center gap-2"><Clock3 className="size-4" aria-hidden="true" />{article.readTime}</span>
              </div>
              <h1 className="mt-5 font-heading text-4xl font-bold text-balance text-foreground md:text-6xl">{article.title}</h1>
              <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{article.excerpt}</p>
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="article-content text-foreground">
              <ReactMarkdown>{normalizedContent}</ReactMarkdown>
            </div>

            {article.faq.length > 0 && (
              <section className="mt-14 border-t border-border pt-10" aria-labelledby="faq-title">
                <h2 id="faq-title" className="font-heading text-3xl font-bold text-foreground">שאלות נפוצות</h2>
                <div className="mt-6 flex flex-col gap-4">
                  {article.faq.map((item) => (
                    <details key={item.question} className="rounded-xl border border-border bg-card p-5">
                      <summary className="cursor-pointer font-heading text-lg font-bold text-foreground">{item.question}</summary>
                      <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {service && (
              <aside className="mt-12 rounded-2xl bg-secondary p-6 md:p-8" aria-label="שירות קשור">
                <p className="text-sm font-bold text-primary">צריכים עזרה מקצועית?</p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">{service.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{service.short}</p>
                <Link href={`/services/${service.slug}`} className="mt-5 inline-flex font-bold text-primary hover:underline">לפרטי השירות</Link>
              </aside>
            )}
          </div>
        </article>
        <CtaSection />
      </main>
      <SiteFooter />
      <FloatingContact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </div>
  )
}
