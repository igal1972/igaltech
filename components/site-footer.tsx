import Link from "next/link"
import { Phone, Mail, MapPin, Cpu } from "lucide-react"
import { CookieSettingsButton } from "@/components/cookie-consent"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { siteConfig, whatsappLink } from "@/lib/site-config"
import { services } from "@/lib/services"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cpu className="size-5" />
            </span>
            <span className="font-heading text-base font-bold text-foreground">
              {siteConfig.businessName}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline}. שירות מקצועי, מהיר ואמין {siteConfig.serviceArea} — לבית ולעסק.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">התחומים שלנו</h3>
          <ul className="mt-4 space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">יצירת קשר</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a href={`tel:${siteConfig.phoneTel}`} className="flex items-center gap-2 transition-colors hover:text-primary">
                <Phone className="size-4 text-primary" />
                <span dir="ltr">{siteConfig.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <WhatsappIcon className="size-4 text-[#25D366]" />
                <span>וואטסאפ</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              <span dir="ltr">{siteConfig.email}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>שירות {siteConfig.serviceArea}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.businessName}
            {siteConfig.businessId ? ` (ע.מ. ${siteConfig.businessId})` : ""}. כל הזכויות שמורות.
          </p>
          <nav aria-label="קישורי מידע ומשפט" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/articles" className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline">מאמרים</Link>
            <Link href="/accessibility" className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline">הצהרת נגישות</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline">מדיניות פרטיות</Link>
            <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline">תקנון שימוש</Link>
            <CookieSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  )
}
