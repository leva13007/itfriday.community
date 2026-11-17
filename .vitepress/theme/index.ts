import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeHero from './components/HomeHero.vue'
import HomeLatest from './components/HomeLatest.vue'
import HomeSpeakers from './components/HomeSpeakers.vue'
import HomeCta from './components/HomeCta.vue'
import NextStream from './components/NextStream.vue'
import StreamVideo from './components/StreamVideo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('HomeLatest', HomeLatest)
    app.component('HomeSpeakers', HomeSpeakers)
    app.component('HomeCta', HomeCta)
    // Also used on /schedule — one source for "next stream" across pages (QA #11)
    app.component('NextStream', NextStream)
    // Stream pages: lite YouTube facade in place of the cover image
    app.component('StreamVideo', StreamVideo)
  },
} satisfies Theme
