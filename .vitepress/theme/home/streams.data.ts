import { createContentLoader } from 'vitepress'
import { londonToUtc, DEFAULT_HOUR } from './time'

// Parses stream pages as they are written today (no frontmatter needed):
//   # #024 — Title
//   **Дата:** 23 жовтня 2026 | 19:00 London / 21:00 Kyiv      (EN: **Date:** October 23, 2026 | ...)
//   **YouTube: [https://youtube.com/live/...](...)**
//   [Name](/speakers/slug)  — every speaker link except the host counts as a guest
//
// A page whose date is in the future = announced next stream.

export interface Guest { slug: string; name: string }
export interface Stream {
  num: string
  url: string
  title: string
  start: number
  youtube: string | null
  guests: Guest[]
  thumb: string
}
export interface StreamsData { root: Stream[]; en: Stream[]; builtAt: number }

declare const data: StreamsData
export { data }

export const HOST_SLUG = 'oleh-levchenko'

const UK_MONTHS = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']
const EN_MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

function parseDate(line: string): [number, number, number] | null {
  let m = line.match(/(\d{1,2})\s+([^\s\d|]+)\s+(\d{4})/)
  if (m) {
    const month = UK_MONTHS.indexOf(m[2].toLowerCase())
    if (month >= 0) return [+m[3], month + 1, +m[1]]
  }
  m = line.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/)
  if (m) {
    const month = EN_MONTHS.indexOf(m[1].toLowerCase())
    if (month >= 0) return [+m[3], month + 1, +m[2]]
  }
  return null
}

function parse(url: string, src: string): Stream | null {
  const num = url.match(/(\d{3})/)?.[1]
  const dateLine = src.match(/\*\*(?:Дата|Date):\*\*([^\n]*)/)?.[1]
  const date = dateLine && parseDate(dateLine)
  if (!num || !date) {
    console.warn(`[streams.data] skipped ${url}: no number or date`)
    return null
  }
  const time = dateLine!.match(/(\d{1,2}):(\d{2})\s*London/)
  const start = londonToUtc(...date, time ? +time[1] : DEFAULT_HOUR, time ? +time[2] : 0)

  const title = (src.match(/^#\s+#\d+\s+[—–-]\s+(.+)$/m)?.[1] ?? `#${num}`).replace(/`/g, '').trim()
  const youtube = src.match(/https?:\/\/(?:www\.)?youtube\.com\/live\/[\w-]+/)?.[0] ?? null

  const guests: Guest[] = []
  for (const m of src.matchAll(/\[([^\]]+)\]\((?:\/en)?\/speakers\/([a-z0-9-]+)\)/g)) {
    const [, name, slug] = m
    if (slug !== HOST_SLUG && !guests.some((g) => g.slug === slug)) guests.push({ slug, name })
  }

  return { num, url: url.replace(/\.html$/, ''), title, start, youtube, guests, thumb: `/streams/${num}.png` }
}

export default createContentLoader(['streams/[0-9]*.md', 'en/streams/[0-9]*.md'], {
  includeSrc: true,
  transform(pages): StreamsData {
    const out: StreamsData = { root: [], en: [], builtAt: Date.now() }
    for (const page of pages) {
      const stream = parse(page.url, page.src ?? '')
      if (stream) (page.url.startsWith('/en/') ? out.en : out.root).push(stream)
    }
    out.root.sort((a, b) => b.start - a.start)
    out.en.sort((a, b) => b.start - a.start)
    return out
  },
})
