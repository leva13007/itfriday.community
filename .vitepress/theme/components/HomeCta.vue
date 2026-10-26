<script setup lang="ts">
import { VPButton } from 'vitepress/theme'
import { useHome } from '../home/useHome'

const { t, prefix } = useHome()
</script>

<template>
  <section class="home-section">
    <div class="home-container">
      <div class="cta">
        <div class="cta-main">
          <div>
            <h2 class="section-title">{{ t.ctaTitle }}</h2>
            <p class="text">{{ t.ctaText }}</p>
          </div>
          <VPButton class="button" theme="brand" :text="t.ctaButton" :href="`${prefix}/speak`" />
        </div>
        <!-- Optional temporary note (e.g. a form for an upcoming stream) — pass it as slot content -->
        <div v-if="$slots.default" class="note"><slot /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  border-radius: 16px;
  padding: 28px;
  background: var(--vp-c-brand-soft);
}
.cta-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 768px) {
  .cta-main { flex-direction: row; align-items: center; justify-content: space-between; gap: 32px; }
}
.button { flex: none; }
.text {
  margin: 8px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 640px;
}
.note {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.note :deep(p) { margin: 0; }
.note :deep(a) { color: var(--vp-c-brand-1); font-weight: 500; }
.note :deep(a:hover) { text-decoration: underline; }
</style>
