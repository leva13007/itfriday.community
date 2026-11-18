// IT Friday #028 — Temporal demo
// Вставляти в Chrome DevTools Console ПО ОДНОМУ блоку. Перед кожним — питання в чат «що виведе?».
// Очікувані результати перевірені через @js-temporal/polyfill (17.11.2026).

// ─── DEMO 1 · Біль Date ──────────────────────────────────────────────
new Date(2026, 1, 1)
// → Sun Feb 01 2026  (місяць 1 = лютий)

const start = new Date(2026, 10, 20)
const addDay = d => { d.setDate(d.getDate() + 1); return d }
addDay(start); start
// → Sat Nov 21 2026  (start зіпсовано)

const jan31 = new Date(2026, 0, 31); jan31.setMonth(jan31.getMonth() + 1); jan31
// → Tue Mar 03 2026

// ─── DEMO 2 · Temporal: місяці, незмінність ───────────────────────────
Temporal.PlainDate.from('2026-02-01').month
// → 2

const d = Temporal.PlainDate.from('2026-11-20')
d.add({ days: 1 }); d
// → 2026-11-20  (не змінився)

Temporal.PlainDate.from('2026-01-31').add({ months: 1 })
// → 2026-02-28

Temporal.PlainDate.from('2026-01-31').add({ months: 1 }, { overflow: 'reject' })
// → RangeError

// ─── DEMO 3 · Стрім у різних таймзонах ────────────────────────────────
const stream = Temporal.ZonedDateTime.from('2026-11-20T19:00[Europe/London]')
stream.withTimeZone('Europe/Kyiv').toPlainTime()        // → 21:00:00
stream.withTimeZone('America/New_York').toPlainTime()   // → 14:00:00
// Чат: «Звідки дивитесь? Кидайте місто — порахуємо ваш час» → підставляти зони з чату
stream.toString()  // → 2026-11-20T19:00:00+00:00[Europe/London]

// ─── DEMO 4 · Літній час (головний вау-момент) ────────────────────────
const sat = Temporal.ZonedDateTime.from('2026-03-28T12:00[Europe/London]')
sat.add({ days: 1 })    // → 2026-03-29T12:00:00+01:00[Europe/London]
sat.add({ hours: 24 })  // → 2026-03-29T13:00:00+01:00[Europe/London]

Temporal.ZonedDateTime.from('2026-03-29T01:30[Europe/London]')
// → 2026-03-29T02:30:00+01:00  (01:30 не існує)
Temporal.ZonedDateTime.from('2026-03-29T01:30[Europe/London]', { disambiguation: 'reject' })
// → RangeError

Temporal.ZonedDateTime.from('2026-10-25T01:30[Europe/London]', { disambiguation: 'earlier' })
// → ...+01:00
Temporal.ZonedDateTime.from('2026-10-25T01:30[Europe/London]', { disambiguation: 'later' })
// → ...+00:00

// ─── DEMO 5 · Тривалості ──────────────────────────────────────────────
Temporal.PlainDate.from('2026-11-20').until('2026-12-25')                            // → P35D
Temporal.PlainDate.from('2026-11-20').until('2026-12-25', { largestUnit: 'months' }) // → P1M5D
Temporal.Duration.from({ hours: 1, minutes: 90 }).round({ largestUnit: 'hours' })    // → PT2H30M

// Живий відлік: скільки до Різдва від цієї секунди
Temporal.Now.zonedDateTimeISO('Europe/London')
  .until(Temporal.ZonedDateTime.from('2026-12-25T00:00[Europe/London]'),
         { largestUnit: 'days', smallestUnit: 'minutes' })

// ─── DEMO 6 · Пастка з порівнянням ────────────────────────────────────
Temporal.PlainDate.from('2026-01-01') < Temporal.PlainDate.from('2026-02-01')
// → TypeError

;['2026-12-25', '2026-01-01', '2026-11-20']
  .map(s => Temporal.PlainDate.from(s))
  .sort(Temporal.PlainDate.compare)
  .join(', ')
// → 2026-01-01, 2026-11-20, 2026-12-25

// ─── DEMO 7 · Дрібниці ────────────────────────────────────────────────
Temporal.PlainMonthDay.from('02-29').toPlainDate({ year: 2027 })    // → 2027-02-28
stream.toLocaleString('uk-UA', { dateStyle: 'full', timeStyle: 'short' })
// → пʼятниця, 20 листопада 2026 р. о 19:00
JSON.stringify({ at: stream })
// → {"at":"2026-11-20T19:00:00+00:00[Europe/London]"}
new Date('2026-11-20T19:00:00Z').toTemporalInstant()                // → 2026-11-20T19:00:00Z

// ─── BONUS · якщо лишився час ─────────────────────────────────────────
Temporal.PlainDate.from('2026-11-20').withCalendar('hebrew')
  .toLocaleString('en', { calendar: 'hebrew' })                      // → 10 Kislev 5787
