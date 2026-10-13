import Image from "next/image"
import { ShieldCheck, Clock, MapPin } from "lucide-react"
import { ContactButtons } from "@/components/contact-buttons"
import { siteConfig } from "@/lib/site-config"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <MapPin className="size-3.5 text-primary" />
            פעילות {siteConfig.serviceArea} · לבית ולעסק
          </span>

          <h1 className="mt-5 text-balance font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
            שירותי מחשוב ותקשורת לעסקים ולבית {siteConfig.serviceArea}
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            טכנאי מחשבים ותקשורת שמגיע אליכם: תחזוקת מחשבים ותחנות עבודה, ניהול רשת לעסקים,
            התקנת שרתים, תשתיות תקשורת IP, התקנת מצלמות אבטחה וגיבוי בענן. ליווי מקצועי ואישי
            מתחילת הפרויקט ועד התחזוקה השוטפת.
          </p>

          <ContactButtons className="mt-8" size="lg" />

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
