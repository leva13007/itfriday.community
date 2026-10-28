function ukPlural(n: number, one: string, few: string, many: string) {
  const d = n % 10, h = n % 100
  if (d === 1 && h !== 11) return one
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few
  return many
}

export const LINKS = {
  telegram: 'https://t.me/+QRJNFfHaLxMwYzcy',
  youtubeLive: 'https://www.youtube.com/@zloyleva/live',
}

export const strings = {
  root: {
    title: "ІТ П'ятниця",
    subtitle: 'Живе українське IT онлайн',
    lead: "Технічне і людське — щоп'ятниці в прямому ефірі на YouTube.",
    statStreams: (n: number) => ukPlural(n, 'стрім', 'стріми', 'стрімів'),
    statSpeakers: (n: number) => ukPlural(n, 'спікер', 'спікери', 'спікерів'),
    statSince: (month: string) => `в ефірі з ${month}`,
    joinTelegram: 'Приєднатись у Telegram',
    watchRecordings: 'Дивитись записи',

    nextStream: 'Наступний стрім',
    onAir: 'Зараз в ефірі',
    watchLive: 'Дивитись на YouTube',
    guest: 'Гість',
    solo: 'Соло-випуск',
    addToCalendar: 'Додати в календар',
    details: 'Деталі',
    tbaTitle: 'Тема і гість — у середу',
    tbaText: 'Анонс виходить у Telegram, зазвичай до вечора середи.',
    subscribe: 'Підписатись у Telegram',
    meanwhile: (num: string) => `Поки що — запис #${num}`,
    calendarDetails: "ІТ П'ятниця — щотижневий стрім українського IT-ком'юніті.",

    latest: 'Останні стріми',
    allStreams: (n: number) => `Усі ${n} →`,
    speakers: 'Спікери',
    allSpeakers: 'Усі спікери →',
    appearances: (n: number) => `${n} ${ukPlural(n, 'стрім', 'стріми', 'стрімів')}`,

    ctaTitle: 'Маєш що розповісти?',
    ctaText: 'Кейс, баг, який ловив три дні, або інструмент, що здивував, — цього досить. Бути «визнаним експертом» не обовʼязково.',
    ctaButton: 'Стати спікером',
  },
  en: {
    title: 'IT Friday',
    subtitle: 'Live Ukrainian IT, online',
    lead: 'Technical and human — live on YouTube every Friday.',
    statStreams: (n: number) => (n === 1 ? 'stream' : 'streams'),
    statSpeakers: (n: number) => (n === 1 ? 'speaker' : 'speakers'),
    statSince: (month: string) => `on air since ${month}`,
    joinTelegram: 'Join on Telegram',
    watchRecordings: 'Watch recordings',

    nextStream: 'Next stream',
    onAir: 'Live now',
    watchLive: 'Watch on YouTube',
    guest: 'Guest',
    solo: 'Solo episode',
    addToCalendar: 'Add to calendar',
    details: 'Details',
    tbaTitle: 'Topic and guest — on Wednesday',
    tbaText: 'The announcement goes out on Telegram, usually by Wednesday evening.',
    subscribe: 'Follow on Telegram',
    meanwhile: (num: string) => `Meanwhile — watch #${num}`,
    calendarDetails: 'IT Friday — weekly live stream of the Ukrainian IT community.',

    latest: 'Latest streams',
    allStreams: (n: number) => `All ${n} →`,
    speakers: 'Speakers',
    allSpeakers: 'All speakers →',
    appearances: (n: number) => `${n} ${n === 1 ? 'stream' : 'streams'}`,

    ctaTitle: 'Got something to share?',
    ctaText: "A case, a bug you chased for three days, a tool that surprised you — that's enough. You don't need to be a \"recognized expert\".",
    ctaButton: 'Become a speaker',
  },
}
