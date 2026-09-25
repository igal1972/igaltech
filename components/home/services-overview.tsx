import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { services } from "@/lib/services"

export function ServicesOverview() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-3xl font-bold text-foreground md:text-4xl">
          התחומים שלנו
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          מגוון תחומי מחשוב ותקשורת תחת קורת גג אחת. בחרו תחום לפרטים מלאים.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.short}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                לפרטים נוספים
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
