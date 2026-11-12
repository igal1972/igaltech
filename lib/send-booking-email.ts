import "server-only"
import nodemailer from "nodemailer"
import { services } from "@/lib/services"
import { siteConfig } from "@/lib/site-config"

export type BookingEmailData = {
  fullName: string
  phone: string
  email: string
  city: string
  address: string
  serviceSlug: string
  preferredDate: string
  timeWindow: "morning" | "noon" | "afternoon" | "flexible"
  description: string
  marketingConsent: boolean
}

const timeWindowLabels: Record<BookingEmailData["timeWindow"], string> = {
  morning: "בוקר (08:00–12:00)",
  noon: "צהריים (12:00–15:00)",
  afternoon: "אחר הצהריים (15:00–18:00)",
  flexible: "גמיש",
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function isBookingEmailConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
}

export async function sendBookingEmail(data: BookingEmailData) {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not configured")

  const serviceTitle =
    data.serviceSlug === "other" ? "אחר" : (services.find((s) => s.slug === data.serviceSlug)?.title ?? data.serviceSlug)

  const rows: [string, string][] = [
    ["שם מלא", data.fullName],
    ["טלפון", data.phone],
    ["דוא״ל", data.email || "—"],
    ["עיר", data.city],
    ["כתובת", data.address],
    ["סוג שירות", serviceTitle],
    ["תאריך מועדף", data.preferredDate || "—"],
    ["חלון זמן", timeWindowLabels[data.timeWindow]],
    ["אישור דיוור שיווקי", data.marketingConsent ? "כן" : "לא"],
    ["תיאור התקלה", data.description],
  ]

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n")
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#111">
<h2 style="margin:0 0 12px">הזמנת שירות חדשה מהאתר</h2>
<table cellpadding="8" style="border-collapse:collapse">
${rows
  .map(
    ([label, value]) =>
      `<tr><th align="right" style="border:1px solid #ddd;background:#f5f5f5;white-space:nowrap">${escapeHtml(label)}</th><td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="color:#555">עלות ביקור ואבחון: ${siteConfig.diagnosisFee} ₪ + מע״מ, מתקזזת מעלות התיקון.</p>
</div>`

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: `"${siteConfig.businessName} – הזמנות" <${user}>`,
    to: process.env.BOOKING_EMAIL_TO || siteConfig.email,
    replyTo: data.email || undefined,
    subject: `הזמנת שירות: ${data.fullName} – ${data.city} (${serviceTitle})`,
    text,
    html,
  })
}
