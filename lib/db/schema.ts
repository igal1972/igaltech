import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export type ArticleFaq = {
  question: string
  answer: string
}

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    category: text("category").notNull(),
    content: text("content").notNull(),
    readTime: text("read_time").notNull().default("3 דקות קריאה"),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    serviceSlug: text("service_slug"),
    keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
    faq: jsonb("faq").$type<ArticleFaq[]>().notNull().default([]),
    status: text("status").notNull().default("published"),
  },
  (table) => [index("blog_posts_published_at_idx").on(table.publishedAt)],
)

export type BlogPost = typeof blogPosts.$inferSelect
