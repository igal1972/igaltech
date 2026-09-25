"use client"

import Link from "next/link"
import { BookOpenText, Menu, X } from "lucide-react"
import { useState } from "react"
import { services } from "@/lib/services"

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "סגירת תפריט ניווט" : "פתיחת תפריט ניווט"}
      >
        {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="ניווט ראשי במובייל"
          className="absolute inset-x-0 top-16 border-b border-border bg-background px-4 py-4 shadow-lg"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            <Link
              href="/articles"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              <BookOpenText className="size-5" aria-hidden="true" />
              מאמרים ומדריכים
            </Link>
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
