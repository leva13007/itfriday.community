#!/usr/bin/env node
// `pnpm durations` — fills `duration: H:MM:SS` in the frontmatter of stream pages from YouTube.
//
// For every streams/NNN.md without a duration it takes the video ID from the `youtube.com/live/…` link,
// asks the YouTube Data API for the recording length and writes it into BOTH streams/NNN.md and
// en/streams/NNN.md. Streams that haven't happened yet (no recording) are skipped.
//
// Needs an API key (Google Cloud → APIs & Services → YouTube Data API v3 → Credentials → API key):
//   YOUTUBE_API_KEY=... pnpm durations          # only streams without a duration
//   YOUTUBE_API_KEY=... pnpm durations --force  # re-fetch all
//
// The key is read from the environment only — never commit it.
//
// No key? Write `duration:` by hand in streams/NNN.md (UA) only, then
//   pnpm durations:sync                         # copies every UA duration into en/streams/NNN.md

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const KEY = process.env.YOUTUBE_API_KEY
const FORCE = process.argv.includes('--force')
const SYNC = process.argv.includes('--sync')

const files = readdirSync('streams').filter((f) => /^\d{3}\.md$/.test(f)).sort()

/** `duration:` value from the leading frontmatter block, or null */
function getDuration(path) {
  const src = readFileSync(path, 'utf8')
  const end = src.indexOf('\n---', 4)
  return src.slice(4, end).match(/^duration:\s*(.+)$/m)?.[1].trim() ?? null
}

// The "Format" line of a stream page ends with the planned length: `**Формат:** Соло-випуск · … · ~60 хвилин`.
// Once the real duration is known, that part is rewritten to it (`· 2 год 58 хв` / `· 2 h 58 min`), so the page
// never shows two different lengths. Anything after the length (e.g. "— особливий випуск…") is kept.
// Already-rewritten lengths match too, so a corrected duration just overwrites the old text.
const FORMAT_LINE = { uk: /^(\*\*Формат:\*\*.*·\s*)([^·\n]*)$/m, en: /^(\*\*Format:\*\*.*·\s*)([^·\n]*)$/m }
const LENGTH = {
  uk: /^(?:~\s*[\d–-]+\s*(?:хвилин[аи]?|хв|годин[аи]?|год)\.?|\d+ год(?: \d+ хв)?|\d+ хв)/,
  en: /^(?:~\s*[\d–-]+\s*(?:minutes?|min|hours?|h)\.?|\d+ h(?: \d+ min)?|\d+ min)/,
}
function humanize(value, lang) {
  const [s, m = 0, h = 0] = value.split(':').map(Number).reverse()
  const total = Math.round((h * 3600 + m * 60 + s) / 60)
  const hh = Math.floor(total / 60), mm = total % 60
  const [H, M] = lang === 'uk' ? ['год', 'хв'] : ['h', 'min']
  return hh ? `${hh} ${H}${mm ? ` ${mm} ${M}` : ''}` : `${mm} ${M}`
}
/** Rewrites the planned length on the Format line; returns true if the file changed */
function setFormatLength(path, value, lang) {
  const src = readFileSync(path, 'utf8')
  const out = src.replace(FORMAT_LINE[lang], (line, head, tail) => {
    const rest = tail.replace(LENGTH[lang], '')
    return rest === tail ? line : head + humanize(value, lang) + rest
  })
  if (out === src) return false
  writeFileSync(path, out)
  return true
}

if (SYNC) {
  let changed = 0
  for (const f of files) {
    const num = f.slice(0, 3)
    const ua = join('streams', f)
    const en = join('en/streams', f)
    const value = getDuration(ua)
    if (!value) continue
    if (!/^(?:\d+:)?[0-5]?\d:[0-5]\d$/.test(value)) {
      console.error(`#${num}: "duration: ${value}" — expected H:MM:SS or MM:SS`)
      process.exit(1)
    }
    const notes = []
    if (setFormatLength(ua, value, 'uk')) notes.push('UA format line')
    if (existsSync(en)) {
      if (getDuration(en) !== value) { setDuration(en, value); notes.push('EN duration') }
      if (setFormatLength(en, value, 'en')) notes.push('EN format line')
    }
    if (notes.length) { console.log(`#${num}: ${value} → ${notes.join(', ')}`); changed++ }
  }
  console.log(changed ? `Done: ${changed} stream(s) updated.` : 'Everything already matches the UA durations.')
  process.exit(0)
}

if (!KEY) {
  console.error('YOUTUBE_API_KEY is not set. Usage: YOUTUBE_API_KEY=... pnpm durations [--force]\nOr write durations in streams/NNN.md by hand and run: pnpm durations:sync')
  process.exit(1)
}

/** ISO 8601 `PT1H2M3S` → `1:02:03` */
function format(iso) {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!m) return null
  const [h, min, s] = [+(m[1] ?? 0), +(m[2] ?? 0), +(m[3] ?? 0)]
  if (h + min + s === 0) return null
  return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Sets or replaces `duration:` inside the leading frontmatter block */
function setDuration(path, value) {
  const src = readFileSync(path, 'utf8')
  const end = src.indexOf('\n---', 4)
  if (!src.startsWith('---\n') || end < 0) throw new Error(`${path}: no frontmatter`)
  let fm = src.slice(4, end)
  fm = /^duration:/m.test(fm) ? fm.replace(/^duration:.*$/m, `duration: ${value}`) : `${fm}\nduration: ${value}`
  writeFileSync(path, `---\n${fm}${src.slice(end)}`)
}

const todo = []
for (const f of files) {
  const src = readFileSync(join('streams', f), 'utf8')
  if (!FORCE && /^duration:/m.test(src.split('\n---')[0])) continue
  const id = src.match(/youtube\.com\/live\/([\w-]+)/)?.[1]
  if (id) todo.push({ num: f.slice(0, 3), id })
  else console.warn(`#${f.slice(0, 3)}: no youtube.com/live/ link — skipped`)
}
if (!todo.length) {
  console.log('Nothing to do: every stream already has a duration.')
  process.exit(0)
}

// The API takes up to 50 IDs per request
let updated = 0
for (let i = 0; i < todo.length; i += 50) {
  const batch = todo.slice(i, i + 50)
  const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,liveStreamingDetails&id=${batch.map((b) => b.id).join(',')}&key=${KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`YouTube API ${res.status}: ${await res.text()}`)
    process.exit(1)
  }
  const { items } = await res.json()
  for (const { num, id } of batch) {
    const item = items.find((it) => it.id === id)
    // A live video that hasn't ended (upcoming or on air right now) has no final length yet
    const notOver = item?.liveStreamingDetails && !item.liveStreamingDetails.actualEndTime
    const value = notOver ? null : format(item?.contentDetails?.duration ?? '')
    if (!value) {
      console.log(`#${num}: no recording yet — skipped`)
      continue
    }
    setDuration(join('streams', `${num}.md`), value)
    setFormatLength(join('streams', `${num}.md`), value, 'uk')
    const en = join('en/streams', `${num}.md`)
    if (existsSync(en)) {
      setDuration(en, value)
      setFormatLength(en, value, 'en')
    }
    console.log(`#${num}: ${value}`)
    updated++
  }
}
console.log(`Done: ${updated} stream(s) updated. Check the diff, then commit.`)
