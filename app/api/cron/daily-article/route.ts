import { generateDailyArticle } from "@/lib/generate-article"

export const maxDuration = 300

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const isDevelopment = process.env.NODE_ENV === "development"

  // Vercel Cron automatically attaches `Authorization: Bearer <CRON_SECRET>`.
  // The User-Agent header is spoofable, so authorization relies solely on the secret.
  if (!isDevelopment) {
    if (!secret) {
      return Response.json({ error: "Cron secret not configured" }, { status: 503 })
    }
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const result = await generateDailyArticle()
    return Response.json(result)
  } catch (error) {
    console.error("[daily-article] Publishing failed", error)
    return Response.json({ error: "Article generation failed" }, { status: 500 })
  }
}
