import { Phone } from "lucide-react"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { siteConfig, whatsappLink } from "@/lib/site-config"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  message?: string
  size?: "default" | "lg"
  variant?: "default" | "onPrimary"
}

export function ContactButtons({
  className,
  message,
  size = "default",
  variant = "default",
}: Props) {
  const sizeClasses = size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm"

  const callClasses =
    variant === "onPrimary"
      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90 focus-visible:outline-primary-foreground"
      : "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring"

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <a
        href={`tel:${siteConfig.phoneTel}`}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
          callClasses,
          sizeClasses,
        )}
      >
        <Phone className="size-5" />
        <span>חייגו עכשיו {siteConfig.phoneDisplay}</span>
      </a>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f7a3d] font-medium text-white shadow-sm transition-colors hover:bg-[#0b6331] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7a3d]",
          sizeClasses,
        )}
      >
        <WhatsappIcon className="size-5" />
        <span>שליחת הודעת וואטסאפ</span>
      </a>
    </div>
  )
}
