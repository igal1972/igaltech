import { Wrench, Headset, BadgeCheck, Zap } from "lucide-react"

const items = [
  {
    icon: BadgeCheck,
    title: "מקצועיות וניסיון",
    text: "ידע רחב בכל תחומי המחשוב והתקשורת, עם פתרונות מותאמים לכל לקוח.",
  },
  {
    icon: Zap,
    title: "מענה מהיר",
    text: "זמינות גבוהה והגעה מהירה כדי שהעסק והבית שלכם ימשיכו לעבוד.",
  },
  {
    icon: Wrench,
    title: "פתרון מקצה לקצה",
    text: "מהתכנון וההתקנה ועד התחזוקה השוטפת — הכל מול איש מקצוע אחד.",
  },
  {
    icon: Headset,
    title: "שירות אישי",
    text: "יחס אישי, שקיפות מלאה במחיר ותמיכה גם אחרי סיום העבודה.",
  },
]

export function WhyUs() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold text-foreground md:text-4xl">
            למה לבחור בנו?
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            שירות אמין שנותן לכם שקט נפשי, מהתקלה הקטנה ועד הפרויקט המורכב.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
                  <Icon className="size-5 text-primary" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
