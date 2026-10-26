import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import { data } from './streams.data'
import { STREAM_WINDOW_MS, nextFridayStart } from './time'
import { strings } from './i18n'

// `now` starts at build time so SSR and first client render match,
// then switches to the real clock after mount and ticks every minute.
const now = ref(data.builtAt)

export function useHome() {
  const { localeIndex, lang } = useData()

  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    now.value = Date.now()
    timer = setInterval(() => (now.value = Date.now()), 60_000)
  })
  onUnmounted(() => timer && clearInterval(timer))

  const isEn = computed(() => localeIndex.value === 'en')
  const t = computed(() => strings[isEn.value ? 'en' : 'root'])
  const prefix = computed(() => (isEn.value ? '/en' : ''))
  const all = computed(() => data[isEn.value ? 'en' : 'root'])

  /** Streams that are fully over, newest first. */
  const past = computed(() => all.value.filter((s) => s.start + STREAM_WINDOW_MS <= now.value))

  /** Announced stream that hasn't finished yet (page exists with a future date). */
  const announced = computed(() =>
    [...all.value].reverse().find((s) => s.start + STREAM_WINDOW_MS > now.value) ?? null,
  )

  const nextStart = computed(() => announced.value?.start ?? nextFridayStart(now.value))
  const isLive = computed(() => now.value >= nextStart.value && now.value < nextStart.value + STREAM_WINDOW_MS)

  return { now, t, lang, prefix, all, past, announced, nextStart, isLive }
}
