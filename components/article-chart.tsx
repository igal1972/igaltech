"use client"

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { ArticleChartSpec } from "@/lib/article-charts"

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function ArticleChart({ spec }: { spec: ArticleChartSpec }) {
  const formatValue = (value: number) => (spec.unit ? `${value.toLocaleString("he-IL")} ${spec.unit}` : value.toLocaleString("he-IL"))
  const tooltip = (
    <Tooltip
      formatter={(value) => formatValue(Number(value))}
      contentStyle={{ direction: "rtl", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}
    />
  )

  return (
    <figure className="my-10 rounded-2xl border border-border bg-card p-5 md:p-6">
      <figcaption className="font-heading text-lg font-bold text-foreground">{spec.title}</figcaption>
      <div className="mt-5 h-72 w-full" dir="ltr" role="img" aria-label={`${spec.title}: ${spec.data.map((d) => `${d.label} ${formatValue(d.value)}`).join(", ")}`}>
        <ResponsiveContainer width="100%" height="100%">
          {spec.type === "pie" ? (
            <PieChart>
              <Pie data={spec.data} dataKey="value" nameKey="label" innerRadius="45%" outerRadius="80%" paddingAngle={2} label={({ name }) => String(name)}>
                {spec.data.map((entry, index) => <Cell key={entry.label} fill={colors[index % colors.length]} />)}
              </Pie>
              {tooltip}
            </PieChart>
          ) : spec.type === "line" ? (
            <LineChart data={spec.data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" reversed tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis orientation="right" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={48} />
              {tooltip}
              <Line type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <BarChart data={spec.data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" reversed tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis orientation="right" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={48} />
              {tooltip}
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {spec.data.map((entry, index) => <Cell key={entry.label} fill={colors[index % colors.length]} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {spec.caption && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{spec.caption}</p>}
    </figure>
  )
}
