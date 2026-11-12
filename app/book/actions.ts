"use server"

import { z } from "zod"
import { pool } from "@/lib/db"
import { services } from "@/lib/services"

export type BookingField =
  | "fullName"
  | "phone"
  | "email"
  | "city"
  | "address"
  | "serviceSlug"
  | "preferredDate"
  | "timeWindow"
  | "description"
  | "acceptTerms"

export type BookingState = {
  ok?: boolean
  message?: string
  errors?: Partial<Record<BookingField, string>>
  values?: Partial<Record<BookingField | "marketingConsent", string>>
}

const timeWindows = ["morning", "noon", "afternoon", "flexible"] as const

function todayInIsrael() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date())
}

const schema = z.object({
  fullName: z.string().trim().min(2, "נא להזין שם מלא").max(80, "השם ארוך מדי"),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s\-()]/g, "").replace(/^\+972/, "0"))
    .pipe(z.string().regex(/^0\d{8,9}$/, "נא להזין מספר טלפון ישראלי תקין")),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || z.email().safeParse(v).success, "כתובת הדוא״ל אינה תקינה"),
  city: z.string().trim().min(2, "נא להזין עיר").max(60, "שם העיר ארוך מדי"),
  address: z.string().trim().min(3, "נא להזין כתובת").max(150, "הכתובת ארוכה מדי"),
  serviceSlug: z
    .string()
    .refine((v) => v === "other" || services.some((s) => s.slug === v), "נא לבחור סוג שירות"),
  preferredDate: z
    .string()
    .refine((v) => v === "" || (/^\d{4}-\d{2}-\d{2}$/.test(v) && v >= todayInIsrael()), "נא לבחור תאריך מהיום והלאה"),
  timeWindow: z.enum(timeWindows, { error: "נא לבחור חלון זמן" }),
  description: z.string().trim().min(10, "נא לתאר את התקלה בכמה מילים (לפחות 10 תווים)").max(2000, "התיאור ארוך מדי"),
  acceptTerms: z.literal("on", { error: "יש לאשר את תנאי השירות ואת עלות הביקור" }),
  marketingConsent: z.string().optional(),
})

export async function submitServiceRequest(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const raw = Object.fromEntries(
    [
      "fullName",
      "phone",
      "email",
      "city",
      "address",
      "serviceSlug",
      "preferredDate",
      "timeWindow",
      "description",
      "acceptTerms",
      "marketingConsent",
    ].map((key) => [key, String(formData.get(key) ?? "")]),
  ) as Record<BookingField | "marketingConsent", string>

  // Honeypot: real visitors never fill this hidden field
  if (String(formData.get("company") ?? "") !== "") {
    return { ok: true }
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors: BookingState["errors"] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as BookingField
      if (!errors[field]) errors[field] = issue.message
    }
    return { errors, values: raw, message: "יש לתקן את השדות המסומנים" }
  }

  const data = parsed.data

  try {
    const recent = await pool.query(
      "select count(*)::int as n from service_requests where phone = $1 and created_at > now() - interval '1 hour'",
      [data.phone],
    )
    if (recent.rows[0].n >= 3) {
      return { values: raw, message: "כבר התקבלו מכם מספר הזמנות בשעה האחרונה. ניצור איתכם קשר בהקדם." }
    }

    await pool.query(
      `insert into service_requests
        (full_name, phone, email, city, address, service_slug, preferred_date, time_window, description, marketing_consent)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        data.fullName,
        data.phone,
        data.email || null,
        data.city,
        data.address,
        data.serviceSlug,
        data.preferredDate || null,
        data.timeWindow,
        data.description,
        data.marketingConsent === "on",
      ],
    )
  } catch (error) {
    console.error("Failed to save service request", error)
    return { values: raw, message: "אירעה שגיאה בשליחת ההזמנה. נסו שוב או התקשרו אלינו." }
  }

  return { ok: true }
}
