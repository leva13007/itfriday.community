import { createContentLoader } from 'vitepress'

// Posts for the home page: title = the page's H1 (frontmatter `title` is sometimes a short SEO title),
// date from frontmatter. Index pages are skipped.
export interface Post { url: string; title: string; date: number; tags: string[] }
export interface PostsData { root: Post[]; en: Post[] }

declare const data: PostsData
export { data }

export default createContentLoader(['posts/*.md', 'en/posts/*.md'], {
  includeSrc: true,
  transform(pages): PostsData {
    const out: PostsData = { root: [], en: [] }
    for (const page of pages) {
      if (page.url.endsWith('/posts/') || !page.frontmatter.date) continue
      const h1 = page.src?.match(/^#\s+(.+?)\s*$/m)?.[1]
      const post: Post = {
        url: page.url.replace(/\.html$/, ''),
        title: (h1 ?? page.frontmatter.title ?? '').replace(/`/g, ''),
        date: new Date(page.frontmatter.date).getTime(),
        tags: page.frontmatter.tags ?? [],
      }
      ;(page.url.startsWith('/en/') ? out.en : out.root).push(post)
    }
    out.root.sort((a, b) => b.date - a.date)
    out.en.sort((a, b) => b.date - a.date)
    return out
  },
})
