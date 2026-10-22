import { z } from "zod"
import { db } from "@/lib/db"
import { contactClicks } from "@/lib/db/schema"

const clickSchema = z.object({
  channel: z.enum(["whatsapp", "phone"]),
  placement: z.enum(["header", "footer", "floating", "content"]),
  path: z
    .string()
    .max(200)
    .regex(/^\/[^\s?#]*$/),
})

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? ""
  if (/bot|crawler|spider|headless/i.test(userAgent)) {
    return new Response(null, { status: 204 })
  }

  let body: unknown
  try {
    body = JSON.parse(await request.text())
  } catch {
    return new Response(null, { status: 400 })
  }

  const parsed = clickSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(null, { status: 400 })
  }

  await db.insert(contactClicks).values({
    channel: parsed.data.channel,
    placement: parsed.data.placement,
    pagePath: parsed.data.path,
  })

  return new Response(null, { status: 204 })
}
