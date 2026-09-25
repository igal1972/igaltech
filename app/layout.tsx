import type { Metadata, Viewport } from 'next'
import { Rubik, Assistant } from 'next/font/google'
import { CookieConsent } from '@/components/cookie-consent'
import { AccessibilityMenu } from '@/components/accessibility-menu'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  variable: '--font-rubik',
  display: 'swap',
})

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
  display: 'swap',
})

const siteDescription = `${siteConfig.businessName} — מחשוב ותחנות עבודה, ניהול רשת, התקנת שרתים, תשתיות תקשורת IP, מצלמות אבטחה וגיבוי בענן. לבית ולעסק, ליווי מקצועי ואמין ${siteConfig.serviceArea}.`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.businessName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteDescription,
  applicationName: siteConfig.businessName,
  keywords: [
    'טכנאי מחשבים מרכז',
    'שירותי מחשוב לעסקים',
    'ניהול רשת',
    'התקנת שרתים',
    'תשתיות תקשורת IP',
    'התקנת מצלמות אבטחה',
    'גיבוי בענן',
    'אבטחת מידע לעסקים',
    siteConfig.businessName,
  ],
  authors: [{ name: siteConfig.businessName }],
  creator: siteConfig.businessName,
  publisher: siteConfig.businessName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: siteConfig.siteUrl,
    siteName: siteConfig.businessName,
    title: `${siteConfig.businessName} | ${siteConfig.tagline}`,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${siteConfig.businessName} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.businessName} | ${siteConfig.tagline}`,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${assistant.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <AccessibilityMenu />
        <CookieConsent />
      </body>
    </html>
  )
}
