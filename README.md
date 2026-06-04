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
site/streams/NNN.md
site/en/streams/NNN.md

# Update stream index (UA + EN)
site/streams/index.md
site/en/streams/index.md

# Copy thumbnail
site/public/streams/NNN.png
```

## Version bump

```bash
pnpm version patch   # 1.0.0 → 1.0.1  (fixes, content updates)
pnpm version minor   # 1.0.0 → 1.1.0  (new features, new sections)
pnpm version major   # 1.0.0 → 2.0.0  (breaking redesign)
```

## Deploy

Push to `main` → GitHub Actions → GitHub Pages → live at [itfriday.community](https://itfriday.community) in ~1 min.
