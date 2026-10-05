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
  businessId: "",
  // שם רכז הנגישות, כנדרש בהצהרת הנגישות לפי תקנות הנגישות
  accessibilityCoordinator: "יגאל",
  accessibilityAuditDate: "10 באוקטובר 2026",
}

export function whatsappLink(message: string = siteConfig.whatsappMessage) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
}
