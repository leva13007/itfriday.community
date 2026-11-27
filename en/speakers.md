---
description: "IT Friday Hall of Speakers: everyone who has appeared on the community's streams, with profiles and talk topics."
title: Speakers
---

<script setup>
import { data } from '../.vitepress/theme/home/streams.data'
import { strings } from '../.vitepress/theme/home/i18n'
import { STREAM_WINDOW_MS } from '../.vitepress/theme/home/time'

// Number of finished streams each speaker is linked from (same data as the home page and the archive)
const count = (slug) => data.en.filter((st) => st.start + STREAM_WINDOW_MS <= data.builtAt && st.speakers.some((sp) => sp.slug === slug)).length
const appearances = strings.en.appearances

const speakers = [
  {
    avatar: '/speakers/oleh-levchenko.jpg',
    name: 'Oleh Levchenko',
    title: 'Full Stack Developer · IT Friday Founder',
    org: 'The AA',
    profile: '/en/speakers/oleh-levchenko',
  },
  {
    avatar: '/speakers/oleh-talanov.jpg',
    name: 'Oleh Talanov',
    title: 'CTO & Co-Founder · WebCap Digitals',
    org: 'WebCap Digitals',
    profile: '/en/speakers/oleh-talanov',
  },
  {
    avatar: '/speakers/oleksandr-blazheiko.jpg',
    name: 'Oleksandr Blazheiko',
    title: 'Software Development Engineer',
    org: 'itvibe.party',
    profile: '/en/speakers/oleksandr-blazheiko',
  },
  {
    avatar: '/speakers/ihor-kotov.jpg',
    name: 'Ihor Kotov',
    title: 'Aspiring Full Stack & Java Developer',
    org: 'Petro Mohyla Black Sea National University',
    profile: '/en/speakers/ihor-kotov',
  },
  {
    avatar: '/speakers/serhii-lytvyn.jpg',
    name: 'Serhii Lytvyn',
    title: 'Senior Frontend / Agentic UI Developer',
    org: 'AAA game development',
    profile: '/en/speakers/serhii-lytvyn',
  },
  {
    avatar: '/speakers/yuliia-kaiunko.jpg',
    name: 'Yuliia Kaiunko',
    title: 'HRD / Lead Recruiter',
    org: 'Kozak Group',
    profile: '/en/speakers/yuliia-kaiunko',
  },
  {
    avatar: '/speakers/vladyslav-barankevych.jpg',
    name: 'Vladyslav Barankevych',
    title: 'iOS Developer',
    org: 'Sombra',
    profile: '/en/speakers/vladyslav-barankevych',
  },
]
</script>

# Speakers

Everyone who has appeared on IT Friday.

Want to be next? → [Become a Speaker](/en/speak)

<div class="speakers-grid">
  <a v-for="s in speakers" :key="s.name" :href="s.profile" class="speaker-card">
    <div class="speaker-top">
      <img :src="s.avatar" :alt="s.name" class="speaker-avatar" width="56" height="56" loading="lazy" />
      <span v-if="count(s.profile.split('/').pop())" class="speaker-count">{{ appearances(count(s.profile.split('/').pop())) }}</span>
    </div>
    <div class="speaker-info">
      <strong>{{ s.name }}</strong>
      <span>{{ s.title }}</span>
      <span class="speaker-org">{{ s.org }}</span>
    </div>
  </a>
</div>

<style>
/* Card: photo + stream count on top, text below at full card width (so names and roles never squeeze) */
.speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: 12px;
  margin-top: 24px;
}
.vp-doc .speaker-card {
  text-decoration: none;
}
.speaker-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  color: inherit;
  transition: border-color 0.2s, background-color 0.2s;
}
.speaker-card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}
.speaker-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.speaker-avatar {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}
.speaker-count {
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.7;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}
.speaker-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.speaker-info strong {
  font-size: 15px;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}
.speaker-info span {
  font-size: 13px;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}
.speaker-info .speaker-org {
  color: var(--vp-c-brand-1);
}
</style>
