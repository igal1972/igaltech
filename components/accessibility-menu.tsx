"use client"

import { useEffect, useRef, useState } from "react"
import {
  Accessibility,
  ALargeSmall,
  CircleOff,
  Contrast,
  Link as LinkIcon,
  RotateCcw,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const COOKIE_NAME = "igaltech_accessibility"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type Preferences = {
  fontScale: number
  highContrast: boolean
  grayscale: boolean
  underlineLinks: boolean
}

const defaultPreferences: Preferences = {
  fontScale: 100,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
}

function readPreferences(): Preferences {
  const entry = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_NAME}=`))

  if (!entry) return defaultPreferences

  try {
    const parsed = JSON.parse(decodeURIComponent(entry.split("=")[1])) as Partial<Preferences>
    return {
      fontScale: [100, 112, 125].includes(parsed.fontScale ?? 100) ? parsed.fontScale ?? 100 : 100,
      highContrast: Boolean(parsed.highContrast),
      grayscale: Boolean(parsed.grayscale),
      underlineLinks: Boolean(parsed.underlineLinks),
    }
  } catch {
    return defaultPreferences
  }
}

function applyPreferences(preferences: Preferences) {
  const root = document.documentElement
  root.dataset.a11yFont = String(preferences.fontScale)
  root.classList.toggle("a11y-high-contrast", preferences.highContrast)
  root.classList.toggle("a11y-grayscale", preferences.grayscale)
  root.classList.toggle("a11y-underline-links", preferences.underlineLinks)
}

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [preferences, setPreferences] = useState(defaultPreferences)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const saved = readPreferences()
    setPreferences(saved)
    applyPreferences(saved)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    closeButtonRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isOpen])

  function updatePreferences(next: Preferences) {
    setPreferences(next)
    applyPreferences(next)
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(next))}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`
  }

  function togglePreference(key: "highContrast" | "grayscale" | "underlineLinks") {
    updatePreferences({ ...preferences, [key]: !preferences[key] })
  }

  function increaseText() {
    const scales = [100, 112, 125]
    const currentIndex = scales.indexOf(preferences.fontScale)
    updatePreferences({ ...preferences, fontScale: scales[Math.min(currentIndex + 1, scales.length - 1)] })
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden">
      {isOpen && (
        <section
          id="accessibility-panel"
          aria-labelledby="accessibility-title"
          className="mb-3 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-xl"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="accessibility-title" className="font-heading text-lg font-bold">
              כלי נגישות
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="סגירת תפריט הנגישות"
              className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={increaseText}
              disabled={preferences.fontScale === 125}
              className="flex min-h-14 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-right text-sm font-semibold transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ALargeSmall aria-hidden="true" className="size-5 shrink-0" />
              הגדלת טקסט ({preferences.fontScale}%)
            </button>
            <PreferenceButton
              active={preferences.highContrast}
              icon={Contrast}
              label="ניגודיות גבוהה"
              onClick={() => togglePreference("highContrast")}
            />
            <PreferenceButton
              active={preferences.grayscale}
              icon={CircleOff}
              label="גווני אפור"
              onClick={() => togglePreference("grayscale")}
            />
            <PreferenceButton
              active={preferences.underlineLinks}
              icon={LinkIcon}
              label="הדגשת קישורים"
              onClick={() => togglePreference("underlineLinks")}
            />
          </div>

          <button
            type="button"
            onClick={() => updatePreferences(defaultPreferences)}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            איפוס הגדרות
          </button>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={isOpen ? "סגירת תפריט הנגישות" : "פתיחת תפריט הנגישות"}
        className="flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Accessibility aria-hidden="true" className="size-7" />
      </button>
    </div>
  )
}

type PreferenceButtonProps = {
  active: boolean
  icon: typeof Contrast
  label: string
  onClick: () => void
}

function PreferenceButton({ active, icon: Icon, label, onClick }: PreferenceButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-14 items-center gap-2 rounded-xl border px-3 py-2 text-right text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-secondary",
      )}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      {label}
    </button>
  )
}
