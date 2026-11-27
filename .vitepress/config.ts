import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type HeadConfig } from 'vitepress'
import { parse as parseStream } from './theme/home/streamParse'

const SITE = 'https://itfriday.community'
const ROOT = resolve(__dirname, '..')

/** `en/streams/027.md` → `/en/streams/027`, `streams/index.md` → `/streams/` (matches cleanUrls) */
function pathOf(relativePath: string) {
  return '/' + relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
}

export default defineConfig({
  base: '/',

  // One URL per page: /page (not /page.html) — GitHub Pages serves both, canonical points here
  cleanUrls: true,

  sitemap: { hostname: SITE },

  // Internal docs and repo meta files — never published to the site
  srcExclude: ['notes/**', 'README.md', 'CLAUDE.md', 'CHANGELOG.md', '**/CLAUDE.md'],

  themeConfig: {
    siteTitle: false,
    // Built-in local search (MiniSearch, no external service) — QA #15.
    // Index is per locale; the default modal strings are English, so UA gets its own (QA #5).
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Пошук', buttonAriaLabel: 'Пошук по сайту' },
              modal: {
                displayDetails: 'Показати детальний список',
                resetButtonTitle: 'Очистити пошук',
                backButtonTitle: 'Закрити пошук',
                noResultsText: 'Нічого не знайдено за запитом',
                footer: {
                  selectText: 'відкрити',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: 'перейти',
                  navigateUpKeyAriaLabel: 'стрілка вгору',
                  navigateDownKeyAriaLabel: 'стрілка вниз',
                  closeText: 'закрити',
                  closeKeyAriaLabel: 'Escape',
                },
              },
            },
          },
        },
      },
    },
  },

  // Default github-light/dark token colors fall below WCAG AA 4.5:1 on the code block background
  markdown: {
    theme: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    // Umami Cloud analytics — only counts visits on the production domain
    ['script', {
      defer: '',
      src: 'https://cloud.umami.is/script.js',
      'data-website-id': '5a2bd2f4-f241-47d7-832e-91b5ada7e52d',
      'data-domains': 'itfriday.community',
    }],
  ],

  // Stream headings end with " · Guest Name" — keep that in the H1, drop it from <title>/og:title
  // (the guest is already in the description) so titles stay closer to ~60 chars (QA #12)
  transformPageData(pageData) {
    if (/^(?:en\/)?streams\/\d{3}\.md$/.test(pageData.relativePath)) {
      pageData.title = pageData.title.replace(/\s+·\s+[^·]+$/, '')
    }
  },

  // Per-page SEO + link previews (Telegram, LinkedIn, Discord) — QA #12
  transformHead({ title, description, pageData }) {
    const rel = pageData.relativePath
    const head: HeadConfig[] = [
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
    ]
    // Generic share card (1200×630) for pages without their own cover — per locale
    const card = rel.startsWith('en/') ? '/og-image-en.png' : '/og-image.png'
    if (pageData.isNotFound || rel === '404.md') {
      head.push(['meta', { property: 'og:image', content: SITE + card }])
      return head
    }

    const url = SITE + pathOf(rel)
    head.push(['link', { rel: 'canonical', href: url }], ['meta', { property: 'og:url', content: url }])

    // Stream pages: their own cover instead of the generic logo
    const num = rel.match(/^(?:en\/)?streams\/(\d{3})\.md$/)?.[1]
    const cover = num && existsSync(resolve(ROOT, `public/streams/${num}.png`)) ? `/streams/${num}.png` : null
    head.push(
      ['meta', { property: 'og:image', content: SITE + (cover ?? card) }],
      ['meta', { property: 'og:image:width', content: cover ? '1380' : '1200' }],
      ['meta', { property: 'og:image:height', content: cover ? '776' : '630' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    )

    // VideoObject JSON-LD: Google can show the page as a video result (the video is embedded via <StreamVideo />).
    // Only for streams that already happened — an upcoming stream has no uploadDate yet.
    if (num) {
      const stream = parseStream(pathOf(rel), readFileSync(resolve(ROOT, rel), 'utf8'))
      const id = stream?.youtube?.match(/live\/([\w-]+)/)?.[1]
      if (stream && id && stream.start <= Date.now()) {
        head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: title,
          description,
          thumbnailUrl: [SITE + (cover ?? card), `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`],
          uploadDate: new Date(stream.start).toISOString(),
          embedUrl: `https://www.youtube.com/embed/${id}`,
          url,
          inLanguage: 'uk',
        })])
      }
    }

    // hreflang: UA page ↔ its en/ mirror, only when both exist
    const ua = rel.startsWith('en/') ? rel.slice(3) : rel
    const en = `en/${ua}`
    if (existsSync(resolve(ROOT, ua)) && existsSync(resolve(ROOT, en))) {
      head.push(
        ['link', { rel: 'alternate', hreflang: 'uk', href: SITE + pathOf(ua) }],
        ['link', { rel: 'alternate', hreflang: 'en', href: SITE + pathOf(en) }],
        ['link', { rel: 'alternate', hreflang: 'x-default', href: SITE + pathOf(ua) }],
      )
    }
    return head
  },

  locales: {
    root: {
      lang: 'uk-UA',
      label: 'Українська',
      title: 'ІТ П\'ятниця',
      description: 'Онлайн-ком\'юніті для IT-спеціалістів по всьому світу',
      themeConfig: {
        // siteTitle is hidden, so alt is the logo link's only accessible name
        logo: { dark: '/logo-light.png', light: '/logo-dark.png', alt: 'ІТ П\'ятниця' },
        // Short on purpose: the rest (schedule, become a speaker, wiki, issues) lives in the site footer
        nav: [
          { text: 'Стріми', link: '/streams/' },
          { text: 'Спікери', link: '/speakers' },
          { text: 'Публікації', link: '/posts/' },
          { text: 'Про нас', link: '/about' },
        ],
        sidebar: {
          '/wiki/': [
            {
              text: 'Документи',
              items: [
                { text: 'Огляд', link: '/wiki/' },
                { text: 'Місія', link: '/wiki/mission' },
                { text: 'Цінності', link: '/wiki/values' },
                { text: 'Формати стрімів', link: '/wiki/formats' },
                { text: 'Управління', link: '/wiki/governance' },
              ],
            },
          ],
        },
        socialLinks: [
          { icon: 'youtube', link: 'https://youtube.com/@zloyleva' },
          { icon: 'linkedin', link: 'https://www.linkedin.com/company/it-friday/' },
          { icon: 'discord', link: 'https://discord.gg/ZpWpDQq2EP' },
          { icon: { svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>' }, link: 'https://t.me/+QRJNFfHaLxMwYzcy' },
        ],
        editLink: undefined,
        // Default theme UI strings are English-only — translate them for the UA locale
        outline: { label: 'На цій сторінці' },
        docFooter: { prev: 'Попередня сторінка', next: 'Наступна сторінка' },
        darkModeSwitchLabel: 'Тема',
        lightModeSwitchTitle: 'Увімкнути світлу тему',
        darkModeSwitchTitle: 'Увімкнути темну тему',
        sidebarMenuLabel: 'Меню',
        returnToTopLabel: 'Нагору',
        langMenuLabel: 'Змінити мову',
        skipToContentLabel: 'Перейти до вмісту',
        lastUpdated: { text: 'Оновлено' },
        notFound: {
          title: 'СТОРІНКУ НЕ ЗНАЙДЕНО',
          quote: 'Схоже, цієї сторінки немає — або посилання застаріло. Почнімо з головної.',
          linkLabel: 'перейти на головну',
          linkText: 'На головну',
        },
      },
    },
    en: {
      lang: 'en-US',
      label: 'English',
      title: 'IT Friday',
      description: 'Online community for IT professionals worldwide',
      themeConfig: {
        logo: { dark: '/logo-light.png', light: '/logo-dark.png', alt: 'IT Friday' },
        nav: [
          { text: 'Streams', link: '/en/streams/' },
          { text: 'Speakers', link: '/en/speakers' },
          { text: 'Posts', link: '/en/posts/' },
          { text: 'About', link: '/en/about' },
        ],
        sidebar: {
          '/en/wiki/': [
            {
              text: 'Documents',
              items: [
                { text: 'Overview', link: '/en/wiki/' },
                { text: 'Mission', link: '/en/wiki/mission' },
                { text: 'Values', link: '/en/wiki/values' },
                { text: 'Stream Formats', link: '/en/wiki/formats' },
                { text: 'Governance', link: '/en/wiki/governance' },
              ],
            },
          ],
        },
        socialLinks: [
          { icon: 'youtube', link: 'https://youtube.com/@zloyleva' },
          { icon: 'linkedin', link: 'https://www.linkedin.com/company/it-friday/' },
          { icon: 'discord', link: 'https://discord.gg/ZpWpDQq2EP' },
          { icon: { svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>' }, link: 'https://t.me/+QRJNFfHaLxMwYzcy' },
        ],
        editLink: undefined,
      },
    },
  },

})
