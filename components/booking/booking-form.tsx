"use client"

import Link from "next/link"
import { useActionState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { submitServiceRequest, type BookingField, type BookingState } from "@/app/book/actions"
import { cn } from "@/lib/utils"

type ServiceOption = { slug: string; title: string }

const timeWindowOptions = [
  { value: "morning", label: "בוקר (08:00–12:00)" },
  { value: "noon", label: "צהריים (12:00–15:00)" },
  { value: "afternoon", label: "אחר הצהריים (15:00–19:00)" },
  { value: "flexible", label: "גמיש" },
]

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"

function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: BookingField
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            {" *"}
          </span>
        ) : (
          <span className="font-normal text-muted-foreground"> (לא חובה)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function describedBy(id: string, error?: string, hint?: boolean) {
  if (error) return `${id}-error`
  return hint ? `${id}-hint` : undefined
}

export function BookingForm({
  services,
  defaultService,
  minDate,
  feeLabel,
}: {
  services: ServiceOption[]
  defaultService?: string
  minDate: string
  feeLabel: string
}) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(submitServiceRequest, {})
  const errors = state.errors ?? {}
  const values = state.values ?? {}

  if (state.ok) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="size-12 text-primary" aria-hidden="true" />
        <h2 className="font-heading text-2xl font-bold text-foreground">ההזמנה התקבלה</h2>
        <p className="max-w-md leading-relaxed text-muted-foreground">
          תודה! נחזור אליכם בהקדם בטלפון כדי לתאם מועד מדויק לביקור הטכנאי. עלות הביקור והאבחון ({feeLabel})
          תשולם במקום ותקוזז מעלות התיקון אם תאשרו את ביצועו.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-medium text-primary hover:underline"
        >
          שליחת הזמנה נוספת
        </button>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
    >
      {state.message && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-heading text-lg font-bold text-foreground">פרטי קשר</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="fullName" label="שם מלא" required error={errors.fullName}>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              defaultValue={values.fullName}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={describedBy("fullName", errors.fullName)}
              className={inputClass}
            />
          </Field>
          <Field id="phone" label="טלפון" required error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              required
              placeholder="050-0000000"
              defaultValue={values.phone}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy("phone", errors.phone)}
              className={cn(inputClass, "text-right")}
            />
          </Field>
          <Field id="email" label="דוא״ל" error={errors.email} className="sm:col-span-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              defaultValue={values.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy("email", errors.email)}
              className={cn(inputClass, "text-right")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-heading text-lg font-bold text-foreground">כתובת הביקור</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="city" label="עיר" required error={errors.city}>
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              required
              defaultValue={values.city}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={describedBy("city", errors.city)}
              className={inputClass}
            />
          </Field>
          <Field id="address" label="רחוב ומספר" required error={errors.address} className="sm:col-span-2">
            <input
              id="address"
              name="address"
              autoComplete="street-address"
              required
              defaultValue={values.address}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={describedBy("address", errors.address)}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-heading text-lg font-bold text-foreground">פרטי השירות</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="serviceSlug" label="סוג השירות" required error={errors.serviceSlug}>
            <select
              id="serviceSlug"
              name="serviceSlug"
              required
              defaultValue={values.serviceSlug ?? defaultService ?? ""}
              aria-invalid={Boolean(errors.serviceSlug)}
              aria-describedby={describedBy("serviceSlug", errors.serviceSlug)}
              className={inputClass}
            >
              <option value="" disabled>
                בחרו שירות
              </option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
              <option value="other">אחר</option>
            </select>
          </Field>
          <Field
            id="preferredDate"
            label="תאריך מועדף"
            hint="המועד הסופי יתואם טלפונית"
            error={errors.preferredDate}
          >
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={minDate}
              defaultValue={values.preferredDate}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={describedBy("preferredDate", errors.preferredDate, true)}
              className={inputClass}
            />
          </Field>
          <Field id="timeWindow" label="שעות מועדפות" required error={errors.timeWindow}>
            <select
              id="timeWindow"
              name="timeWindow"
              required
              defaultValue={values.timeWindow ?? "flexible"}
              aria-invalid={Boolean(errors.timeWindow)}
              aria-describedby={describedBy("timeWindow", errors.timeWindow)}
              className={inputClass}
            >
              {timeWindowOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field id="description" label="תיאור התקלה או הצורך" required error={errors.description}>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            placeholder="לדוגמה: המחשב לא נדלק מאז הבוקר / צריך להוסיף נקודת רשת במשרד"
            defaultValue={values.description}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={describedBy("description", errors.description)}
            className={cn(inputClass, "h-auto min-h-28 py-2.5")}
          />
        </Field>
      </fieldset>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">חברה</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        <div className="flex flex-col gap-1">
          <label className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              defaultChecked={values.acceptTerms === "on"}
              aria-invalid={Boolean(errors.acceptTerms)}
              aria-describedby={errors.acceptTerms ? "acceptTerms-error" : undefined}
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>
              קראתי ואני מאשר/ת את{" "}
              <Link href="/terms" className="font-medium text-primary underline-offset-2 hover:underline">
                תנאי השירות
              </Link>{" "}
              ואת עלות הביקור והאבחון בסך {feeLabel}, שתקוזז מעלות התיקון.
              <span className="text-destructive" aria-hidden="true">
                {" *"}
              </span>
            </span>
          </label>
          {errors.acceptTerms && (
            <p id="acceptTerms-error" className="ms-7 text-sm text-destructive">
              {errors.acceptTerms}
            </p>
          )}
        </div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            name="marketingConsent"
            defaultChecked={values.marketingConsent === "on"}
            className="mt-1 size-4 shrink-0 accent-primary"
          />
          <span>אני מעוניין/ת לקבל עדכונים וטיפים מקצועיים בדוא״ל או ב־SMS (לא חובה, ניתן להסיר בכל עת).</span>
        </label>
        <p className="text-xs text-muted-foreground">
          הפרטים ישמשו לתיאום הביקור בלבד, בהתאם ל
          <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
            מדיניות ה��רטיות
          </Link>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-70"
      >
        {pending && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        {pending ? "שולח..." : "שליחת הזמנת שירות"}
      </button>
    </form>
  )
}
