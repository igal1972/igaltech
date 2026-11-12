import type { Metadata } from "next"
import { CalendarCheck, Receipt, Wrench } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingForm } from "@/components/booking/booking-form"
import { services } from "@/lib/services"
import { diagnosisFeeBreakdown, formatShekel, siteConfig } from "@/lib/site-config"

const fee = diagnosisFeeBreakdown()

export const metadata: Metadata = {
  title: `הזמנת טכנאי עד הבית והעסק ${siteConfig.serviceArea}`,
  description: `הזמינו ביקור טכנאי מחשבים, רשתות, תשתיות תקשורת או מצלמות אבטחה ${siteConfig.serviceArea}. ביקור ואבחון תקלה ב־${formatShekel(fee.net)} + מע״מ, שמתקזזים מעלות התיקון.`,
  alternates: { canonical: "/book" },
}

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  const defaultService = services.some((s) => s.slug === service) ? service : undefined
  const minDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date())

  return (
    <>
      <SiteHeader />
      <main className="bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:py-16 lg:grid-cols-[1fr_22rem]">
          <div className="flex flex-col gap-6">
            <header>
              <h1 className="text-balance font-heading text-3xl font-bold text-foreground md:text-4xl">
                הזמנת טכנאי לביקור ואבחון תקלה
              </h1>
              <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                מלאו את הפרטים ונחזור אליכם לתיאום מועד. הטכנאי מגיע אליכם הביתה או לעסק {siteConfig.serviceArea},
                מאבחן את התקלה ונותן הצעת מחיר מדויקת לתיקון לפני שמתחילים לעבוד.
              </p>
            </header>
            <BookingForm
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              defaultService={defaultService}
              minDate={minDate}
              feeLabel={`${formatShekel(fee.net)} + מע״מ`}
            />
          </div>

          <aside aria-labelledby="fee-title" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm">
              <h2 id="fee-title" className="font-heading text-lg font-bold text-foreground">
                עלות ביקור ואבחון
              </h2>
              <p className="mt-3 font-heading text-4xl font-bold text-primary">
                {formatShekel(fee.net)}
                <span className="ms-1 text-base font-medium text-muted-foreground">+ מע״מ</span>
              </p>
              <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ביקור ואבחון</dt>
                  <dd className="font-medium text-foreground">{formatShekel(fee.net)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">מע״מ ({fee.vatPercent}%)</dt>
                  <dd className="font-medium text-foreground">{formatShekel(fee.vat)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <dt className="font-semibold text-foreground">סה״כ לתשלום</dt>
                  <dd className="font-bold text-foreground">{formatShekel(fee.total)}</dd>
                </div>
              </dl>

              <ul className="mt-6 flex flex-col gap-4 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <Wrench className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <strong className="text-foreground">מתקזז מעלות התיקון.</strong>{" "}
                    <span className="text-muted-foreground">אם תאשרו את ביצוע התיקון, עלות הביקור מקוזזת מהמחיר הסופי.</span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Receipt className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground">התשלום מתבצע במקום, בסיום הביקור, וכנגדו תונפק חשבונית מס.</span>
                </li>
                <li className="flex gap-3">
                  <CalendarCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground">
                    ההזמנה אינה מחייבת עד לתיאום טלפוני של המועד, וניתן לבטל ללא עלות עד לתחילת הביקור.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
