// "Faces of the community" on the home page: one short story per guest.
// Order here = order of the tabs. A guest without a story simply isn't shown (the full list is on /speakers).
// `stream` links the story to that stream page; without it the link goes to the speaker's profile.
// Facts only — every line must be true and checkable on the site.

export interface Story {
  slug: string
  stream?: string
  root: { short: string; role: string; tag: string; text: string }
  en: { short: string; role: string; tag: string; text: string }
}

export const STORIES: Story[] = [
  {
    slug: 'vladyslav-barankevych',
    stream: '027',
    root: {
      short: 'Влад',
      role: 'iOS Developer, Sombra',
      tag: 'Глядач, який став гостем',
      text: 'Сидів у чаті стрімів про пошук роботи. Знайшов роботу і повернувся гостем, щоб чесно розповісти, як це було.',
    },
    en: {
      short: 'Vlad',
      role: 'iOS Developer, Sombra',
      tag: 'From the chat to the guest seat',
      text: 'He used to sit in the chat of the job-search streams. Found a job — and came back as a guest to tell honestly how it went.',
    },
  },
  {
    slug: 'oleksandr-blazheiko',
    root: {
      short: 'Олександр',
      role: 'Software Development Engineer, itvibe.party',
      tag: 'Найчастіший гість',
      text: 'Від PWA до OWASP і RAG — найбільше стрімів на IT Friday. А ще автор повного гайду по Web Push API.',
    },
    en: {
      short: 'Oleksandr',
      role: 'Software Development Engineer, itvibe.party',
      tag: 'Our most frequent guest',
      text: 'From PWA to OWASP and RAG — more IT Friday streams than anyone else. Also the author of a complete guide to the Web Push API.',
    },
  },
  {
    slug: 'oleh-talanov',
    stream: '029',
    root: {
      short: 'Олег Т.',
      role: 'CTO і Co-Founder, WebCap Digitals',
      tag: 'Повертається знову',
      text: "CTO, який приходить знову і знову: метал і Laravel у #005, InertiaJS у #012 і AI в команді у #029.",
    },
    en: {
      short: 'Oleh T.',
      role: 'CTO & Co-Founder, WebCap Digitals',
      tag: 'Keeps coming back',
      text: 'A CTO who keeps coming back: metal and Laravel in #005, InertiaJS in #012 and AI in the team in #029.',
    },
  },
  {
    slug: 'yuliia-kaiunko',
    stream: '025',
    root: {
      short: 'Юлія',
      role: 'HRD / Lead Recruiter, Kozak Group',
      tag: 'Погляд з боку HR',
      text: 'Понад 10 років в IT-рекрутингу. Чесна розмова «рекрутер vs розробник», і друга частина вже готується з вашими питаннями.',
    },
    en: {
      short: 'Yuliia',
      role: 'HRD / Lead Recruiter, Kozak Group',
      tag: 'The view from HR',
      text: 'Over 10 years in IT recruiting. An honest “recruiter vs developer” talk — and part two is being prepared with your questions.',
    },
  },
  {
    slug: 'serhii-lytvyn',
    stream: '022',
    root: {
      short: 'Сергій',
      role: 'Senior Frontend / Agentic UI розробник',
      tag: 'Цифри замість хайпу',
      text: 'Розібрав свіжі дослідження WEF, Stack Overflow і DORA: які навички дорожчають в епоху AI, і дав план на два роки.',
    },
    en: {
      short: 'Serhii',
      role: 'Senior Frontend / Agentic UI Developer',
      tag: 'Data instead of hype',
      text: 'Went through fresh WEF, Stack Overflow and DORA research: which skills gain value in the AI era — and gave a two-year plan.',
    },
  },
  {
    slug: 'ihor-kotov',
    stream: '013',
    root: {
      short: 'Ігор',
      role: 'Full Stack і Java Developer, студент',
      tag: 'Перший виступ',
      text: 'Студент без комерційного досвіду вийшов в ефір із ґрунтовним розбором STAR-методу. Бути «експертом» не обов’язково.',
    },
    en: {
      short: 'Ihor',
      role: 'Full Stack & Java Developer, student',
      tag: 'A first talk',
      text: 'A student with no commercial experience went live with a thorough breakdown of the STAR method. You don’t have to be an “expert”.',
    },
  },
]
