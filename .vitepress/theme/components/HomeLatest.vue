<script setup lang="ts">
import { computed } from 'vue'
import { useHome } from '../home/useHome'
import { formatDay } from '../home/time'

const { t, lang, prefix, past } = useHome()
// Four fill one row on desktop and two rows of two on tablets — no lonely card at the end
const latest = computed(() => past.value.slice(0, 4))
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
          <span class="cover">
            <img class="thumb" :src="s.thumb" :alt="`#${s.num}`" width="1380" height="776" loading="lazy" decoding="async" />
            <span v-if="s.duration" class="duration">{{ t.duration(s.duration) }}</span>
          </span>
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
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr));
}
@media (min-width: 640px) and (max-width: 1023px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
.cover { position: relative; display: block; }
.thumb {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: var(--vp-c-bg-alt);
}
.duration {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgb(0 0 0 / 0.8);
  font-size: 12px;
  font-weight: 600;
  color: #fff;
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
