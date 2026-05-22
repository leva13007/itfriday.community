# site/CLAUDE.md

Guidance for working inside the `site/` folder (public community website).

For project-wide context see the root `CLAUDE.md`.

---

## What This Is

The public website for the IT Friday community: **[itfriday.community](https://itfriday.community)**

Built with **VitePress** (static site generator). **Separate nested git repo** — has its own `.git`, its own GitHub repository, and deploys independently via GitHub Actions → GitHub Pages.

**Package manager: pnpm** (`pnpm-lock.yaml` is the lock file).

---

## Commands (run from `site/` folder)

```bash
pnpm dev        # Dev server → localhost:5173
pnpm build      # Build static files to .vitepress/dist/
pnpm preview    # Preview the built site locally
```

---

## Folder Structure

```
site/
  index.md          # Ukrainian homepage (default language)
  about.md          # About page (UA)
  schedule.md       # Stream schedule (UA)
  streams/
    index.md        # Streams list (UA)
    001.md          # Stream 001 summary page (UA)
  wiki/             # Community wiki (UA)
    mission.md
    values.md
    formats.md
    governance.md
  en/               # English mirror — same structure under en/
    index.md
    about.md
    schedule.md
    streams/
    wiki/
  public/
    CNAME           # Custom domain: itfriday.community
  .vitepress/
    config.ts       # Nav, sidebar, i18n config
    dist/           # Built output (do not edit manually)
  .github/
    workflows/
      deploy.yml    # Auto-deploy to GitHub Pages on push to main
```

---

## i18n Structure

- Ukrainian (`/`) is the default language
- English (`/en/`) mirrors the same page structure
- Language switcher is configured in `.vitepress/config.ts`
- When adding a new page: create both the UA version and the `en/` mirror

---

## After Each Stream

Add a new stream summary page:
1. Create `streams/NNN.md` (UA) and `en/streams/NNN.md` (EN)
2. Update `streams/index.md` and `en/streams/index.md` to include the new entry
3. Content: title, date, guest (if any), key theses, YouTube link, resources mentioned

---

## Deploy

Push to `main` → GitHub Actions runs `pnpm build` → deploys to GitHub Pages → live at itfriday.community within ~1 minute.

Do **not** manually edit `.vitepress/dist/` — it is regenerated on every build.
