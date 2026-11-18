import Image from "next/image"
import { ShieldCheck, Clock, MapPin, CalendarCheck } from "lucide-react"
import { ContactButtons } from "@/components/contact-buttons"
import { formatShekel, siteConfig } from "@/lib/site-config"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <MapPin className="size-3.5 text-primary" />
            פעילות {siteConfig.serviceArea} · לבית ולעסק
          </span>

          <h1 className="mt-5 font-heading text-3xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
            <span className="block">טכנאי מחשבים ורשתות,</span>{" "}
            <span className="block">טכנאי תשתיות תקשורת,</span>{" "}
            <span className="block">ומתקין מצלמות אבטחה</span>{" "}
            <span className="mt-1 block text-primary">{siteConfig.serviceArea}</span>
          </h1>
          <div className="mt-5 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {siteConfig.businessName} מספקת שירותי מחשוב ותקשורת לעסקים ולבתים {siteConfig.serviceArea}:
            תיקון ותחזוקת מחשבים ותחנות עבודה, הקמה וניהול של רשתות מחשבים, התקנת שרתים,
            תשתיות תקשורת IP, התקנת מצלמות אבטחה וגיבוי בענן. טכנאי שמגיע אליכם, עם ליווי
            מקצועי ואישי מתחילת הפרויקט ועד התחזוקה השוטפת.
          </p>

          <ContactButtons className="mt-8" size="lg" />

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarCheck className="size-4 text-primary" aria-hidden="true" />
            הזמנת טכנאי אונליין · ביקור ואבחון {formatShekel(siteConfig.diagnosisFee)} + מע״מ, מתקזז בעלות התיקון
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              אחריות על העבודה
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              זמינות ומענה מהיר
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              שירות עד הבית והעסק
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/5">
            <Image
              src="/hero-it.webp"
              alt={`תחנות עבודה וארון תקשורת מסודר עם כבילת רשת ושרתים — שירותי מחשוב ותקשורת לעסקים ${siteConfig.serviceArea}`}
              fill
              priority
              fetchPriority="high"
              quality={78}
              className="object-cover"
              sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 736px, 560px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
