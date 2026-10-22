import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/admin/login-form"
import { StatsDashboard } from "@/components/admin/stats-dashboard"
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth"
import { getContactStats } from "@/lib/contact-stats"
import { logout } from "./actions"

export const metadata: Metadata = {
  title: "ניהול – סטטיסטיקת פניות",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <AdminShell>
        <p className="text-muted-foreground">דף הניהול עדיין לא הוגדר. יש להגדיר סיסמת ניהול (ADMIN_PASSWORD).</p>
      </AdminShell>
    )
  }

  if (!(await isAdminAuthenticated())) {
    return (
      <AdminShell>
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">כניסה לדף הניהול</h1>
          <p className="mb-6 text-sm text-muted-foreground">הזינו את סיסמת הניהול כדי לצפות בסטטיסטיקת הפניות.</p>
          <LoginForm />
        </div>
      </AdminShell>
    )
  }

  const stats = await getContactStats()

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">סטטיסטיקת פניות מהאתר</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            לחיצות על כפתורי החיוג והוואטסאפ. הנתונים אנונימיים ואינם כוללים פרטים מזהים.
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            יציאה
          </button>
        </form>
      </div>
      <StatsDashboard stats={stats} />
    </AdminShell>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-6 inline-block text-sm text-primary hover:underline">
          חזרה לאתר
        </Link>
        {children}
      </div>
    </main>
  )
}
