import { pool } from "@/lib/db"

export type ServiceRequestRow = {
  id: number
  fullName: string
  phone: string
  email: string | null
  city: string
  address: string
  serviceSlug: string
  preferredDate: string | null
  timeWindow: string | null
  description: string
  marketingConsent: boolean
  createdAt: string
}

export async function getRecentServiceRequests(limit = 50): Promise<ServiceRequestRow[]> {
  const { rows } = await pool.query(
    `select id, full_name as "fullName", phone, email, city, address, service_slug as "serviceSlug",
      to_char(preferred_date, 'DD/MM/YYYY') as "preferredDate", time_window as "timeWindow",
      description, marketing_consent as "marketingConsent", created_at as "createdAt"
    from service_requests
    order by created_at desc
    limit $1`,
    [limit],
  )
  return rows.map((row) => ({ ...row, createdAt: new Date(row.createdAt).toISOString() }))
}
