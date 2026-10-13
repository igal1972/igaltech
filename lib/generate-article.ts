import { createHash } from "node:crypto"
import { put } from "@vercel/blob"
import { generateImage, generateText, Output } from "ai"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { articleChartSchema, type ArticleChartSpec } from "@/lib/article-charts"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"

const topics = [
  { category: "מחשוב ותחנות עבודה", serviceSlug: "computers", focus: "תחזוקת מחשבים ותחנות עבודה, איתור תקלות ושיפור ביצועים לבית ולעסק" },
  { category: "ניהול רשת", serviceSlug: "network", focus: "יציבות רשת, Wi-Fi ואבטחת רשת לעסק" },
  { category: "התקנת שרתים", serviceSlug: "servers", focus: "תכנון שרתים, תחזוקה והמשכיות עסקית" },
  { category: "תשתיות תקשורת IP", serviceSlug: "ip-infrastructure", focus: "כבילה, נקודות תקשורת ותכנון תשתית" },
  { category: "מצלמות אבטחה", serviceSlug: "security-cameras", focus: "בחירת מצלמות, מיקום, הקלטה וגישה מאובטחת" },
  { category: "גיבוי בענן", serviceSlug: "cloud-backup", focus: "גיבוי, שחזור, הצפנה והגנה מכופרה" },
]

const articleSchema = z.object({
  title: z.string().min(25).max(90),
  excerpt: z.string().min(80).max(220),
  content: z.string().min(3500),
  readTime: z.string().min(5).max(30),
  keywords: z.array(z.string().min(2).max(50)).min(4).max(8),
  faq: z.array(z.object({
    question: z.string().min(10).max(120),
    answer: z.string().min(40).max(500),
  })).min(3).max(5),
  charts: z.array(articleChartSchema).max(2),
  imagePrompt: z.string().min(20).max(400),
  imageAlt: z.string().min(10).max(160),
})

const PUBLISH_INTERVAL_DAYS = 10
const DAY_MS = 86_400_000

function embedMedia(content: string, charts: ArticleChartSpec[], image: { url: string; alt: string } | null) {
  let result = content.replace(/\[\[chart-(\d+)\]\]/g, (_, index: string) => {
    const chart = charts[Number(index) - 1]
    return chart ? `\n\n\`\`\`chart\n${JSON.stringify(chart)}\n\`\`\`\n\n` : ""
  })
  const imageMarkdown = image ? `\n\n![${image.alt.replace(/[[\]]/g, "")}](${image.url})\n\n` : ""
  result = result.includes("[[image]]") ? result.replace("[[image]]", imageMarkdown) : result
  return result.replaceAll("[[image]]", "").trim()
}

async function createArticleImage(prompt: string, slug: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null
  try {
    const { image } = await generateImage({
      model: "openai/gpt-image-1-mini",
      prompt: `${prompt}. Clean professional editorial illustration, soft blue and teal palette, no text, no letters, no logos, no watermarks.`,
      size: "1536x1024",
    })
    const blob = await put(`articles/${slug}.png`, Buffer.from(image.uint8Array), {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: true,
    })
    return blob.url
  } catch (error) {
    console.error("[article] Image generation failed; publishing without image", error)
    return null
  }
}

function getIsraelDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

export async function generateScheduledArticle() {
  const dateString = getIsraelDate()
  const [latest] = await db
    .select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(1)

  // Cron runs daily; the small tolerance keeps the cadence at 10 days despite minor run-time drift.
  if (latest && Date.now() - latest.publishedAt.getTime() < PUBLISH_INTERVAL_DAYS * DAY_MS - 2 * 3_600_000) {
    const nextInDays = Math.ceil((latest.publishedAt.getTime() + PUBLISH_INTERVAL_DAYS * DAY_MS - Date.now()) / DAY_MS)
    return { created: false, slug: latest.slug, reason: "interval-not-reached", nextInDays }
  }

  const recent = await db
    .select({ title: blogPosts.title })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(30)

  const cycleNumber = Math.floor(Date.now() / (PUBLISH_INTERVAL_DAYS * DAY_MS))
  const topic = topics[cycleNumber % topics.length]
  const result = await generateText({
    model: "google/gemini-3.5-flash",
    output: Output.object({ schema: articleSchema }),
    system: `אתה עורך תוכן מקצועי בעברית עבור יגאל טכנולוגיות, העוסק במחשוב, רשתות ואבטחה במרכז הארץ. כתוב מידע שימושי, מדויק וזהיר שמסייע לקורא לקבל החלטה. אין להמציא תקנים, נתונים, מחירים, הסמכות או הבטחות. אין לטעון שהעסק הטוב ביותר. אין לדחוס מילות מפתח. כתוב מימין לשמאל ב-Markdown תקין, בלי כותרת H1 ובלי HTML.`,
    prompt: `צור מאמר מקורי באורך 900–1,200 מילים בנושא ${topic.focus}.
קהל היעד: לקוחות פרטיים, בעלי עסקים קטנים ומנהלי משרדים במרכז הארץ.
מטרת החיפוש: הסבר מעשי לפני רכישה, התקנה, תחזוקה או הזמנת איש מקצוע לבית או לעסק.
השתמש בניסוח עובדתי וברור, ללא הבטחות לא מבוססות וללא ניסיון לטעון לעמידה במדיניות פרסום כלשהי.
חובה לכלול: פתיחה קצרה; 5–7 כותרות H2; צעדים או רשימות מעשיות; טעויות נפוצות; מתי כדאי להזמין איש מקצוע; סיכום עם הנעה עדינה לפנייה ליגאל טכנולוגיות.
השתמש בביטויי חיפוש טבעיים ובהקשר מקומי רק כשזה מועיל. אל תחזור על נושאי המאמרים הקיימים: ${recent.map((item) => item.title).join(" | ")}.
החזר גם תקציר, זמן קריאה, 4–8 ביטויי מפתח ו-3–5 שאלות ותשובות.

המחשה ויזואלית (לפי הצורך בלבד, כשהיא באמת מבהירה את התוכן):
- טבלאות: כשיש השוואה בין אפשרויות, מפרט או צ'קליסט – הוסף טבלת Markdown (GFM) אחת או שתיים עם שורת כותרת.
- תרשימים: עד 2 תרשימים בשדה charts (bar להשוואה, line למגמה לאורך זמן, pie לחלוקה), עם 2–8 נקודות נתונים ותוויות קצרות בעברית. השתמש רק בערכים המחשתיים או בהערכות סבירות, ובשדה caption ציין במפורש שמדובר בהמחשה או בהערכה כללית ולא בנתון רשמי. מקם כל תרשים בתוכן בשורה נפרדת עם הסמן [[chart-1]] או [[chart-2]] לפי הסדר.
- תמונה: מקם בתוכן פעם אחת, בשורה נפרדת אחרי הפסקה הראשונה של אחד הסעיפים, את הסמן [[image]]. בשדה imagePrompt תאר באנגלית איור מקצועי מתאים לנושא (ללא טקסט בתמונה), ובשדה imageAlt כתוב תיאור קצר בעברית של התמונה.
אסור להשתמש בבלוקי קוד (\`\`\`) בתוכן.`,
  })

  const article = result.output
  const wordCount = article.content.trim().split(/\s+/u).length
  if (wordCount < 700 || article.content.includes("```")) {
    throw new Error(`Generated article failed quality checks (${wordCount} words)`)
  }

  const hash = createHash("sha256").update(`${dateString}-${article.title}`).digest("hex").slice(0, 8)
  const slug = `${dateString}-${topic.serviceSlug}-${hash}`
  const imageUrl = await createArticleImage(article.imagePrompt, slug)
  const content = embedMedia(article.content, article.charts, imageUrl ? { url: imageUrl, alt: article.imageAlt } : null)
  const [inserted] = await db
    .insert(blogPosts)
    .values({
      slug,
      title: article.title,
      excerpt: article.excerpt,
      category: topic.category,
      content,
      readTime: article.readTime,
      serviceSlug: topic.serviceSlug,
      keywords: article.keywords,
      faq: article.faq,
      status: "published",
      publishedAt: new Date(),
    })
    .returning({ slug: blogPosts.slug })

  return { created: true, slug: inserted.slug }
}
