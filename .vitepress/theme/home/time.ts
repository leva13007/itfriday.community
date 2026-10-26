// All stream times are London wall-clock. Kyiv is always London + 2h
// (both switch DST on the same instant), so we only ever compute London.
export const TZ = 'Europe/London'

/** How long after start a stream still counts as "on air". */
export const STREAM_WINDOW_MS = 3 * 60 * 60 * 1000
export const DEFAULT_HOUR = 19

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function londonParts(ms: number) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
  })
  const p: Record<string, string> = {}
  for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value
  return {
    y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute,
    wd: WEEKDAYS.indexOf(p.weekday),
  }
}

/** London wall-clock time -> UTC epoch ms (DST-aware). Day overflow is fine. */
export function londonToUtc(y: number, m: number, d: number, h: number, mi = 0): number {
  const guess = Date.UTC(y, m - 1, d, h, mi)
  const p = londonParts(guess)
  const shown = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi)
  return guess - (shown - guess)
}

/** Start of the next (or current, if still on air) Friday stream. */
export function nextFridayStart(now: number): number {
  const p = londonParts(now)
  const days = (5 - p.wd + 7) % 7
  let start = londonToUtc(p.y, p.m, p.d + days, DEFAULT_HOUR)
  if (start + STREAM_WINDOW_MS <= now) start = londonToUtc(p.y, p.m, p.d + days + 7, DEFAULT_HOUR)
  return start
}

export function formatDay(ms: number, lang: string, weekday = true): string {
  return new Intl.DateTimeFormat(lang, {
    timeZone: TZ, day: 'numeric', month: 'long', ...(weekday ? { weekday: 'short' } : {}),
  }).format(new Date(ms))
}

export function formatTimes(ms: number): string {
  const london = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(ms))
  const kyiv = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit' }).format(new Date(ms))
  return `${london} London / ${kyiv} Kyiv`
}

/** Google Calendar "add event" link. */
export function calendarLink(title: string, start: number, details: string, location: string): string {
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(start + 90 * 60 * 1000)}`,
    details,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
