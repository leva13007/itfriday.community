function ukPlural(n: number, one: string, few: string, many: string) {
  const d = n % 10, h = n % 100
  if (d === 1 && h !== 11) return one
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few
  return many
}

export const LINKS = {
  telegram: 'https://t.me/+QRJNFfHaLxMwYzcy',
  youtube: 'https://youtube.com/@zloyleva',
  youtubeLive: 'https://www.youtube.com/@zloyleva/live',
  discord: 'https://discord.gg/ZpWpDQq2EP',
  linkedin: 'https://www.linkedin.com/company/it-friday/',
  github: 'https://github.com/leva13007/itfriday.community',
}

/** Shown as-is in the hero stats. Not available at build time — update by hand now and then. */
export const YOUTUBE_SUBSCRIBERS = '2 000+'

export const strings = {
  root: {
    title: "ІТ П'ятниця",
    eyebrow: "Наживо щоп'ятниці",
    eyebrowLang: 'ефіри українською',
    heroTitle: 'Живий стрім про IT',
    heroAccent: "щоп'ятниці",
    lead: "Відкрите ком'юніті для всіх, кому цікаве IT. Розбираємо технології наживо, говоримо про кар'єру і кличемо гостей, які діляться реальним досвідом.",
    statStreams: (n: number) => ukPlural(n, 'стрім', 'стріми', 'стрімів'),
    statHours: (n: number) => `${ukPlural(n, 'година', 'години', 'годин')} ефіру`,
    statYoutube: 'на YouTube',
    statSpeakers: (n: number) => ukPlural(n, 'спікер', 'спікери', 'спікерів'),
    joinTelegram: 'Приєднатись у Telegram',
    watchRecordings: 'Дивитись записи',

    nextStream: 'Наступний стрім',
    onAir: 'Зараз в ефірі',
    watchLive: 'Дивитись на YouTube',
    guest: 'Гість',
    solo: 'Соло-випуск',
    addToCalendar: 'Додати в календар',
    remindYoutube: 'Нагадати в YouTube',
    details: 'Деталі',
    countdown: { d: 'д', h: 'год', m: 'хв', label: (d: number, h: number, m: number) => `До ефіру: ${d} дн. ${h} год ${m} хв` },
    tbaTitle: 'Тема і гість — у середу',
    tbaText: 'Анонс виходить у Telegram, зазвичай до вечора середи.',
    subscribe: 'Підписатись у Telegram',
    meanwhile: (num: string) => `Поки що — запис #${num}`,
    calendarDetails: "ІТ П'ятниця — щотижневий живий стрім про IT.",

    topicsTitle: 'Про що говоримо',
    topicsText: 'Технічне і людське — на рівних. Обери тему і дивись усі стріми про неї.',

    latest: 'Останні стріми',
    allStreams: (n: number) => `Весь архів, ${n} →`,
    duration: (sec: number) => {
      const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60)
      return h ? `${h} год${m ? ` ${m} хв` : ''}` : `${m} хв`
    },
    speakers: 'Спікери',
    allSpeakers: 'Усі спікери →',
    appearances: (n: number) => `${n} ${ukPlural(n, 'стрім', 'стріми', 'стрімів')}`,

    communityTitle: "Обличчя ком'юніті",
    communityTabs: 'Гості IT Friday',
    youCouldBeHere: 'Тут можеш бути ти',
    streamLink: (num: string) => `Стрім #${num} →`,
    profileLink: 'Профіль і всі стріми →',

    postsTitle: 'Публікації',
    allPosts: 'Усі →',
    channelsTitle: 'Де нас знайти',
    channels: {
      youtube: 'Стріми наживо і записи',
      telegram: 'Анонси і пости між стрімами',
      discord: 'Технічне спілкування будь-якого дня',
      linkedin: 'Новини та анонси англійською',
    },

    archiveAll: 'Усі',
    archiveFilter: 'Фільтр за темою',
    archiveCols: { num: '#', date: 'Дата', topic: 'Тема', title: 'Назва', speakers: 'Спікери', video: 'YouTube' },
    archiveWatch: 'Дивитись',
    archiveEmpty: 'За цією темою стрімів ще немає.',
    archiveCount: (n: number) => `${n} ${ukPlural(n, 'стрім', 'стріми', 'стрімів')}`,

    ctaTitle: 'Маєш що розповісти?',
    ctaText: 'Кейс, баг, який ловив три дні, або інструмент, що здивував, — цього досить. Бути «визнаним експертом» не обовʼязково.',
    ctaButton: 'Стати спікером',

    playVideo: 'Дивитись запис стріму',
    watchHere: 'Дивитись · YouTube',

    footerTagline: "Живий стрім про IT щоп'ятниці. Онлайн-ком'юніті, що виросло із запорізького мітапу Zengineers.",
    footerContent: 'Контент',
    footerCommunity: "Ком'юніті",
    footerHelp: 'Допомогти',
    footerLinks: {
      streams: 'Стріми', posts: 'Публікації', schedule: 'Розклад',
      speakers: 'Спікери', speak: 'Стати спікером', about: 'Про нас', wiki: 'Вікі',
      issues: 'Повідомити про проблему', github: 'Код сайту на GitHub', otherLang: 'English version',
    },
    footerCopy: (y: number) => `© ${y} ІТ П'ятниця · YouTube @zloyleva`,
  },
  en: {
    title: 'IT Friday',
    eyebrow: 'Live every Friday',
    eyebrowLang: 'streams in Ukrainian',
    heroTitle: 'A live IT stream',
    heroAccent: 'every Friday',
    lead: 'An open community for everyone into IT. We dig into tech live, talk careers and invite guests who share real experience.',
    statStreams: (n: number) => (n === 1 ? 'stream' : 'streams'),
    statHours: (n: number) => (n === 1 ? 'hour on air' : 'hours on air'),
    statYoutube: 'on YouTube',
    statSpeakers: (n: number) => (n === 1 ? 'speaker' : 'speakers'),
    joinTelegram: 'Join on Telegram',
    watchRecordings: 'Watch recordings',

    nextStream: 'Next stream',
    onAir: 'Live now',
    watchLive: 'Watch on YouTube',
    guest: 'Guest',
    solo: 'Solo episode',
    addToCalendar: 'Add to calendar',
    remindYoutube: 'Remind me on YouTube',
    details: 'Details',
    countdown: { d: 'd', h: 'h', m: 'min', label: (d: number, h: number, m: number) => `Starts in ${d} d ${h} h ${m} min` },
    tbaTitle: 'Topic and guest — on Wednesday',
    tbaText: 'The announcement goes out on Telegram, usually by Wednesday evening.',
    subscribe: 'Follow on Telegram',
    meanwhile: (num: string) => `Meanwhile — watch #${num}`,
    calendarDetails: 'IT Friday — a weekly live stream about IT.',

    topicsTitle: 'What we talk about',
    topicsText: 'Technical and human on equal terms. Pick a topic to see every stream about it.',

    latest: 'Latest streams',
    allStreams: (n: number) => `Full archive, ${n} →`,
    duration: (sec: number) => {
      const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60)
      return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`
    },
    speakers: 'Speakers',
    allSpeakers: 'All speakers →',
    appearances: (n: number) => `${n} ${n === 1 ? 'stream' : 'streams'}`,

    communityTitle: 'Faces of the community',
    communityTabs: 'IT Friday guests',
    youCouldBeHere: 'This could be you',
    streamLink: (num: string) => `Stream #${num} →`,
    profileLink: 'Profile and all streams →',

    postsTitle: 'Posts',
    allPosts: 'All →',
    channelsTitle: 'Where to find us',
    channels: {
      youtube: 'Live streams and recordings',
      telegram: 'Announcements and posts between streams',
      discord: 'Tech chat any day of the week',
      linkedin: 'News and announcements in English',
    },

    archiveAll: 'All',
    archiveFilter: 'Filter by topic',
    archiveCols: { num: '#', date: 'Date', topic: 'Topic', title: 'Title', speakers: 'Speakers', video: 'YouTube' },
    archiveWatch: 'Watch',
    archiveEmpty: 'No streams on this topic yet.',
    archiveCount: (n: number) => `${n} ${n === 1 ? 'stream' : 'streams'}`,

    ctaTitle: 'Got something to share?',
    ctaText: "A case, a bug you chased for three days, a tool that surprised you — that's enough. You don't need to be a \"recognized expert\".",
    ctaButton: 'Become a speaker',

    playVideo: 'Watch the stream recording',
    watchHere: 'Watch · YouTube',

    footerTagline: 'A live stream about IT every Friday. An online community that grew out of the Zaporizhzhia meetup Zengineers.',
    footerContent: 'Content',
    footerCommunity: 'Community',
    footerHelp: 'Help out',
    footerLinks: {
      streams: 'Streams', posts: 'Posts', schedule: 'Schedule',
      speakers: 'Speakers', speak: 'Become a speaker', about: 'About', wiki: 'Wiki',
      issues: 'Report a problem', github: 'Site code on GitHub', otherLang: 'Українська версія',
    },
    footerCopy: (y: number) => `© ${y} IT Friday · YouTube @zloyleva`,
  },
}
