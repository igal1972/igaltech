"use client"

import { useEffect } from "react"

function getPlacement(link: HTMLElement) {
  if (link.closest("header")) return "header"
  if (link.closest("footer")) return "footer"
  if (link.closest("aside")) return "floating"
  return "content"
}

export function ContactClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]")
      if (!link || window.location.pathname.startsWith("/admin")) return

      const href = link.getAttribute("href") ?? ""
      const channel = href.startsWith("tel:")
        ? "phone"
        : href.includes("wa.me/") || href.includes("api.whatsapp.com")
          ? "whatsapp"
          : null
      if (!channel) return

      const payload = JSON.stringify({
        channel,
        placement: getPlacement(link),
        path: window.location.pathname,
      })

      if (!navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }))) {
        fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {})
      }
    }

    document.addEventListener("click", handleClick, { capture: true })
    return () => document.removeEventListener("click", handleClick, { capture: true })
  }, [])

  return null
}
