import { Phone } from "lucide-react"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { siteConfig, whatsappLink } from "@/lib/site-config"

export function FloatingContact() {
  return (
    <aside aria-label="יצירת קשר מהירה" className="fixed bottom-5 left-5 z-50 flex flex-col gap-3 print:hidden">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שליחת הודעת וואטסאפ (נפתח בחלון חדש)"
        className="group flex size-14 items-center justify-center rounded-full bg-[#0f7a3d] text-white shadow-lg shadow-[#0f7a3d]/30 transition-transform hover:scale-105 hover:bg-[#0b6331] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7a3d]"
      >
        <WhatsappIcon className="size-7" />
      </a>
      <a
        href={`tel:${siteConfig.phoneTel}`}
        aria-label={`חיוג לטלפון ${siteConfig.phoneDisplay}`}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Phone className="size-6" aria-hidden="true" />
      </a>
    </aside>
  )
}
