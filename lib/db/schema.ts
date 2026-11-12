import { boolean, date, index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

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

export const contactClicks = pgTable(
  "contact_clicks",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    channel: text("channel").$type<"whatsapp" | "phone">().notNull(),
    placement: text("placement").notNull(),
    pagePath: text("page_path").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("contact_clicks_created_at_idx").on(table.createdAt)],
)

export const serviceRequests = pgTable(
  "service_requests",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    city: text("city").notNull(),
    address: text("address").notNull(),
    serviceSlug: text("service_slug").notNull(),
    preferredDate: date("preferred_date"),
    timeWindow: text("time_window"),
    description: text("description").notNull(),
    marketingConsent: boolean("marketing_consent").notNull().default(false),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("service_requests_created_at_idx").on(table.createdAt)],
)

export type ServiceRequest = typeof serviceRequests.$inferSelect
