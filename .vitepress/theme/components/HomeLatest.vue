<script setup lang="ts">
import { computed } from 'vue'
import { useHome } from '../home/useHome'
import { formatDay } from '../home/time'

const { t, lang, prefix, past } = useHome()
const latest = computed(() => past.value.slice(0, 3))
</script>

<template>
  <section class="home-section">
    <div class="home-container">
      <div class="section-head">
        <h2 class="section-title">{{ t.latest }}</h2>
        <a class="section-link" :href="`${prefix}/streams/`">{{ t.allStreams(past.length) }}</a>
      </div>
      <div class="grid">
        <a v-for="s in latest" :key="s.num" class="card" :href="s.url">
          <img class="thumb" :src="s.thumb" :alt="`#${s.num}`" loading="lazy" />
          <div class="body">
            <p class="meta">#{{ s.num }} · {{ formatDay(s.start, lang, false) }}</p>
            <p class="title">{{ s.title }}</p>
            <p class="meta">{{ s.guests.length ? s.guests.map((g) => g.name).join(', ') : t.solo }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--vp-c-brand-1); }
.thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: var(--vp-c-bg-alt);
}
.body { padding: 14px 16px 16px; }
.title {
  margin: 6px 0;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
