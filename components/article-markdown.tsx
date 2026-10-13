import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArticleChart } from "@/components/article-chart"
import { parseChartSpec } from "@/lib/article-charts"

function isChartBlock(node: unknown) {
  const child = (node as { children?: { properties?: { className?: unknown } }[] } | undefined)?.children?.[0]
  const className = child?.properties?.className
  return Array.isArray(className) && className.includes("language-chart")
}

const components: Components = {
  pre({ node, children }) {
    if (isChartBlock(node)) return <>{children}</>
    return <pre>{children}</pre>
  },
  code({ className, children }) {
    if (className?.includes("language-chart")) {
      const spec = parseChartSpec(String(children))
      return spec ? <ArticleChart spec={spec} /> : null
    }
    return <code className={className}>{children}</code>
  },
  table({ children }) {
    return (
      <div className="my-8 overflow-x-auto rounded-xl border border-border">
        <table>{children}</table>
      </div>
    )
  },
  img({ src, alt }) {
    if (typeof src !== "string" || !src) return null
    return (
      <span className="my-10 block">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote Blob URLs of unknown dimensions */}
        <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" className="w-full rounded-2xl border border-border object-cover" />
        {alt && <span className="mt-3 block text-sm text-muted-foreground">{alt}</span>}
      </span>
    )
  },
}

export function ArticleMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
