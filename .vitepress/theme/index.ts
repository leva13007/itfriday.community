import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeHero from './components/HomeHero.vue'
import HomeTopics from './components/HomeTopics.vue'
import HomeLatest from './components/HomeLatest.vue'
import HomeCommunity from './components/HomeCommunity.vue'
import HomeUpdates from './components/HomeUpdates.vue'
import HomeCta from './components/HomeCta.vue'
import NextStream from './components/NextStream.vue'
import StreamVideo from './components/StreamVideo.vue'
import StreamArchive from './components/StreamArchive.vue'
import SiteFooter from './components/SiteFooter.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  // Site-wide footer in place of the default one-liner (themeConfig.footer is unset in config.ts)
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(SiteFooter) }),
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('HomeTopics', HomeTopics)
    app.component('HomeLatest', HomeLatest)
    app.component('HomeCommunity', HomeCommunity)
    app.component('HomeUpdates', HomeUpdates)
    app.component('HomeCta', HomeCta)
    // Also used on /schedule — one source for "next stream" across pages (QA #11)
    app.component('NextStream', NextStream)
    // Stream pages: lite YouTube facade in place of the cover image
    app.component('StreamVideo', StreamVideo)
    // /streams/ and /en/streams/: archive table built from the stream pages, with topic filter
    app.component('StreamArchive', StreamArchive)
  },
} satisfies Theme
