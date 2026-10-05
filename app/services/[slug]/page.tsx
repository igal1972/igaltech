import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ArrowRight, ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingContact } from "@/components/floating-contact"
import { ContactButtons } from "@/components/contact-buttons"
import { CtaSection } from "@/components/cta-section"
import { services, getService } from "@/lib/services"
import { siteConfig } from "@/lib/site-config"
import { JsonLd, breadcrumbSchema, serviceSchema } from "@/components/json-ld"

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return { title: "התחום לא נמצא" }
  return {
    title: service.title,
    description: service.intro,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "website",
      locale: "he_IL",
      url: `/services/${service.slug}`,
      title: service.title,
      description: service.intro,
    },
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const Icon = service.icon
  const others = services.filter((s) => s.slug !== service.slug)
  const breadcrumb = breadcrumbSchema([
    { name: "דף הבית", url: siteConfig.siteUrl },
    { name: service.title, url: `${siteConfig.siteUrl}/services/${service.slug}` },
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumb} />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Breadcrumb + hero */}
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <nav aria-label="פירורי לחם" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-primary">
                דף הבית
              </Link>
              <ArrowLeft className="size-3.5" />
              <span className="text-foreground">{service.title}</span>
            </nav>
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-6 lg:grid-cols-2">
            <div>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Icon className="size-7" />
              </span>
              <h1 className="mt-6 text-balance font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {service.intro}
              </p>
              <ContactButtons
                className="mt-8"
                size="lg"
                message={`שלום, אשמח לקבל פרטים לגבי ${service.title}.`}
              />
            </div>

            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/5">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-balance font-heading text-3xl font-bold text-foreground">
            מה כולל השירות?
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-4" />
                </span>
                <span className="text-sm leading-relaxed text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Process */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <h2 className="text-balance font-heading text-3xl font-bold text-foreground">
              איך זה עובד?
            </h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, i) => (
                <li key={step.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <CtaSection
          title={`מעוניינים בשירות ${service.title}?`}
          text={`התקשרו או שלחו הודעת וואטסאפ לקבלת ייעוץ והצעת מחיר ללא התחייבות. שירות ${siteConfig.serviceArea}.`}
        />

        {/* Other services */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
          <h2 className="text-balance font-heading text-2xl font-bold text-foreground">
            תחומים נוספים
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => {
              const OtherIcon = s.icon
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <OtherIcon className="size-5" />
                  </span>
                  <span className="flex-1 font-heading text-sm font-semibold text-foreground">
                    {s.title}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingContact />
    </div>
  )
}
