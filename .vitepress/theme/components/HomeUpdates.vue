<script setup lang="ts">
import { computed } from 'vue'
import { useHome } from '../home/useHome'
import { LINKS } from '../home/i18n'
import { data as posts } from '../home/posts.data'

const { t, lang, prefix, isEn } = useHome()

const latestPosts = computed(() => posts[isEn.value ? 'en' : 'root'].slice(0, 3))
const fmtDate = (ms: number) => new Intl.DateTimeFormat(lang.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ms))

const channels = computed(() => [
  { key: 'youtube', name: 'YouTube', href: LINKS.youtube, text: t.value.channels.youtube },
  { key: 'telegram', name: 'Telegram', href: LINKS.telegram, text: t.value.channels.telegram },
  { key: 'discord', name: 'Discord', href: LINKS.discord, text: t.value.channels.discord },
  { key: 'linkedin', name: 'LinkedIn', href: LINKS.linkedin, text: t.value.channels.linkedin },
])
</script>

<template>
  <section class="home-section">
    <div class="home-container split">
      <div class="posts" v-if="latestPosts.length">
        <div class="section-head">
          <h2 class="section-title">{{ t.postsTitle }}</h2>
          <a class="section-link" :href="`${prefix}/posts/`">{{ t.allPosts }}</a>
        </div>
        <a v-for="p in latestPosts" :key="p.url" class="post" :href="p.url">
          <span class="post-date">{{ fmtDate(p.date) }}</span>
          <span class="post-title">{{ p.title }}</span>
        </a>
      </div>

      <div class="channels">
        <div class="section-head">
          <h2 class="section-title">{{ t.channelsTitle }}</h2>
        </div>
        <a v-for="c in channels" :key="c.key" class="channel" :class="c.key" :href="c.href" target="_blank" rel="noopener">
          <span class="icon" aria-hidden="true">
            <svg v-if="c.key === 'youtube'" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            <svg v-else-if="c.key === 'telegram'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 4 3 11l6 2 2 6 3-4 5 4z" /></svg>
            <svg v-else-if="c.key === 'discord'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z" /></svg>
            <span v-else class="in">in</span>
          </span>
          <span>
            <span class="channel-name">{{ c.name }}</span>
            <span class="channel-text">{{ c.text }}</span>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.split {
  display: grid;
  gap: 40px;
}
@media (min-width: 960px) {
  .split { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 56px; }
}
.post {
  display: block;
  padding: 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.post:last-child { border-bottom: none; }
.post-date {
  display: block;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.post-title {
  display: block;
  margin-top: 4px;
  font-size: 17px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}
.post:hover .post-title { color: var(--vp-c-brand-1); }
.channel {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}
.channel:hover { border-color: var(--vp-c-brand-1); }
.icon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.icon svg { width: 18px; height: 18px; }
.in { font-size: 15px; font-weight: 800; }
.channel-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.channel-text {
  display: block;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
