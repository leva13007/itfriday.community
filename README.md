---
status: active
category: community
stack: VitePress, GitHub Pages, pnpm
---

# itfriday.community

Public website for the [IT Friday](https://itfriday.community) community — weekly live streams for Ukrainian IT professionals worldwide.

Built with [VitePress](https://vitepress.dev). Deployed to GitHub Pages via GitHub Actions on every push to `main`.

---

## Dev

```bash
pnpm dev        # localhost:5173
pnpm build      # build → .vitepress/dist/
pnpm preview    # preview built site
```

## Content updates

After each stream — add a new page:

```bash
# Create stream page (UA + EN)
streams/NNN.md
en/streams/NNN.md

# Update stream index (UA + EN)
streams/index.md
en/streams/index.md

# Copy thumbnail
public/streams/NNN.png
```

## Version bump

```bash
pnpm version patch   # 1.0.0 → 1.0.1  (fixes, content updates)
pnpm version minor   # 1.0.0 → 1.1.0  (new features, new sections)
pnpm version major   # 1.0.0 → 2.0.0  (breaking redesign)
```

## Deploy

Push to `main` → GitHub Actions → GitHub Pages → live at [itfriday.community](https://itfriday.community) in ~1 min.

## Next Step

Publish stream page for the most recent IT Friday stream: create `streams/NNN.md` (UA + EN) and update `streams/index.md`.
