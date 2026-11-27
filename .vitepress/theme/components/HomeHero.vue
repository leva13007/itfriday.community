<script setup lang="ts">
import { computed } from 'vue'
import { VPButton } from 'vitepress/theme'
import { useHome } from '../home/useHome'
import { LINKS, YOUTUBE_SUBSCRIBERS } from '../home/i18n'
import NextStream from './NextStream.vue'

const { t, prefix, past, all } = useHome()

// Host + every guest who has a page link on any stream
const speakerCount = computed(() => new Set(all.value.flatMap((s) => s.guests.map((g) => g.slug))).size + 1)

// Hours on air: shown only when every finished stream has `duration` in its frontmatter (`pnpm durations`),
// otherwise the number would silently undercount.
const hours = computed(() => {
  if (!past.value.length || past.value.some((s) => s.duration === null)) return null
  return Math.floor(past.value.reduce((sum, s) => sum + (s.duration ?? 0), 0) / 3600)
})
</script>

<template>
  <section class="home-hero">
    <div class="home-container hero-grid">
      <div class="info">
        <p class="eyebrow">
          <span class="dot" aria-hidden="true" />
          <span>{{ t.eyebrow }} · {{ t.eyebrowLang }}</span>
        </p>
        <h1 class="name">{{ t.heroTitle }}<br /><span class="accent">{{ t.heroAccent }}</span></h1>
        <p class="lead">{{ t.lead }}</p>
        <div class="actions">
          <VPButton theme="brand" :text="t.joinTelegram" :href="LINKS.telegram" />
          <VPButton theme="alt" :text="t.watchRecordings" :href="`${prefix}/streams/`" />
        </div>
        <dl class="stats">
          <div class="stat">
            <dt>{{ past.length }}</dt>
            <dd>{{ t.statStreams(past.length) }}</dd>
          </div>
          <div class="stat" v-if="hours !== null">
            <dt>{{ hours }}</dt>
            <dd>{{ t.statHours(hours) }}</dd>
          </div>
          <div class="stat">
            <dt>{{ YOUTUBE_SUBSCRIBERS }}</dt>
            <dd>{{ t.statYoutube }}</dd>
          </div>
          <div class="stat">
            <dt>{{ speakerCount }}</dt>
            <dd>{{ t.statSpeakers(speakerCount) }}</dd>
          </div>
        </dl>
      </div>
      <NextStream />
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  padding: 40px 0 32px;
}
.hero-grid {
  display: grid;
  gap: 40px;
  align-items: center;
}
@media (min-width: 960px) {
  .home-hero { padding: 72px 0 48px; }
  .hero-grid { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 56px; }
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  padding: 6px 14px;
  border: 1px solid var(--itf-warm-border);
  border-radius: 999px;
  background: var(--itf-warm-soft);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--itf-warm-1);
}
.dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--itf-warm-2);
  box-shadow: 0 0 0 4px var(--itf-warm-soft);
}
.name {
  margin: 0;
  font-size: 36px;
  line-height: 1.08;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.03em;
}
.accent { color: var(--vp-c-brand-1); }
/* Sized so "Живий стрім про IT" stays on one line: full width below 960px, half the grid above */
@media (min-width: 640px) { .name { font-size: 56px; } }
@media (min-width: 960px) { .name { font-size: 44px; } }
@media (min-width: 1200px) { .name { font-size: 54px; } }
.lead {
  margin: 20px 0 0;
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 540px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 32px 0 0;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
@media (min-width: 640px) {
  .stats { grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); }
}
.stat dt {
  font-size: 30px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}
.stat dd {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
