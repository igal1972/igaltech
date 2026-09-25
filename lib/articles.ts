import { and, desc, eq, lte } from "drizzle-orm"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"

export function normalizeArticleContent(content: string) {
  if (!content.trim().startsWith("[")) return content

  try {
    const sections: unknown = JSON.parse(content)
    if (Array.isArray(sections) && sections.every((section) => typeof section === "string")) {
      return sections.join("\n\n")
    }
  } catch {
    return content
  }

  return content
}

export async function getPublishedArticles(limit?: number) {
  const query = db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        lte(blogPosts.publishedAt, new Date()),
      ),
    )
    .orderBy(desc(blogPosts.publishedAt))

  return limit ? query.limit(limit) : query
}

export async function getArticleBySlug(slug: string) {
  const [article] = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.status, "published"),
        lte(blogPosts.publishedAt, new Date()),
      ),
    )
    .limit(1)

  return article ?? null
}

export async function getPublishedArticleSlugs() {
  return db
    .select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
}
