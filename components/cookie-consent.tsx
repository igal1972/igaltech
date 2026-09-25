"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Analytics } from "@vercel/analytics/next"
import { Cookie } from "lucide-react"

const COOKIE_NAME = "igaltech_cookie_consent"
type Consent = "approved"

function readConsent(): Consent | null {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
  const value = match?.split("=")[1]
  return value === "approved" || value === "analytics" ? "approved" : null
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const current = readConsent()
    setConsent(current)
    setIsOpen(current === null)

    const openSettings = () => setIsOpen(true)
    window.addEventListener("open-cookie-settings", openSettings)
    return () => window.removeEventListener("open-cookie-settings", openSettings)
  }, [])

  function saveConsent(value: Consent) {
    document.cookie = `${COOKIE_NAME}=${value}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`
    setConsent(value)
    setIsOpen(false)
  }

  return (
    <>
      {process.env.NODE_ENV === "production" && consent === "approved" && <Analytics />}
      {isOpen && (
        <section
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xl md:flex md:items-center md:gap-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-description"
        >
          <div className="flex min-w-0 flex-1 gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <Cookie className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="cookie-title" className="font-heading text-lg font-bold">שימוש בעוגיות באתר</h2>
              <p id="cookie-description" className="mt-1 text-sm leading-relaxed text-muted-foreground">
                האתר משתמש בעוגיות חיוניות ובניתוח שימוש אנונימי-מצטבר לצורך תפעולו ושיפור חוויית הגלישה. המשך השימוש כפוף ל<Link href="/privacy" className="font-semibold text-primary hover:underline">מדיניות הפרטיות</Link>.
              </p>
            </div>
          </div>
          <div className="mt-5 flex shrink-0 md:mt-0">
            <button
              type="button"
              onClick={() => saveConsent("approved")}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              אישור
            </button>
          </div>
        </section>
      )}
    </>
  )
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
    >
      הגדרות עוגיות
    </button>
  )
}
