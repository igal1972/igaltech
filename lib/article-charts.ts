import { z } from "zod"

export const articleChartSchema = z.object({
  type: z.enum(["bar", "line", "pie"]),
  title: z.string().min(5).max(90),
  caption: z.string().max(220).optional(),
  unit: z.string().max(15).optional(),
  data: z.array(z.object({ label: z.string().min(1).max(30), value: z.number().finite().nonnegative() })).min(2).max(8),
})

export type ArticleChartSpec = z.infer<typeof articleChartSchema>

export function parseChartSpec(raw: string): ArticleChartSpec | null {
  try {
    const result = articleChartSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : null
  } catch {
    return null
  }
}
