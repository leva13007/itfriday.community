# CLAUDE.md — itfriday.community

Guidance for working in the public community website repo.

For project-wide context (mission, formats, governance, stream content) see the private content repo
`~/projects/community/it_community_stuff/` and its `CLAUDE.md`. That repo is the source of truth;
this one is the public showcase.

---

## What This Is

The public website for the IT Friday community: **[itfriday.community](https://itfriday.community)**

Built with **VitePress** (static site generator). **Standalone repo** (sibling of `it_community_stuff`, not nested in it) — own GitHub repository (`leva13007/itfriday.community`, public), deploys via GitHub Actions → GitHub Pages.

**Package manager: pnpm** (`pnpm-lock.yaml` is the lock file).

---

## Commands (run from the repo root)

```bash
pnpm dev        # Dev server → localhost:5173
pnpm build      # Build static files to .vitepress/dist/
pnpm preview    # Preview the built site locally
pnpm images     # Optimise new covers / speaker photos (see "Performance" quality rule)
```

---

## Folder Structure

```
./
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
  speak.md          # Become a Speaker — CTA + application deadline (UA)
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
    og-image.png    # Share card 1200×630 for pages without a cover (UA); og-image-en.png for EN
    apple-touch-icon.png  # 180×180 home-screen icon
    streams/        # Stream covers: NNN.png (og:image) + NNN.webp (shown on pages, made by `pnpm images`)
    speakers/       # Speaker photos: {slug}.jpg, short side ≤ 240 px (when provided)
  scripts/
    optimize-images.sh  # `pnpm images` — covers → WebP, speaker photos → 240 px + no EXIF (needs: brew install webp jpeg)
    fetch-durations.mjs # `pnpm durations` (from YouTube, needs YOUTUBE_API_KEY) / `pnpm durations:sync` (UA → EN, no key)
  notes/            # Internal research/plans/brainstorms — NOT published (srcExclude)
  .vitepress/
    config.ts       # Nav, sidebar, i18n config, srcExclude
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
1. Create `streams/NNN.md` (UA) and `en/streams/NNN.md` (EN) with frontmatter:
   ```yaml
   ---
   description: "..."   # see "Page descriptions" below
   topic: ai            # ONE key from .vitepress/theme/home/topics.ts — unknown or missing fails the build
   duration: 1:32:10    # after the stream — see step 7
   ---
   ```
2. Nothing to add to `streams/index.md` — the archive table (`<StreamArchive />`) is built from the stream pages, with a topic filter (`/streams/?topic=ai`)
3. Copy thumbnail to `public/streams/NNN.png`, then run `pnpm images` — it creates `NNN.webp`, which is what the page shows (the ~2 MB PNG is only for `og:image`). Commit both
4. Content: `<StreamVideo />` right under the H1 (not a `![]()` cover), date, participants (with profile links), key theses, YouTube link, resources
   - `<StreamVideo />` is a lite-YouTube facade: shows `public/streams/NNN.webp` (falls back to `.png`), loads the real player only on click. It takes the video ID from the `youtube.com/live/…` link on the page — keep that link in that exact form
   - Past streams also get `VideoObject` JSON-LD automatically (`transformHead` in `config.ts`) — nothing to add by hand
5. Resources section must include: LinkedIn, Telegram, Discord links (in that order after content-specific links)
6. Add a row at the **top** of the "Appearances" table in **every** participant's profile (`speakers/{slug}.md` + `en/speakers/{slug}.md`) — **including the host `oleh-levchenko`**, who is the one most often forgotten (QA issue #9)
7. After the stream is over, add its `duration:`. By hand: write it in `streams/NNN.md` (UA) only and run `pnpm durations:sync` — it copies every UA duration into `en/streams/` and rewrites the planned length at the end of the `**Формат:**` / `**Format:**` line (`~60 хвилин`) to the real one (`2 год 58 хв` / `2 h 58 min`) on both locales. Or automatically: `YOUTUBE_API_KEY=... pnpm durations` fetches it from YouTube into both locales (the key stays in your shell, never in the repo). The home page shows "hours on air" only when every finished stream has a duration
8. Run the pre-commit checks from "Quality rules" below
9. If the stream has a curated chat file (`it_community_stuff/streams/NNN/stream-NN-chat.md`), add a `## З чату` / `## From the chat` section — see "Chat highlights" below
10. Release: announcing a new stream bumps `version` to `1.NNN.0` (post-stream edits are patches) + `CHANGELOG.md` entry + `vX.Y.Z` tag — see "Versioning & changelog"

### Chat highlights (`## З чату` / `## From the chat`)

The live chat is part of the stream: viewers' questions and ideas get credited on the page, like speakers get profiles. First used on #026.

- **Placement:** after `## Таймкоди` / `## Timecodes`, before `## Ресурси` / `## Resources`.
- **Curated, never a raw dump:** 3–7 items. Only technical questions, ideas and constructive critique. No greetings, no personal or off-topic messages (relocation, visas, private life).
- **Item shape:** a `>` quote with the YouTube handle in bold (`**@handle:**`), then a `→` line saying what happened next: answered live (with a timecode link once timecodes exist), open question → Discord, idea → noted/backlog, became a future stream topic.
- **Quotes:** verbatim but trimmed to the point; fix nothing except obvious typos. EN page translates them and says so once in the intro line.
- **Handles as shown in YouTube** — never guess or add a real name.
- **Opt-out line** in the intro of every section: removal on request via Telegram. Honour removal requests on both locales.
- Source of truth for what to publish: `stream-NN-chat.md` in `it_community_stuff` (curated from the raw `chat/chat.md`).

---

## Become a Speaker (`/speak`)

**`/speak.md`** and **`/en/speak.md`** — CTA page for people who want to apply to speak. States the application deadline (Tuesday inclusive for that week's Friday — canonical source: content repo's `docs/governance.md` → "Дедлайн подачі заявок на виступ"). Linked from the site footer, the home page CTA and the top of `/speakers`.

---

## Home page

`index.md` / `en/index.md` are a stack of components from `.vitepress/theme/components/` (`HomeHero`, `HomeTopics`, `HomeLatest`, `HomeCommunity`, `HomeUpdates`, `HomeCta`). Everything except the copy is data-driven:

- streams, next stream, topics, hours on air, speakers count — `home/streams.data.ts` (stream pages)
- posts — `home/posts.data.ts` (newest 3)
- "Faces of the community" — `home/stories.ts`: one short, checkable story per guest (UA + EN). New guest → add a story there
- YouTube subscribers — `YOUTUBE_SUBSCRIBERS` in `home/i18n.ts`, updated by hand
- UI strings — `home/i18n.ts` (both locales)

The top nav is deliberately short (Streams, Speakers, Posts, About). Schedule, Become a speaker, Wiki and Issues live in the site footer (`components/SiteFooter.vue`, mounted in `theme/index.ts` via the `layout-bottom` slot; hidden on sidebar pages like the default footer).

Share cards: pages without their own cover use `public/og-image.png` / `og-image-en.png` (1200×630).

---

## Hall of Speakers

**`/speakers`** — grid of everyone who has appeared on IT Friday. Social proof + speaker visibility.

### How it works

- `speakers.md` and `en/speakers.md` — index pages with a custom Vue grid (compact cards: avatar + name + role)
- `speakers/{slug}.md` and `en/speakers/{slug}.md` — individual profile pages
- Avatars: real photo in `public/speakers/{slug}.jpg` (preferred) or DiceBear placeholder: `https://api.dicebear.com/9.x/pixel-art/svg?seed={slug}`

### Adding a new speaker

1. Add their entry to the `speakers` array in `speakers.md` and `en/speakers.md`
2. Create `speakers/{slug}.md` (UA) and `en/speakers/{slug}.md` (EN) — copy from an existing profile, update its `description:`
3. If they provided a photo: save to `public/speakers/{slug}.jpg` and run `pnpm images` (resizes it to 240 px). Give the profile `<img>` both `width="120"` and the matching `height`
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

## Posts Section (`/posts`)

**`/posts/index.md`** (UA) and **`/en/posts/index.md`** (EN) — community blog / publications index.

No fixed schedule. Publish when there's something worth saying.

### Content tiers

| Tier | Length | When to use |
|------|--------|-------------|
| Нотатка / Note | 200–400 words | A thought, observation, quick reaction |
| Пост / Post | 500–800 words | A topic with context, a story |
| Стаття / Article | 1000+ words | Deep-dive, structured material |

### Adding a post

1. Create `posts/YYYY-MM-DD-slug.md` (UA) and `en/posts/YYYY-MM-DD-slug.md` (EN)
2. Add frontmatter:
   ```markdown
   ---
   title: "..."
   description: "..."
   date: YYYY-MM-DD
   tags: [community]   # community | tech | career
   ---
   ```
3. Add a link entry at the **top** of `posts/index.md` and `en/posts/index.md` (newest first)

**Tags:**
- `community` — about the community, pauses, format changes, events
- `tech` — technical content, tools, ecosystem
- `career` — career, relocation, burnout, job search

Future: a VitePress data loader + Vue component for tag filtering. For now, maintain the list manually.

---

## Issues / Feedback (`/issues`)

**`/issues.md`** (UA) and **`/en/issues.md`** (EN) — explains how to report problems.

Three channels:
- **Site bugs** → GitHub Issues: `github.com/leva13007/itfriday.community/issues`
- **Talk inaccuracies** → Telegram chat (content repo is private for now)
- **Missing promised materials** → Telegram chat with `#матеріали` tag

When the content repo becomes public on GitHub, update `issues.md` to add a direct GitHub link for content issues.

### QA bug workflow

A QA team files site bugs as GitHub issues labelled `bug` (with REQ-/TC- references to their own test docs). When fixing:
- One commit per issue, message ends with `Fixes #N` so the issue closes on merge
- After fixing, add the root cause as a rule to "Quality rules" below if it could happen again
- If a fix touches something an open `notes/` document mentions, update that note too (strike through + date)

---

## Internal Notes (`/notes`)

Research, plans, idea breakdowns, brainstorms. Excluded from the VitePress build via `srcExclude` in `.vitepress/config.ts` (together with `README.md` and `CLAUDE.md`) — never rendered on the site.

**But the repo is public on GitHub** — notes are visible there. No secrets, personal data, or private arrangements with speakers.

Adding a note:
1. Create `notes/YYYY-MM-DD-slug.md` with frontmatter: `title`, `date`, `type` (research | plan | idea | brainstorm), `status` (open | in-progress | done | dropped)
2. Add a row at the **top** of the table in `notes/README.md`
3. UA only — no `en/` mirror needed

---

## Page descriptions

Every published page needs its own `description:` in frontmatter — it becomes `<meta name="description">` and `og:description` (link previews in Telegram/LinkedIn). Without it the page falls back to the site-wide description.

- One or two sentences, ≤ ~200 characters, in the page's language
- Streams: `Стрім ІТ П'ятниці #NNN: <тема>. <одне речення з «Про що поговоримо»>` / `IT Friday stream #NNN: <topic>. <one sentence>`
- Speakers: `<Ім'я> — <роль>. Профіль спікера та виступи на ІТ П'ятниці.` / `<Name> — <role>. Speaker profile and talks at IT Friday.`
- **No straight double quotes `"` inside the text** — VitePress doesn't escape them in the meta tag and the attribute breaks. Use «…» (UA) / “…” (EN).

---

## Quality rules (from QA — don't reintroduce fixed bugs)

Each rule below was a real bug, fixed in QA cycle 1 (October 2026). Check them whenever you touch the related area.

| Area | Rule | Was |
|---|---|---|
| Speaker profiles | Every stream a speaker appears on is in their "Appearances" table (UA + EN), host included | #9 |
| Links | Only `https://`, relative and `mailto:` links. Browser-internal URLs (`chrome://`, `about:`, `edge://`, `file://`) go in inline code with a "paste into the address bar" hint, never as `[text](url)` | #8 |
| Images | Every meaningful `<img>`/`![]()` has a non-empty alt. The header logo alt is set per locale in `config.ts` (`logo.alt`); keep it when touching `logo` or `siteTitle` | #6 |
| i18n | No English UI text on UA pages. Default theme strings are translated in `locales.root.themeConfig` (`outline`, `docFooter`, `notFound`, …); custom Vue components take strings from `.vitepress/theme/home/i18n.ts`, never hardcoded | #5 |
| Contrast | Text must meet WCAG AA 4.5:1 in both themes. Keep the high-contrast Shiki themes (`markdown.theme`) and the overrides at the bottom of `.vitepress/theme/style.css`; any new color pair gets its ratio checked | #7 |
| Meta | Every page has its own `description:` (see "Page descriptions") | #4 |
| Performance | Pages never show the raw PNG cover: every `public/streams/NNN.png` has an `NNN.webp` (`pnpm images`), speaker photos are ≤ 240 px on the short side. Every `<img>` has `width` + `height` (or sits in an `aspect-ratio` box) so nothing jumps on load | #16 |
| Navigation | Every section URL (`/streams/`, `/posts/`, `/wiki/`, EN too) opens a page, not a 404 | #14 |

Known open limitation: the mobile hamburger's `aria-label="mobile navigation"` is hardcoded in VitePress 1.6 and stays English.

### Pre-commit checks

```bash
pnpm build                                   # must pass

# Version bumped and in CHANGELOG.md (no output = OK)
v=$(node -p "require('./package.json').version"); grep -q "^## $v " CHANGELOG.md || echo "CHANGELOG missing $v"
git tag -l "v$v" | grep -q . && echo "tag v$v already exists — bump version"

# Speaker profiles list every stream they're linked from (no output = OK)
for f in streams/0*.md; do n=$(basename $f .md); for s in $(grep -o '/speakers/[a-z-]*' $f | sort -u | sed 's#/speakers/##'); do
  grep -q "/streams/$n)" speakers/$s.md || echo "UA missing: $s #$n"
  grep -q "/en/streams/$n)" en/speakers/$s.md || echo "EN missing: $s #$n"
done; done

# No non-web links (no output = OK)
grep -rnE '\]\((chrome|about|edge|file):' --include='*.md' . | grep -v node_modules

# Every cover has its WebP (no output = OK)
for f in public/streams/[0-9][0-9][0-9].png; do [ -f "${f%.png}.webp" ] || echo "no webp: $f"; done

# Pages without a description (no output = OK)
grep -rL '^description:' --include='*.md' streams en/streams speakers en/speakers posts en/posts wiki en/wiki
```

---

## Versioning & changelog

`package.json` `version` is `1.<stream>.<patch>`:
- **minor = number of the latest stream page** — announcing stream #030 bumps to `1.30.0`
- **patch** — every other release (fixes, features, content edits) between streams: `1.30.0` → `1.30.1`
- major stays `1` unless the site is rebuilt from scratch

Every push to `main` that changes the site:
1. Bump `version` in `package.json`
2. Add an entry at the **top** of `CHANGELOG.md` (`## X.Y.Z — YYYY-MM-DD`, sections `Added` / `Changed` / `Fixed` / `Removed`)
3. Commit, then tag: `git tag vX.Y.Z && git push && git push --tags`

`CHANGELOG.md` is in `srcExclude` — not rendered on the site.

---

## Deploy

Push to `main` → GitHub Actions runs `pnpm build` → deploys to GitHub Pages → live at itfriday.community within ~1 minute.

Do **not** manually edit `.vitepress/dist/` — it is regenerated on every build.
