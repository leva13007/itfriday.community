<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHome } from '../home/useHome'
import { TOPICS, isHuman, isTopic, type TopicKey } from '../home/topics'

// The streams archive (/streams/, /en/streams/), built from the stream pages themselves:
// a new streams/NNN.md shows up here on its own — no table to update by hand.
// `?topic=ai` preselects a topic (links from the home page); the URL follows the chosen chip.
const { t, all, isEn, prefix } = useHome()
const loc = computed(() => (isEn.value ? 'en' : 'root'))

const topic = ref<TopicKey | null>(null)
onMounted(() => {
  const q = new URLSearchParams(location.search).get('topic')
  if (isTopic(q)) topic.value = q
})
function pick(key: TopicKey | null) {
  topic.value = key
  const url = new URL(location.href)
  if (key) url.searchParams.set('topic', key)
  else url.searchParams.delete('topic')
  history.replaceState(history.state, '', url)
}

const chips = computed(() => {
  const counts = new Map<TopicKey, number>()
  for (const s of all.value) counts.set(s.topic, (counts.get(s.topic) ?? 0) + 1)
  return (Object.keys(TOPICS) as TopicKey[])
    .filter((k) => counts.has(k))
    .map((key) => ({ key, label: TOPICS[key][loc.value], count: counts.get(key)!, human: isHuman(key) }))
})

const rows = computed(() => (topic.value ? all.value.filter((s) => s.topic === topic.value) : all.value))
const fmtDate = (ms: number) =>
  new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/London', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(ms))
</script>

<template>
  <div class="archive">
    <div class="chips" role="group" :aria-label="t.archiveFilter">
      <button type="button" class="itf-chip" :class="{ active: topic === null }" :aria-pressed="topic === null" @click="pick(null)">
        {{ t.archiveAll }} <span class="count">{{ all.length }}</span>
      </button>
      <button
        v-for="c in chips"
        :key="c.key"
        type="button"
        class="itf-chip"
        :class="{ human: c.human && topic !== c.key, active: topic === c.key }"
        :aria-pressed="topic === c.key"
        @click="pick(c.key)"
      >{{ c.label }} <span class="count">{{ c.count }}</span></button>
    </div>

    <p class="summary" aria-live="polite">{{ t.archiveCount(rows.length) }}</p>

    <table v-if="rows.length">
      <thead>
        <tr>
          <th>{{ t.archiveCols.num }}</th>
          <th>{{ t.archiveCols.date }}</th>
          <th>{{ t.archiveCols.title }}</th>
          <th v-if="!topic">{{ t.archiveCols.topic }}</th>
          <th>{{ t.archiveCols.speakers }}</th>
          <th>{{ t.archiveCols.video }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in rows" :key="s.num">
          <td><a :href="s.url">{{ s.num }}</a></td>
          <td class="nowrap">{{ fmtDate(s.start) }}</td>
          <td>{{ s.title }}</td>
          <td v-if="!topic">{{ TOPICS[s.topic][loc] }}</td>
          <td>
            <template v-for="(sp, i) in s.speakers" :key="sp.slug">
              <span v-if="i"> · </span><a class="nowrap" :href="`${prefix}/speakers/${sp.slug}`">{{ sp.name }}</a>
            </template>
          </td>
          <td><a v-if="s.youtube" :href="s.youtube" target="_blank" rel="noopener">{{ t.archiveWatch }}</a></td>
        </tr>
      </tbody>
    </table>
    <p v-else class="summary">{{ t.archiveEmpty }}</p>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 8px;
}
.summary {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.nowrap { white-space: nowrap; }
</style>
