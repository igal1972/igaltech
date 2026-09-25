import type { Metadata } from "next"
import { BookOpenText } from "lucide-react"
import { ArticleCard } from "@/components/article-card"
import { CtaSection } from "@/components/cta-section"
import { FloatingContact } from "@/components/floating-contact"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getPublishedArticles } from "@/lib/articles"

export const metadata: Metadata = {
  title: "מאמרים ומדריכים",
  description:
    "מדריכים מקצועיים על מחשבים, רשתות, שרתים, תשתיות תקשורת, מצלמות אבטחה וגיבוי בענן לעסקים ולבתים במרכז הארץ.",
  alternates: { canonical: "/articles" },
}

export const dynamic = "force-dynamic"
export const revalidate = 3600

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-secondary/60 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpenText className="size-7" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-bold tracking-wider text-primary">מרכז הידע של יגאל טכנולוגיות</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-balance text-foreground md:text-6xl">
              מדריכים שימושיים למחשוב בטוח ויציב
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              מידע מעשי על מחשוב ותחנות עבודה, תחזוקת רשתות, אבטחת מידע וגיבוי — בשפה ברורה וללא קיצורי דרך.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20" aria-labelledby="articles-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="articles-heading" className="sr-only">כל המאמרים</h2>
            {articles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <p className="text-lg text-muted-foreground">מאמרים מקצועיים חדשים יופיעו כאן בקרוב.</p>
              </div>
            )}
          </div>
        </section>
        <CtaSection />
      </main>
      <SiteFooter />
      <FloatingContact />
    </div>
  )
}
