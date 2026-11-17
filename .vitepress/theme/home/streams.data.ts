import { createContentLoader } from 'vitepress'
import { parse, type Stream } from './streamParse'

// Parsing rules live in streamParse.ts (shared with config.ts for VideoObject JSON-LD).
export type { Guest, Stream } from './streamParse'
export interface StreamsData { root: Stream[]; en: Stream[]; builtAt: number }

declare const data: StreamsData
export { data }

export default createContentLoader(['streams/[0-9]*.md', 'en/streams/[0-9]*.md'], {
  includeSrc: true,
  transform(pages): StreamsData {
    const out: StreamsData = { root: [], en: [], builtAt: Date.now() }
    for (const page of pages) {
      const stream = parse(page.url, page.src ?? '')
      if (stream) (page.url.startsWith('/en/') ? out.en : out.root).push(stream)
    }
    out.root.sort((a, b) => b.start - a.start)
    out.en.sort((a, b) => b.start - a.start)
    return out
  },
})
