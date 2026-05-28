---
title: Спікери
---

<script setup>
const speakers = [
  {
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=oleh-levchenko',
    name: 'Олег Левченко',
    title: 'Senior Full Stack Developer · Засновник IT Friday',
    org: 'The AA',
    profile: '/speakers/oleh-levchenko',
  },
  {
    avatar: '/speakers/oleksandr-blazheiko.jpg',
    name: 'Олександр Блажейко',
    title: 'Software Development Engineer',
    org: 'itvibe.party',
    profile: '/speakers/oleksandr-blazheiko',
  },
]
</script>

# Спікери

Усі хто виходив в ефір на IT Friday.

<div class="speakers-grid">
  <a v-for="s in speakers" :key="s.name" :href="s.profile" class="speaker-card">
    <img :src="s.avatar" :alt="s.name" class="speaker-avatar" />
    <div class="speaker-info">
      <strong>{{ s.name }}</strong>
      <span>{{ s.title }}</span>
      <span class="speaker-org">{{ s.org }}</span>
    </div>
  </a>
</div>

<style>
.speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 24px;
}
.speaker-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, background-color 0.2s;
}
.speaker-card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}
.speaker-avatar {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  flex-shrink: 0;
}
.speaker-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.speaker-info strong {
  font-size: 14px;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}
.speaker-info span {
  font-size: 12px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.speaker-org {
  color: var(--vp-c-brand-1) !important;
}
</style>
