import { ContactButtons } from "@/components/contact-buttons"
import { siteConfig } from "@/lib/site-config"

export function CtaSection({
  title = "צריכים פתרון מחשוב או תקשורת?",
  text,
}: {
  title?: string
  text?: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground md:px-12">
        <h2 className="mx-auto max-w-2xl text-balance font-heading text-3xl font-bold md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground">
          {text ??
            `התקשרו עכשיו או שלחו הודעת וואטסאפ לקבלת ייעוץ והצעת מחיר ללא התחייבות. שירות ${siteConfig.serviceArea}.`}
        </p>
        <ContactButtons
          className="mt-8 justify-center"
          size="lg"
          variant="onPrimary"
        />
      </div>
    </section>
  )
}
