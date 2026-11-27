import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { londonToUtc, DEFAULT_HOUR } from './time'
import { TOPICS, isTopic, type TopicKey } from './topics'

// Parses stream pages as they are written today:
//   ---
//   description: "..."
//   topic: ai               ← required, one key from topics.ts (unknown/missing = build error)
//   duration: 1:32:10       ← optional until the stream is over; `pnpm durations` fills it from YouTube
//   ---
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
  /** Everyone linked on the page, host included, in order of appearance (archive table) */
  speakers: Guest[]
  /** Speakers without the host */
  guests: Guest[]
  topic: TopicKey
  /** Length of the recording in seconds; null until filled in */
  duration: number | null
  /** Cover for on-page display (WebP when generated). og:image uses the PNG — see config.ts */
  thumb: string
}

/** `topic: ai` → 'ai' from the leading frontmatter block (flat `key: value` lines only) */
function frontmatterValue(src: string, key: string): string | null {
  const block = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]
  const line = block?.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
  return line ? line.trim().replace(/^["']|["']$/g, '') : null
}

/** `1:32:10` / `58:03` → seconds */
export function parseDuration(value: string): number | null {
  const m = value.match(/^(?:(\d+):)?([0-5]?\d):([0-5]\d)$/)
  return m ? (+(m[1] ?? 0)) * 3600 + +m[2] * 60 + +m[3] : null
}
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

export function parse(url: string, src: string): Stream | null {
  const num = url.match(/(\d{3})/)?.[1]
  const dateLine = src.match(/\*\*(?:Дата|Date):\*\*([^\n]*)/)?.[1]
  const date = dateLine && parseDate(dateLine)
  if (!num || !date) {
    console.warn(`[streams.data] skipped ${url}: no number or date`)
    return null
  }
  const time = dateLine!.match(/(\d{1,2}):(\d{2})\s*London/)
  const start = londonToUtc(...date, time ? +time[1] : DEFAULT_HOUR, time ? +time[2] : 0)

  const youtube = src.match(/https?:\/\/(?:www\.)?youtube\.com\/live\/[\w-]+/)?.[0] ?? null

  const speakers: Guest[] = []
  for (const m of src.matchAll(/\[([^\]]+)\]\((?:\/en)?\/speakers\/([a-z0-9-]+)\)/g)) {
    const [, name, slug] = m
    if (!speakers.some((g) => g.slug === slug)) speakers.push({ slug, name })
  }
  const guests = speakers.filter((g) => g.slug !== HOST_SLUG)

  // Fail the build instead of silently miscounting: every stream needs a known topic.
  const topic = frontmatterValue(src, 'topic')
  if (!isTopic(topic)) {
    throw new Error(`[streams] ${url}: frontmatter "topic: ${topic ?? ''}" — expected one of: ${Object.keys(TOPICS).join(', ')} (see .vitepress/theme/home/topics.ts)`)
  }
  const rawDuration = frontmatterValue(src, 'duration')
  const duration = rawDuration ? parseDuration(rawDuration) : null
  if (rawDuration && duration === null) {
    throw new Error(`[streams] ${url}: frontmatter "duration: ${rawDuration}" — expected H:MM:SS or MM:SS`)
  }

  // Headings often end with " · Guest Name" — the guest is shown separately, so drop the suffix.
  let title = (src.match(/^#\s+#\d+\s+[—–-]\s+(.+)$/m)?.[1] ?? `#${num}`).replace(/`/g, '').trim()
  for (const g of guests) {
    if (title.endsWith(` · ${g.name}`)) title = title.slice(0, -(g.name.length + 3)).trim()
  }

  // Pages show the WebP made by `pnpm images` (~100 KB vs ~2 MB PNG, QA #16); the PNG stays for og:image.
  // Runs only in Node (config + data loader); paths are relative to the repo root, where vitepress runs.
  const thumb = existsSync(resolve('public/streams', `${num}.webp`)) ? `/streams/${num}.webp` : `/streams/${num}.png`

  return { num, url: url.replace(/\.html$/, ''), title, start, youtube, speakers, guests, topic, duration, thumb }
}
