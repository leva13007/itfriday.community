<script setup lang="ts">
import { computed } from 'vue'
import { VPButton } from 'vitepress/theme'
import { useHome } from '../home/useHome'
import { LINKS } from '../home/i18n'
import { calendarLink, formatDay, formatTimes } from '../home/time'

const { t, lang, prefix, past, announced, nextStart, isLive } = useHome()

const when = computed(() => `${formatDay(nextStart.value, lang.value)} · ${formatTimes(nextStart.value)}`)
const guestLine = computed(() => {
  const g = announced.value?.guests ?? []
  return g.length ? `${t.value.guest}: ${g.map((x) => x.name).join(', ')}` : t.value.solo
})
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
    <!-- On air -->
    <template v-if="isLive">
      <p class="label"><span class="dot" />{{ t.onAir }}</p>
      <p class="title" v-if="announced">#{{ announced.num }} — {{ announced.title }}</p>
      <p class="meta" v-if="announced">{{ guestLine }}</p>
      <div class="actions">
        <VPButton theme="brand" :text="t.watchLive" :href="announced?.youtube ?? LINKS.youtubeLive" />
      </div>
    </template>

    <!-- Announced (page for the next stream already exists) -->
    <template v-else-if="announced">
      <p class="label">{{ t.nextStream }} · {{ when }}</p>
      <p class="title">#{{ announced.num }} — {{ announced.title }}</p>
      <p class="meta">{{ guestLine }}</p>
      <div class="actions">
        <VPButton theme="brand" :text="t.addToCalendar" :href="calendar" />
        <VPButton theme="alt" :text="t.details" :href="announced.url" />
      </div>
    </template>

    <!-- Not announced yet (Saturday → Wednesday) -->
    <template v-else>
      <p class="label">{{ t.nextStream }} · {{ when }}</p>
      <p class="title">{{ t.tbaTitle }}</p>
      <p class="meta">{{ t.tbaText }}</p>
      <div class="actions">
        <VPButton theme="brand" :text="t.subscribe" :href="LINKS.telegram" />
      </div>
      <a v-if="latest" class="meanwhile" :href="latest.url">{{ t.meanwhile(latest.num) }} →</a>
    </template>
  </div>
</template>

<style scoped>
.next {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
}
.next.live {
  border-color: var(--vp-c-danger-1);
}
.label {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
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
  margin: 10px 0 0;
  font-size: 22px;
  line-height: 1.3;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
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
