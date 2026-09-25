import { createHash } from "node:crypto"
import { generateText, Output } from "ai"
import { and, desc, eq, gte } from "drizzle-orm"
import { z } from "zod"
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
})

function getIsraelDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function startOfIsraelDay(dateString: string) {
  return new Date(`${dateString}T00:00:00+03:00`)
}

export async function generateDailyArticle() {
  const dateString = getIsraelDate()
  const dayStart = startOfIsraelDay(dateString)
  const [existingToday] = await db
    .select({ id: blogPosts.id, slug: blogPosts.slug })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), gte(blogPosts.publishedAt, dayStart)))
    .limit(1)

  if (existingToday) return { created: false, slug: existingToday.slug, reason: "already-published-today" }

  const recent = await db
    .select({ title: blogPosts.title })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(30)

  const dayNumber = Math.floor(Date.now() / 86_400_000)
  const topic = topics[dayNumber % topics.length]
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
החזר גם תקציר, זמן קריאה, 4–8 ביטויי מפתח ו-3–5 שאלות ותשובות.`,
  })

  const article = result.output
  const wordCount = article.content.trim().split(/\s+/u).length
  if (wordCount < 700 || article.content.includes("```")) {
    throw new Error(`Generated article failed quality checks (${wordCount} words)`)
  }

  const hash = createHash("sha256").update(`${dateString}-${article.title}`).digest("hex").slice(0, 8)
  const slug = `${dateString}-${topic.serviceSlug}-${hash}`
  const [inserted] = await db
    .insert(blogPosts)
    .values({
      slug,
      title: article.title,
      excerpt: article.excerpt,
      category: topic.category,
      content: article.content,
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
