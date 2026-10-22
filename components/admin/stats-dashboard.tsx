import { Phone } from "lucide-react"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import type { ChannelTotals, ContactStats } from "@/lib/contact-stats"

const placementLabels: Record<string, string> = {
  header: "תפריט עליון",
  footer: "תחתית העמוד",
  floating: "כפתור צף",
  content: "גוף העמוד",
}

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  timeZone: "Asia/Jerusalem",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

function TotalsCard({ label, totals }: { label: string; totals: ChannelTotals }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-3xl font-bold text-foreground">{totals.whatsapp + totals.phone}</p>
      <div className="mt-3 flex gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-[#0f7a3d]">
          <WhatsappIcon className="size-4" />
          {totals.whatsapp}
          <span className="sr-only">וואטסאפ</span>
        </span>
        <span className="flex items-center gap-1.5 text-primary">
          <Phone className="size-4" aria-hidden="true" />
          {totals.phone}
          <span className="sr-only">חיוג</span>
        </span>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 font-heading text-lg font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function Empty() {
  return <p className="text-sm text-muted-foreground">אין עדיין נתונים.</p>
}

export function StatsDashboard({ stats }: { stats: ContactStats }) {
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.whatsapp + d.phone))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <TotalsCard label="היום" totals={stats.today} />
        <TotalsCard label="7 ימים אחרונים" totals={stats.week} />
        <TotalsCard label="30 ימים אחרונים" totals={stats.month} />
        <TotalsCard label="מאז ההתחלה" totals={stats.allTime} />
      </div>

      <Section title="14 ימים אחרונים">
        <div className="flex h-40 items-end gap-1.5" role="img" aria-label="תרשים לחיצות יומי ל־14 הימים האחרונים">
          {stats.daily.map((d) => {
            const total = d.whatsapp + d.phone
            return (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs text-muted-foreground">{total || ""}</span>
                <div className="flex w-full flex-col justify-end overflow-hidden rounded-t-md" style={{ height: `${(total / maxDaily) * 100}%` }}>
                  <div className="bg-[#0f7a3d]" style={{ flexGrow: d.whatsapp }} />
                  <div className="bg-primary" style={{ flexGrow: d.phone }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-[#0f7a3d]" />וואטסאפ</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-primary" />חיוג</span>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="מאילו עמודים (30 יום)">
          {stats.byPage.length === 0 ? <Empty /> : (
            <BreakdownTable rows={stats.byPage.map((r) => ({ label: r.path === "/" ? "דף הבית" : decodeURIComponent(r.path), ...r }))} />
          )}
        </Section>
        <Section title="מאיזה כפתור (30 יום)">
          {stats.byPlacement.length === 0 ? <Empty /> : (
            <BreakdownTable rows={stats.byPlacement.map((r) => ({ label: placementLabels[r.placement] ?? r.placement, ...r }))} />
          )}
        </Section>
      </div>

      <Section title="לחיצות אחרונות">
        {stats.recent.length === 0 ? <Empty /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-start text-muted-foreground">
                  <th scope="col" className="py-2 text-start font-medium">מועד</th>
                  <th scope="col" className="py-2 text-start font-medium">ערוץ</th>
                  <th scope="col" className="py-2 text-start font-medium">עמוד</th>
                  <th scope="col" className="py-2 text-start font-medium">כפתור</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2 tabular-nums">{dateFormatter.format(new Date(r.createdAt))}</td>
                    <td className="py-2">{r.channel === "whatsapp" ? "וואטסאפ" : "חיוג"}</td>
                    <td className="max-w-48 truncate py-2" dir="ltr">{decodeURIComponent(r.path)}</td>
                    <td className="py-2">{placementLabels[r.placement] ?? r.placement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

function BreakdownTable({ rows }: { rows: { label: string; whatsapp: number; phone: number }[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-muted-foreground">
          <th scope="col" className="py-2 text-start font-medium">מקור</th>
          <th scope="col" className="py-2 text-start font-medium">וואטסאפ</th>
          <th scope="col" className="py-2 text-start font-medium">חיוג</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-border/60 last:border-0">
            <td className="max-w-48 truncate py-2">{r.label}</td>
            <td className="py-2 tabular-nums">{r.whatsapp}</td>
            <td className="py-2 tabular-nums">{r.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
