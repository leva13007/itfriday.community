# Changelog

Versioning: `1.<stream>.<patch>` — see "Versioning" in `CLAUDE.md`.
Newest first. Not published on the site (`srcExclude`).

## 1.29.5 — 2026-11-27

### Added
- Twitch (twitch.tv/zloyleva — streams are simulcast there): header social icon, "Де нас знайти" / "Where to find us" card on the home page, About and Schedule pages, `**Twitch:**` line on stream #029 (UA + EN)
- `CLAUDE.md`: every stream page gets a Twitch line after the YouTube one

## 1.29.4 — 2026-11-27

### Changed
- Positioning: IT Friday is stated as an independent project with no ties to any other community or meetup. All mentions of a third-party meetup removed from the site (footer tagline, About, Mission, Governance, stream #001, internal notes); About and Mission get an explicit independence paragraph, the section is renamed "Передісторія" / "Background" (UA + EN)

## 1.29.3 — 2026-11-27

### Changed
- Stream #029: Oleh Talanov can't join; the stream becomes an open conversation with the audience (solo + Discord voice room). Same topic, new description and format line (UA + EN)
- Speaker profiles: #029 removed from Oleh Talanov; Oleh Levchenko's #029 role changed Interviewer → Speaker
- Stream #029 cover (`029.png` + `029.webp`): new thumbnail for the open-mic format

## 1.29.2 — 2026-11-27

### Fixed
- Home: next-stream countdown gets a "Старт через" / "Starts in" prefix, chips stay on one line (`&nbsp;`) and are vertically centered

## 1.29.1 — 2026-11-27

### Added
- Data-driven home page: HomeHero, HomeTopics, HomeLatest, HomeCommunity (guest stories), HomeUpdates (posts loader), HomeCta
- Stream `topic:` frontmatter (validated at build) and `<StreamArchive />` with a topic filter on `/streams/`
- Site footer (Schedule, Become a speaker, Wiki, Issues); top nav shortened
- Share cards `og-image.png` / `og-image-en.png`, `apple-touch-icon.png`
- `pnpm durations` / `pnpm durations:sync` (`scripts/fetch-durations.mjs`)

### Removed
- HomeSpeakers block on the home page

## Before 1.29.1

No changelog — see `git log` (stream #001 → #029).
