import Link from "next/link"
import { Phone, Cpu } from "lucide-react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { siteConfig } from "@/lib/site-config"
import { services } from "@/lib/services"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Cpu className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-base font-bold text-foreground">
              {siteConfig.businessName}
            </span>
            <span className="text-xs text-muted-foreground">{siteConfig.tagline}</span>
          </span>
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden items-center gap-1 lg:flex">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {s.title}
            </Link>
          ))}
          <Link
            href="/articles"
            className="rounded-md px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
          >
            מאמרים
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <MobileNavigation />
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
          >
            <Phone className="size-4" />
            <span className="hidden sm:inline" dir="ltr">
              {siteConfig.phoneDisplay}
            </span>
            <span className="sm:hidden">חייגו</span>
          </a>
        </div>
      </div>
    </header>
  )
}
