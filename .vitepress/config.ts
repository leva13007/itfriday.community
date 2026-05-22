import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',

  themeConfig: {
    logo: { dark: '/logo-light.png', light: '/logo-dark.png' },
    siteTitle: false,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://itfriday.community/logo-dark.png' }],
  ],

  locales: {
    root: {
      lang: 'uk-UA',
      label: 'Українська',
      title: 'ІТ П\'ятниця',
      description: 'Онлайн-ком\'юніті для українських IT-спеціалістів по всьому світу',
      themeConfig: {
        nav: [
          { text: 'Про нас', link: '/about' },
          { text: 'Стріми', link: '/streams/' },
          { text: 'Спікери', link: '/speakers' },
          { text: 'Новини', link: '/news/' },
          { text: 'Вікі', link: '/wiki/mission' },
          { text: 'Розклад', link: '/schedule' },
          { text: 'Issues', link: '/issues' },
        ],
        sidebar: {
          '/wiki/': [
            {
              text: 'Документи',
              items: [
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
          { icon: { svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>' }, link: 'https://t.me/+QRJNFfHaLxMwYzcy' },
        ],
        editLink: undefined,
        footer: {
          message: 'ІТ П\'ятниця · @zloyleva',
        },
      },
    },
    en: {
      lang: 'en-US',
      label: 'English',
      title: 'IT Friday',
      description: 'Online community for Ukrainian IT professionals worldwide',
      themeConfig: {
        nav: [
          { text: 'About', link: '/en/about' },
          { text: 'Streams', link: '/en/streams/' },
          { text: 'Speakers', link: '/en/speakers' },
          { text: 'News', link: '/en/news/' },
          { text: 'Wiki', link: '/en/wiki/mission' },
          { text: 'Schedule', link: '/en/schedule' },
          { text: 'Issues', link: '/en/issues' },
        ],
        sidebar: {
          '/en/wiki/': [
            {
              text: 'Documents',
              items: [
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
          { icon: { svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>' }, link: 'https://t.me/+QRJNFfHaLxMwYzcy' },
        ],
        editLink: undefined,
        footer: {
          message: 'IT Friday · @zloyleva',
        },
      },
    },
  },

})
