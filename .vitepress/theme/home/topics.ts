// One topic per stream, set in the stream page's frontmatter: `topic: ai`.
// This list is the only source of truth: an unknown or missing topic fails the build (see streamParse.ts),
// so "AI" vs "ai" typos can't split the counters on the home page and in the archive.
//
// `human: true` marks the people-side topics (career, community) — they get the warm accent,
// so "technical and human on equal terms" is visible at a glance.

export const TOPICS = {
  ai: { root: 'AI та агенти', en: 'AI & agents' },
  security: { root: 'Безпека', en: 'Security' },
  frontend: { root: 'JavaScript і фронтенд', en: 'JavaScript & frontend' },
  backend: { root: 'Бекенд, хмара, DevOps', en: 'Backend, cloud & DevOps' },
  career: { root: "Кар'єра і найм", en: 'Career & hiring', human: true },
  community: { root: "Про ком'юніті", en: 'About the community', human: true },
} as const satisfies Record<string, { root: string; en: string; human?: boolean }>

export type TopicKey = keyof typeof TOPICS

export function isTopic(value: unknown): value is TopicKey {
  return typeof value === 'string' && Object.hasOwn(TOPICS, value)
}

export function isHuman(key: TopicKey): boolean {
  return 'human' in TOPICS[key] && TOPICS[key].human === true
}
