import { pool } from "@/lib/db"

const TZ = "Asia/Jerusalem"

export type ChannelTotals = { whatsapp: number; phone: number }

export type ContactStats = {
  today: ChannelTotals
  week: ChannelTotals
  month: ChannelTotals
  allTime: ChannelTotals
  daily: { day: string; whatsapp: number; phone: number }[]
  byPage: { path: string; whatsapp: number; phone: number }[]
  byPlacement: { placement: string; whatsapp: number; phone: number }[]
  recent: { id: number; channel: "whatsapp" | "phone"; placement: string; path: string; createdAt: string }[]
}

const channelSums = `
  count(*) filter (where channel = 'whatsapp')::int as whatsapp,
  count(*) filter (where channel = 'phone')::int as phone`

export async function getContactStats(): Promise<ContactStats> {
  const [totals, daily, byPage, byPlacement, recent] = await Promise.all([
    pool.query(
      `select
        count(*) filter (where channel = 'whatsapp' and created_at >= date_trunc('day', now() at time zone $1) at time zone $1)::int as today_whatsapp,
        count(*) filter (where channel = 'phone' and created_at >= date_trunc('day', now() at time zone $1) at time zone $1)::int as today_phone,
        count(*) filter (where channel = 'whatsapp' and created_at >= now() - interval '7 days')::int as week_whatsapp,
        count(*) filter (where channel = 'phone' and created_at >= now() - interval '7 days')::int as week_phone,
        count(*) filter (where channel = 'whatsapp' and created_at >= now() - interval '30 days')::int as month_whatsapp,
        count(*) filter (where channel = 'phone' and created_at >= now() - interval '30 days')::int as month_phone,
        ${channelSums}
      from contact_clicks`,
      [TZ],
    ),
    pool.query(
      `select to_char(d.day, 'DD/MM') as day,
        coalesce(c.whatsapp, 0)::int as whatsapp,
        coalesce(c.phone, 0)::int as phone
      from generate_series(
        (now() at time zone $1)::date - 13,
        (now() at time zone $1)::date,
        interval '1 day'
      ) as d(day)
      left join (
        select (created_at at time zone $1)::date as day, ${channelSums}
        from contact_clicks
        where created_at >= now() - interval '15 days'
        group by 1
      ) c on c.day = d.day::date
      order by d.day`,
      [TZ],
    ),
    pool.query(
      `select page_path as path, ${channelSums}
      from contact_clicks
      where created_at >= now() - interval '30 days'
      group by page_path
      order by count(*) desc
      limit 10`,
    ),
    pool.query(
      `select placement, ${channelSums}
      from contact_clicks
      where created_at >= now() - interval '30 days'
      group by placement
      order by count(*) desc`,
    ),
    pool.query(
      `select id, channel, placement, page_path as path, created_at as "createdAt"
      from contact_clicks
      order by created_at desc
      limit 30`,
    ),
  ])

  const t = totals.rows[0]
  return {
    today: { whatsapp: t.today_whatsapp, phone: t.today_phone },
    week: { whatsapp: t.week_whatsapp, phone: t.week_phone },
    month: { whatsapp: t.month_whatsapp, phone: t.month_phone },
    allTime: { whatsapp: t.whatsapp, phone: t.phone },
    daily: daily.rows,
    byPage: byPage.rows,
    byPlacement: byPlacement.rows,
    recent: recent.rows.map((row) => ({ ...row, createdAt: new Date(row.createdAt).toISOString() })),
  }
}
