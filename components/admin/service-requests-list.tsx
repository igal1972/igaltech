import { Mail, MapPin, Phone } from "lucide-react"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { services } from "@/lib/services"
import type { ServiceRequestRow } from "@/lib/service-requests"

const timeWindowLabels: Record<string, string> = {
  morning: "בוקר",
  noon: "צהריים",
  afternoon: "אחה״צ",
  flexible: "גמיש",
}

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  timeZone: "Asia/Jerusalem",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

function serviceTitle(slug: string) {
  return services.find((s) => s.slug === slug)?.title ?? "אחר"
}

export function ServiceRequestsList({ requests }: { requests: ServiceRequestRow[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 font-heading text-lg font-bold text-foreground">הזמנות שירות ({requests.length})</h2>
      {requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">אין עדיין הזמנות.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {requests.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">
                  {r.fullName}
                  <span className="ms-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {serviceTitle(r.serviceSlug)}
                  </span>
                </p>
                <time dateTime={r.createdAt} className="text-xs text-muted-foreground">
                  {dateFormatter.format(new Date(r.createdAt))}
                </time>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{r.description}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <a href={`tel:${r.phone}`} className="flex items-center gap-1.5 text-primary hover:underline" dir="ltr">
                  <Phone className="size-4" aria-hidden="true" />
                  {r.phone}
                </a>
                <a
                  href={`https://wa.me/972${r.phone.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#0f7a3d] hover:underline"
                >
                  <WhatsappIcon className="size-4" />
                  וואטסאפ
                </a>
                {r.email && (
                  <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 hover:underline">
                    <Mail className="size-4" aria-hidden="true" />
                    {r.email}
                  </a>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden="true" />
                  {r.address}, {r.city}
                </span>
                <span>
                  מועד מועדף: {r.preferredDate ?? "לא צוין"} · {timeWindowLabels[r.timeWindow ?? ""] ?? "—"}
                </span>
                {r.marketingConsent && <span className="text-primary">אישר/ה דיוור</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
