import Script from "next/script"

const DEFAULT_TAG_ID = "GTM-KPC2RZQ7"
const TAG_ID_PATTERN = /^(G|AW|GT|GTM|DC)-[A-Z0-9]+$/

export function GoogleTag() {
  const tagId = (process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || DEFAULT_TAG_ID).trim().toUpperCase()
  if (!tagId || !TAG_ID_PATTERN.test(tagId)) return null

  if (tagId.startsWith("GTM-")) {
    return (
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${tagId}');`}
      </Script>
    )
  }

  return (
    <>
      <Script
        id="google-tag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tagId}');`}
      </Script>
    </>
  )
}
