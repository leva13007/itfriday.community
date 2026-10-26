<script setup lang="ts">
import { computed } from 'vue'
import { useHome } from '../home/useHome'

const { t, prefix, past } = useHome()

// Guests ranked by number of appearances; name taken from their latest stream.
const speakers = computed(() => {
  const map = new Map<string, { slug: string; name: string; count: number }>()
  for (const s of past.value) {
    for (const g of s.guests) {
      const cur = map.get(g.slug)
      if (cur) cur.count++
      else map.set(g.slug, { ...g, count: 1 })
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count)
})

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')
function hideBroken(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden'
}
</script>

<template>
  <section class="home-section" v-if="speakers.length">
    <div class="home-container">
      <div class="section-head">
        <h2 class="section-title">{{ t.speakers }}</h2>
        <a class="section-link" :href="`${prefix}/speakers`">{{ t.allSpeakers }}</a>
      </div>
      <div class="list">
        <a v-for="sp in speakers" :key="sp.slug" class="speaker" :href="`${prefix}/speakers/${sp.slug}`">
          <span class="avatar">
            <span class="initials">{{ initials(sp.name) }}</span>
            <img :src="`/speakers/${sp.slug}.jpg`" :alt="sp.name" loading="lazy" @error="hideBroken" />
          </span>
          <span>
            <span class="name">{{ sp.name }}</span>
            <span class="count">{{ t.appearances(sp.count) }}</span>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
.speaker {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: border-color 0.2s;
}
.speaker:hover { border-color: var(--vp-c-brand-1); }
.avatar {
  position: relative;
  flex: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--vp-c-brand-soft);
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
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.count {
  display: block;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
