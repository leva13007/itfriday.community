<script setup lang="ts">
import { computed } from 'vue'
import { VPButton } from 'vitepress/theme'
import { useHome } from '../home/useHome'
import { LINKS } from '../home/i18n'
import { calendarLink, formatDay, formatTimes } from '../home/time'

const { t, lang, prefix, past, announced, nextStart, isLive } = useHome()

const day = computed(() => formatDay(nextStart.value, lang.value))
const times = computed(() => formatTimes(nextStart.value))
const guests = computed(() => announced.value?.guests ?? [])
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')
function hideBroken(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden'
}
const calendar = computed(() => {
  const s = announced.value
  if (!s) return ''
  const page = `https://itfriday.community${s.url}`
  return calendarLink(`${t.value.title} #${s.num} — ${s.title}`, s.start, `${t.value.calendarDetails}\n${page}`, s.youtube ?? LINKS.youtubeLive)
})
const latest = computed(() => past.value[0] ?? null)
</script>

<template>
  <div class="next" :class="{ live: isLive }">
    <!-- On air / announced: the page for the next stream already exists -->
    <template v-if="announced">
      <a class="thumb" :href="announced.url">
        <img :src="announced.thumb" :alt="`#${announced.num}`" @error="hideBroken" />
        <span class="badge"><span v-if="isLive" class="dot" />{{ isLive ? t.onAir : t.nextStream }}</span>
      </a>
      <div class="body">
        <p class="label" v-if="!isLive"><span>{{ day }} ·</span><span>{{ times }}</span></p>
        <a class="title" :class="{ first: isLive }" :href="announced.url">#{{ announced.num }} — {{ announced.title }}</a>
        <div class="guests" v-if="guests.length">
          <a v-for="g in guests" :key="g.slug" class="guest" :href="`${prefix}/speakers/${g.slug}`">
            <span class="avatar">
              <span class="initials">{{ initials(g.name) }}</span>
              <img :src="`/speakers/${g.slug}.jpg`" :alt="g.name" loading="lazy" @error="hideBroken" />
            </span>
            <span>
              <span class="guest-role">{{ t.guest }}</span>
              <span class="guest-name">{{ g.name }}</span>
            </span>
          </a>
        </div>
        <p class="meta" v-else>{{ t.solo }}</p>
        <div class="actions">
          <VPButton v-if="isLive" theme="brand" :text="t.watchLive" :href="announced.youtube ?? LINKS.youtubeLive" />
          <template v-else>
            <VPButton theme="brand" :text="t.addToCalendar" :href="calendar" />
            <VPButton theme="alt" :text="t.details" :href="announced.url" />
          </template>
        </div>
      </div>
    </template>

    <!-- On air without a page -->
    <div class="body" v-else-if="isLive">
      <p class="label"><span class="dot" />{{ t.onAir }}</p>
      <div class="actions">
        <VPButton theme="brand" :text="t.watchLive" :href="LINKS.youtubeLive" />
      </div>
    </div>

    <!-- Not announced yet (Saturday → Wednesday) -->
    <div class="body" v-else>
      <p class="label"><span>{{ t.nextStream }} · {{ day }} ·</span><span>{{ times }}</span></p>
      <p class="title">{{ t.tbaTitle }}</p>
      <p class="meta">{{ t.tbaText }}</p>
      <div class="actions">
        <VPButton theme="brand" :text="t.subscribe" :href="LINKS.telegram" />
      </div>
      <a v-if="latest" class="meanwhile" :href="latest.url">{{ t.meanwhile(latest.num) }} →</a>
    </div>
  </div>
</template>

<style scoped>
.next {
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-brand-soft);
  box-shadow: 0 8px 32px -12px color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
}
/* On the tinted card the grey "alt" button would blend in — lift it onto the page background */
.next :deep(.VPButton.alt) { background-color: var(--vp-c-bg); }
.next :deep(.VPButton.alt:hover) { background-color: var(--vp-c-bg-soft); }
.body {
  padding: 20px 24px 24px;
}
.thumb {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  background: var(--vp-c-bg-alt);
}
/* Top-right: the thumbnails carry the logo and episode number in the top-left */
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.25);
}
.live .badge { background: var(--vp-c-danger-1); }
.badge .dot { background: #fff; }
.thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.next.live {
  border-color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  box-shadow: 0 8px 32px -12px color-mix(in srgb, var(--vp-c-danger-1) 45%, transparent);
}
.label {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
.label span { white-space: nowrap; }
.live .label { color: var(--vp-c-danger-1); }
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-danger-1);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse { 50% { opacity: 0.3; } }
@media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
.title {
  display: block;
  margin: 8px 0 0;
  font-size: 20px;
  line-height: 1.35;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-wrap: balance;
  transition: color 0.2s;
}
a.title:hover { color: var(--vp-c-brand-1); }
.title.first { margin-top: 0; }
.guests {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 14px;
}
.guest {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  position: relative;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.avatar img, .initials {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.avatar img { object-fit: cover; }
.initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.guest-role {
  display: block;
  font-size: 12px;
  line-height: 1.3;
  color: var(--vp-c-text-2);
}
.guest-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}
.guest:hover .guest-name { color: var(--vp-c-brand-1); }
.meta {
  margin: 8px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
.meanwhile {
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
.meanwhile:hover { text-decoration: underline; }
</style>
