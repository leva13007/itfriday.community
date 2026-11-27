<script setup lang="ts">
import { computed } from 'vue'
import { useHome } from '../home/useHome'
import { TOPICS, isHuman, type TopicKey } from '../home/topics'

const { t, prefix, past, isEn } = useHome()

// Topics of finished streams, biggest first; a topic with no streams yet is not shown
const topics = computed(() => {
  const counts = new Map<TopicKey, number>()
  for (const s of past.value) counts.set(s.topic, (counts.get(s.topic) ?? 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, count, label: TOPICS[key][isEn.value ? 'en' : 'root'], human: isHuman(key) }))
})
</script>

<template>
  <section class="home-section" v-if="topics.length">
    <div class="home-container">
      <div class="box">
        <div class="intro">
          <h2 class="section-title">{{ t.topicsTitle }}</h2>
          <p class="text">{{ t.topicsText }}</p>
        </div>
        <div class="chips">
          <a
            v-for="tp in topics"
            :key="tp.key"
            class="itf-chip"
            :class="{ human: tp.human }"
            :href="`${prefix}/streams/?topic=${tp.key}`"
          >{{ tp.label }} <span class="count">{{ tp.count }}</span></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.box {
  display: grid;
  gap: 24px;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-alt);
}
@media (min-width: 960px) {
  .box { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); align-items: center; gap: 32px; padding: 32px; }
}
.text {
  margin: 8px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
