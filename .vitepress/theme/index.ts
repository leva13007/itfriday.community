import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeHero from './components/HomeHero.vue'
import HomeLatest from './components/HomeLatest.vue'
import HomeSpeakers from './components/HomeSpeakers.vue'
import HomeCta from './components/HomeCta.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('HomeLatest', HomeLatest)
    app.component('HomeSpeakers', HomeSpeakers)
    app.component('HomeCta', HomeCta)
  },
} satisfies Theme
