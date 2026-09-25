import type { ReactNode } from "react"
import { FloatingContact } from "@/components/floating-contact"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

type LegalPageProps = {
  title: string
  description: string
  updatedAt: string
  children: ReactNode
}

export function LegalPage({ title, description, updatedAt, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <header className="border-b border-border bg-secondary/60 py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-bold text-primary">מידע משפטי ושקיפות</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-balance text-foreground md:text-5xl">{title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{description}</p>
            <p className="mt-4 text-sm text-muted-foreground">עודכן לאחרונה: {updatedAt}</p>
          </div>
        </header>
        <div className="legal-content mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">{children}</div>
      </main>
      <SiteFooter />
      <FloatingContact />
    </div>
  )
}
