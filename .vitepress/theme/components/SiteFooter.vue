<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { VPImage, useSidebar } from 'vitepress/theme'
import { strings, LINKS } from '../home/i18n'

// Site-wide footer (replaces the one-line default). Like the default VPFooter it is hidden on pages
// with a sidebar (wiki), where the fixed sidebar would sit on top of it.
const { localeIndex, frontmatter, page, theme } = useData()
const { hasSidebar } = useSidebar()

const isEn = computed(() => localeIndex.value === 'en')
const t = computed(() => strings[isEn.value ? 'en' : 'root'])
const p = computed(() => (isEn.value ? '/en' : ''))
const year = new Date().getFullYear()

// "Other language" goes to the mirror of the current page (every page has one — see CLAUDE.md, i18n)
const otherLang = computed(() => {
  const rel = page.value.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  return isEn.value ? '/' + rel.replace(/^en\/?/, '') : '/en/' + rel
})

const columns = computed(() => [
  {
    title: t.value.footerContent,
    links: [
      { text: t.value.footerLinks.streams, href: `${p.value}/streams/` },
      { text: t.value.footerLinks.posts, href: `${p.value}/posts/` },
      { text: t.value.footerLinks.schedule, href: `${p.value}/schedule` },
    ],
  },
  {
    title: t.value.footerCommunity,
    links: [
      { text: t.value.footerLinks.speakers, href: `${p.value}/speakers` },
      { text: t.value.footerLinks.speak, href: `${p.value}/speak` },
      { text: t.value.footerLinks.about, href: `${p.value}/about` },
      { text: t.value.footerLinks.wiki, href: `${p.value}/wiki/` },
    ],
  },
  {
    title: t.value.footerHelp,
    links: [
      { text: t.value.footerLinks.issues, href: `${p.value}/issues` },
      { text: t.value.footerLinks.github, href: LINKS.github, external: true },
      { text: t.value.footerLinks.otherLang, href: otherLang.value, lang: isEn.value ? 'uk' : 'en' },
    ],
  },
])
</script>

<template>
  <footer v-if="frontmatter.footer !== false && !hasSidebar" class="site-footer">
    <div class="inner">
      <div class="brand">
        <a :href="`${p}/`" class="logo-link">
          <VPImage class="logo" :image="theme.logo" :alt="t.title" />
        </a>
        <p class="tagline">{{ t.footerTagline }}</p>
      </div>
      <nav v-for="col in columns" :key="col.title" class="col" :aria-label="col.title">
        <p class="col-title">{{ col.title }}</p>
        <a
          v-for="l in col.links"
          :key="l.href"
          :href="l.href"
          :lang="l.lang"
          :target="l.external ? '_blank' : undefined"
          :rel="l.external ? 'noopener' : undefined"
        >{{ l.text }}</a>
      </nav>
    </div>
    <div class="bottom"><p class="copy">{{ t.footerCopy(year) }}</p></div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}
.inner {
  display: grid;
  gap: 32px;
  max-width: 1152px;
  margin: 0 auto;
  padding: 48px 24px 24px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}
@media (min-width: 640px) { .inner { padding: 48px 48px 24px; } }
@media (min-width: 960px) {
  .inner { padding: 48px 64px 24px; grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr)); }
}
.brand { grid-column: 1 / -1; }
@media (min-width: 960px) { .brand { grid-column: auto; } }
.logo-link { display: inline-block; }
.logo-link :deep(.logo) { height: 28px; width: auto; }
.tagline {
  margin: 12px 0 0;
  max-width: 320px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
}
.col-title {
  margin: 0 0 4px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.col a {
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}
.col a:hover { color: var(--vp-c-brand-1); }
.bottom {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 32px;
}
@media (min-width: 640px) { .bottom { padding: 0 48px 32px; } }
@media (min-width: 960px) { .bottom { padding: 0 64px 32px; } }
.copy {
  margin: 0;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
