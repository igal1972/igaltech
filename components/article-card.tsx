import Link from "next/link"
import { ArrowLeft, Clock3 } from "lucide-react"
import type { BlogPost } from "@/lib/db/schema"

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function ArticleCard({ article }: { article: BlogPost }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
          {article.category}
        </span>
        <time dateTime={article.publishedAt.toISOString()}>
          {dateFormatter.format(article.publishedAt)}
        </time>
      </div>
      <h2 className="mt-5 font-heading text-2xl font-bold text-balance text-card-foreground">
        <Link href={`/articles/${article.slug}`} className="hover:text-primary">
          {article.title}
        </Link>
      </h2>
      <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
        {article.excerpt}
      </p>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="size-4" aria-hidden="true" />
          {article.readTime}
        </span>
        <Link
          href={`/articles/${article.slug}`}
          className="flex items-center gap-2 font-semibold text-primary hover:underline"
          aria-label={`קריאת המאמר: ${article.title}`}
        >
          לקריאה
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
