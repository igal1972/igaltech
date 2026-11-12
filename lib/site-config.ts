// עדכן כאן את פרטי העסק — הכל מתעדכן אוטומטית בכל האתר
export const siteConfig = {
  businessName: "יגאל טכנולוגיות",
  siteUrl: "https://igaltech.com",
  tagline: "מחשוב, רשתות ואבטחה",
  serviceArea: "במרכז הארץ",
  // מספר טלפון לתצוגה
  phoneDisplay: "054-437-3170",
  // מספר לחיוג (tel:) בפורמט בינלאומי
  phoneTel: "+972544373170",
  // מספר וואטסאפ בפורמט בינלאומי ללא + וללא מקפים
  whatsapp: "972544373170",
  // הודעה מוכנה מראש לוואטסאפ
  whatsappMessage: "שלום, הגעתי דרך האתר ואשמח לקבל פרטים ולתאם שירות.",
  email: "info@igaltech.com",
  // מספר עוסק מורשה / ח.פ. — מוצג בתחתית האתר כשהשדה מלא
  businessId: "029266723",
  // שם העוסק הרשום (בעל העסק)
  ownerName: "יגאל שמשון",
  // כתובת פיזית של העסק — מוצגת בתחתית האתר כשהשדה מלא
  address: "דרך העצמאות 33, יהוד-מונוסון, 5630204",
  streetAddress: "דרך העצמאות 33",
  addressLocality: "יהוד-מונוסון",
  postalCode: "5630204",
  // שם רכז הנגישות, כנדרש בהצהרת הנגישות לפי תקנות הנגישות
  accessibilityCoordinator: "יגאל שמשון",
  accessibilityAuditDate: "10 באוקטובר 2026",
  // עלות ביקור ואבחון תקלה בש"ח לפני מע"מ — מתקזזת מעלות התיקון
  diagnosisFee: 300,
  // שיעור המע"מ בישראל
  vatRate: 0.18,
}

export function diagnosisFeeBreakdown() {
  const net = siteConfig.diagnosisFee
  const vat = Math.round(net * siteConfig.vatRate * 100) / 100
  return { net, vat, total: net + vat, vatPercent: Math.round(siteConfig.vatRate * 100) }
}

export function formatShekel(amount: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export function whatsappLink(message: string = siteConfig.whatsappMessage) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
}
