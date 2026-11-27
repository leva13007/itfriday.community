<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHome } from '../home/useHome'
import { STORIES } from '../home/stories'

const { t, prefix, all, isEn } = useHome()

// Full names come from the stream pages (same source as everywhere else); a story whose guest
// isn't linked from any stream yet is skipped.
const items = computed(() => {
  const names = new Map(all.value.flatMap((s) => s.guests.map((g) => [g.slug, g.name] as const)))
  return STORIES.filter((s) => names.has(s.slug)).map((s) => {
    const loc = s[isEn.value ? 'en' : 'root']
    return {
      slug: s.slug,
      name: names.get(s.slug)!,
      ...loc,
      href: s.stream ? `${prefix.value}/streams/${s.stream}` : `${prefix.value}/speakers/${s.slug}`,
      linkText: s.stream ? t.value.streamLink(s.stream) : t.value.profileLink,
    }
  })
})

const picked = ref(0)
const current = computed(() => items.value[picked.value] ?? items.value[0])
</script>

<template>
  <section class="home-section" v-if="current">
    <div class="home-container">
      <div class="section-head">
        <h2 class="section-title">{{ t.communityTitle }}</h2>
        <a class="section-link" :href="`${prefix}/speakers`">{{ t.allSpeakers }}</a>
      </div>

      <div class="people" role="group" :aria-label="t.communityTabs">
        <button
          v-for="(p, i) in items"
          :key="p.slug"
          type="button"
          class="person"
          :class="{ active: i === picked }"
          :aria-pressed="i === picked"
          @click="picked = i"
        >
          <img :src="`/speakers/${p.slug}.jpg`" alt="" width="40" height="40" loading="lazy" />
          <span>{{ p.short }}</span>
        </button>
        <a class="person you" :href="`${prefix}/speak`">
          <span class="plus" aria-hidden="true">+</span>
          <span>{{ t.youCouldBeHere }}</span>
        </a>
      </div>

      <article class="story" aria-live="polite">
        <img class="photo" :src="`/speakers/${current.slug}.jpg`" :alt="current.name" width="140" height="140" loading="lazy" />
        <div class="content">
          <p class="tag">{{ current.tag }}</p>
          <p class="text">{{ current.text }}</p>
          <div class="who">
            <a class="who-name" :href="`${prefix}/speakers/${current.slug}`">
              <span class="name">{{ current.name }}</span>
              <span class="role">{{ current.role }}</span>
            </a>
            <a class="link" :href="current.href">{{ current.linkText }}</a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.people {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.person {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 5px 16px 5px 5px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.person:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-text-1); }
.person.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}
.person img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--vp-c-bg-alt);
}
.person.you {
  border-style: dashed;
  color: var(--vp-c-brand-1);
  background: transparent;
}
.plus {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  font-size: 22px;
  font-weight: 400;
}
.story {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  padding: 28px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
  border-radius: 20px;
  background: linear-gradient(180deg, var(--vp-c-brand-soft), var(--vp-c-bg-soft));
}
.photo {
  flex: none;
  width: 120px;
  height: 120px;
  border-radius: 24px;
  object-fit: cover;
  background: var(--vp-c-bg-alt);
}
@media (min-width: 768px) {
  .story { padding: 36px; gap: 36px; }
  .photo { width: 140px; height: 140px; }
}
.content {
  flex: 1 1 360px;
  min-width: 0;
}
.tag {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}
.text {
  margin: 12px 0 0;
  font-size: 20px;
  line-height: 1.45;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-wrap: pretty;
}
@media (min-width: 768px) {
  .text { font-size: 22px; }
}
.who {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  margin-top: 20px;
}
.name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.who-name:hover .name { color: var(--vp-c-brand-1); }
.role {
  display: block;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.link {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  padding: 10px 0;
}
.link:hover { text-decoration: underline; }
</style>
