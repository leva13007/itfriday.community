<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { data } from '../home/streams.data'
import { strings } from '../home/i18n'

// Lite YouTube facade: until the click the page loads only our own cover (no YouTube JS,
// no cookies, ~0 KB third-party). Click → real iframe with autoplay, the view counts on YouTube.
// Without JS it is a plain link to the video. Data comes from streams.data.ts — no props needed.
const { page, localeIndex } = useData()
const isEn = computed(() => localeIndex.value === 'en')
const t = computed(() => strings[isEn.value ? 'en' : 'root'])

const stream = computed(() => {
  const num = page.value.relativePath.match(/streams\/(\d{3})\.md$/)?.[1]
  return data[isEn.value ? 'en' : 'root'].find((s) => s.num === num) ?? null
})
const id = computed(() => stream.value?.youtube?.match(/live\/([\w-]+)/)?.[1] ?? null)
const playing = ref(false)

function play(e: MouseEvent) {
  // Let ctrl/cmd/middle-click open YouTube in a new tab as a normal link
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  playing.value = true
}
</script>

<template>
  <div v-if="stream && id" class="stream-video">
    <iframe
      v-if="playing"
      :src="`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`"
      :title="`#${stream.num} — ${stream.title}`"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    />
    <a v-else class="facade" :href="`https://www.youtube.com/watch?v=${id}`" @click="play">
      <!-- LCP element: load it first; width/height reserve the box before it arrives (QA #16) -->
      <img :src="stream.thumb" :alt="`#${stream.num} — ${stream.title}`" width="1380" height="776" fetchpriority="high" decoding="async" />
      <!-- Chrome that mimics the real YouTube embed, so it reads as a player, not a picture -->
      <span class="play" aria-hidden="true">
        <svg viewBox="0 0 68 48"><path class="bg" d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.3.3 34 .3 34 .3s-21.3 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" /><path d="M45 24 27 14v20z" fill="#fff" /></svg>
      </span>
      <span class="badge" aria-hidden="true">
        <svg viewBox="0 0 68 48"><path fill="#f00" d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.3.3 34 .3 34 .3s-21.3 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" /><path d="M45 24 27 14v20z" fill="#fff" /></svg>
        {{ t.watchHere }}
      </span>
      <span class="sr-only">{{ t.playVideo }}</span>
    </a>
  </div>
</template>

<style scoped>
.stream-video {
  position: relative;
  aspect-ratio: 16 / 9;
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}
.stream-video iframe,
.facade,
.facade img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.facade img {
  object-fit: cover;
  margin: 0;
}
.play {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 84px;
  height: 59px;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
  transition: transform 0.15s;
}
.play .bg {
  fill: #f00;
}
.facade:hover .play,
.facade:focus-visible .play {
  transform: translate(-50%, -50%) scale(1.1);
}
.badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
}
.badge svg {
  width: 20px;
  height: 14px;
}
@media (max-width: 480px) {
  .play { width: 68px; height: 48px; }
  .badge { left: 8px; bottom: 8px; font-size: 12px; }
}
.facade:focus-visible {
  outline: 3px solid var(--vp-c-brand-1);
  outline-offset: -3px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
