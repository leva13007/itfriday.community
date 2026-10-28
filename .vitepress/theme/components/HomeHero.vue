<script setup lang="ts">
import { computed } from 'vue'
import { VPButton } from 'vitepress/theme'
import { useHome } from '../home/useHome'
import { LINKS } from '../home/i18n'
import { TZ } from '../home/time'
import NextStream from './NextStream.vue'

const { t, lang, prefix, past, all } = useHome()

const speakerCount = computed(() => new Set(all.value.flatMap((s) => s.guests.map((g) => g.slug))).size + 1)

// Year as the big number, "травня" / "May" in the label — genitive month in Ukrainian comes from a day+month format.
const since = computed(() => {
  const first = all.value[all.value.length - 1]
  if (!first) return null
  const parts = new Intl.DateTimeFormat(lang.value, { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' })
    .formatToParts(new Date(first.start))
  return {
    month: parts.find((p) => p.type === 'month')?.value ?? '',
    year: parts.find((p) => p.type === 'year')?.value ?? '',
  }
})
</script>

<template>
  <section class="home-hero">
    <div class="home-container hero-grid">
      <div class="info">
        <h1 class="name">{{ t.title }}</h1>
        <p class="subtitle">{{ t.subtitle }}</p>
        <p class="lead">{{ t.lead }}</p>
        <dl class="stats">
          <div class="stat">
            <dt>{{ past.length }}</dt>
            <dd>{{ t.statStreams(past.length) }}</dd>
          </div>
          <div class="stat">
            <dt>{{ speakerCount }}</dt>
            <dd>{{ t.statSpeakers(speakerCount) }}</dd>
          </div>
          <div class="stat" v-if="since">
            <dt>{{ since.year }}</dt>
            <dd>{{ t.statSince(since.month) }}</dd>
          </div>
        </dl>
        <div class="actions">
          <VPButton theme="brand" :text="t.joinTelegram" :href="LINKS.telegram" />
          <VPButton theme="alt" :text="t.watchRecordings" :href="`${prefix}/streams/`" />
        </div>
      </div>
      <NextStream />
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  padding: 48px 0 32px;
}
.hero-grid {
  display: grid;
  gap: 32px;
  align-items: center;
}
@media (min-width: 960px) {
  .home-hero { padding: 80px 0 48px; }
  .hero-grid { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 48px; }
}
.name {
  margin: 0;
  font-size: 40px;
  line-height: 1.15;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: -0.02em;
}
.subtitle {
  margin: 4px 0 0;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
@media (min-width: 640px) {
  .name { font-size: 56px; }
  .subtitle { font-size: 44px; }
}
.lead {
  margin: 16px 0 0;
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 520px;
}
.stats {
  display: flex;
  flex-wrap: wrap;
  margin: 28px 0 0;
}
.stat {
  padding: 0 24px;
  border-left: 1px solid var(--vp-c-divider);
}
.stat:first-child {
  padding-left: 0;
  border-left: none;
}
.stat dt {
  font-size: 32px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}
.stat dd {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
@media (max-width: 420px) {
  .stat { padding: 0 14px; }
  .stat dt { font-size: 26px; }
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}
</style>
