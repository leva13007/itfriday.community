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
  speakers.md       # Hall of Speakers index (UA)
  speakers/
    oleh-levchenko.md          # Speaker profile (UA)
    oleksandr-blazheiko.md
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
    speakers.md
    speakers/
    wiki/
  public/
    CNAME           # Custom domain: itfriday.community
    favicon.png     # Square icon mark (IT circle)
    logo-dark.png   # Full logo, dark version
    logo-light.png  # Full logo, light version
    streams/        # Stream thumbnails: NNN.png
    speakers/       # Speaker photos: {slug}.jpg (when provided)
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
3. Copy thumbnail to `public/streams/NNN.png`
4. Content: thumbnail, date, participants (with profile links), key theses, YouTube link, resources

---

## Hall of Speakers

**`/speakers`** — grid of everyone who has appeared on IT Friday. Social proof + speaker visibility.

### How it works

- `speakers.md` and `en/speakers.md` — index pages with a custom Vue grid (compact cards: avatar + name + role)
- `speakers/{slug}.md` and `en/speakers/{slug}.md` — individual profile pages
- Avatars: real photo in `public/speakers/{slug}.jpg` (preferred) or DiceBear placeholder: `https://api.dicebear.com/9.x/pixel-art/svg?seed={slug}`

### Adding a new speaker

1. Add their entry to the `speakers` array in `speakers.md` and `en/speakers.md`
2. Create `speakers/{slug}.md` (UA) and `en/speakers/{slug}.md` (EN) — copy from an existing profile
3. If they provided a photo: save to `public/speakers/{slug}.jpg`
4. Update the stream page(s) where they appeared — link their name to their profile

### Speaker profile slug convention

`firstname-lastname` in Latin, lowercase, hyphenated. Example: `oleksandr-blazheiko`.

### Table sort order — newest first

**All tables on the site must be sorted newest-first (descending by date):**
- Speaker profile "Appearances" tables: most recent stream at the top
- Stream index (`streams/index.md`): most recent stream at the top

When adding a new entry to any table, insert it at the **top**, not the bottom.

### Speaker data to collect (before publishing profile)

Mandatory: full name (UA + EN), title/role (UA + EN), LinkedIn URL, project link (if demoing).
Optional: company, city/country.
See full checklist in `streams/CLAUDE.md` → "Guest / Speaker Info".

### Avatars

- Ask the speaker directly — best quality
- If no photo: DiceBear `pixel-art` style auto-generates a unique avatar from the slug seed
- To replace placeholder with real photo later: put `{slug}.jpg` in `public/speakers/` and update the `avatar` field in `speakers.md`

### Future ideas (not yet implemented)

- **Gamification** — badges for speakers: "First speaker", "3 appearances", "Most discussed", etc.
- **Voting** — community votes for best talk after each stream (needs backend or Telegram poll integration)
- **Data loader** — `speakers.data.ts` VitePress data loader to auto-generate index from speaker markdown files instead of manually maintaining the `speakers` array

---

## News Section (`/news`)

**`/news/index.md`** (UA) and **`/en/news/index.md`** (EN) — community news index.

### Adding a news post

1. Create `news/YYYY-MM-DD-slug.md` (UA) and `en/news/YYYY-MM-DD-slug.md` (EN)
2. Add frontmatter:
   ```markdown
   ---
   title: "..."
   date: YYYY-MM-DD
   tags: [community]   # or: [it-news], or both
   ---
   ```
3. Add a link entry at the top of `news/index.md` and `en/news/index.md`

**Tags:**
- `community` — announcements, pauses, format changes, community events
- `it-news` — tech news digests tied to a specific stream (#7 format)

Future: a VitePress data loader + Vue component for tag filtering. For now, maintain the list manually.

---

## Issues / Feedback (`/issues`)

**`/issues.md`** (UA) and **`/en/issues.md`** (EN) — explains how to report problems.

Three channels:
- **Site bugs** → GitHub Issues: `github.com/leva13007/itfriday.community/issues`
- **Talk inaccuracies** → Telegram chat (content repo is private for now)
- **Missing promised materials** → Telegram chat with `#матеріали` tag

When the content repo becomes public on GitHub, update `issues.md` to add a direct GitHub link for content issues.

---

## Deploy

Push to `main` → GitHub Actions runs `pnpm build` → deploys to GitHub Pages → live at itfriday.community within ~1 minute.

Do **not** manually edit `.vitepress/dist/` — it is regenerated on every build.
