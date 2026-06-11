# Overnight plan — richardthedesigner.com

**The promise:** you wake up to a populated, refined, progressively improved site, a changelog of everything done, and a short list of things only you can decide. No permission requests after you sign off tonight. Each layer is a complete checkpoint: if anything fails mid-run, everything before it still stands.

---

## Where things stand right now (00:15)

- Studio live on project `dbfopugh`, schema deployed, TypeGen run (CC, earlier tonight)
- CC's frontend (`web/`, Next.js + next-sanity) scaffolded and being built
- **All 23 content documents written and published** — 8 case studies, 10 projects, 5 musings
- siteSettings filled (intro, ticker, contact, curated grid order — pending final publish)
- Image import package built in `import/` (no write token on my side, so binaries need one command from you — see Layer 6)

---

## The layers

### Layer 1 — Content QA + publish ✅ (mostly done)
GROQ audit across every document: unique slugs, no empty bodies, standfirsts everywhere, all five story tags covered, order collisions fixed. Grid curated to lead with strength: **Kiosk → Online Ordering → Evo → Orson → Brotique → Strunk**, then the rest. Everything published. Remaining: publish siteSettings.

### Layer 2 — Review + redraft (tone of voice)
A genuine second-pass edit, not a re-read. Every piece checked against:
- **Your register** — direct, UK English, confident, no hedging, no em dashes, none of the AI-flagged vocabulary (per the writing-voice rules)
- **Standfirsts** — each one must work as a grid rollover line, not just a summary
- **Rhythm** — varied sentence and paragraph length, openings that start on substance
- **Consistency** — same person wrote all 23 pieces; terminology identical across them (e.g. "guest" not "user" in hospitality pieces)

Redrafts go straight back into Sanity and republish.

### Layer 3 — Frontend verification
When `web/` stops changing (CC finishing), I install and production-build it in my sandbox, boot it, and crawl everything: home grid with all 19 work items, every detail page, musings index, info page, 404 behaviour, and how missing hero images degrade (most pieces have no imagery yet — the fallback must look intentional, not broken).

### Layer 4 — UI/UX + responsiveness
Reviewed against your approved prototypes (`bn-grid-smalt-riffs-v2.html`, `bn-article-motion-v2.html`):
- Type system: Fraunces display / IBM Plex Sans / IBM Plex Mono, scale and weights as per prototypes
- Palette: paper/ink/smalt accents, dark article treatment
- Grid behaviour: rollovers, filter chips for the five story tags, ticker
- Responsive: 360px / 768px / 1280px checks on home, one case study, one musing
- Accessibility: keyboard nav, visible focus, `prefers-reduced-motion`, semantic headings, alt text flow-through
- Fixes applied directly to `web/` as surgical edits. Anything that's a taste call rather than a defect gets logged for you instead of changed.

### Layer 5 — SEO + metadata
Per-page titles and meta descriptions (from standfirsts), Open Graph tags, sitemap.xml, robots.txt, canonical URLs. Built from what's in Sanity, no invented copy.

### Layer 6 — Imagery (the one thing needing your hands)
No Sanity write token exists outside your machine, so binaries can't go in from here. Built instead: `import/images-manifest.json` (7 kiosk images found in your Drive, mapped to documents with alt text) and `import/import-images.mjs`. One command in the morning:

```
cd studio && npx sanity exec ../import/import-images.mjs --with-user-token
```

Drive had no usable imagery for Orson, Strunk, Brotique, Evo or the older projects — those need exports from you (listed in the manifest notes).

### Layer 7 — Morning report
`MORNING-REPORT.md` in this folder:
- Changelog per layer
- **Every liberty flagged**: the role-attributed quotes I wrote (none attributed to named people), inferred years/timeframes, GDK anonymised as "Confidential QSR brand", Edinburgh assumed as your location, thin pieces marked "full write-up to follow"
- Any code changes made to CC's `web/`
- Your prioritised 15-minute review list, ordered by reputational risk

---

## Guard-rails (active all night)

- No fabricated clients, named-person quotes, or invented numbers — liberties are in framing and voice only
- The Brotique Sanity project untouched
- No git operations on your repo; file edits only, each logged
- No schema changes (that's CC's lane; needs your sign-off anyway)
- If CC's frontend never lands or breaks irrecoverably, I note it and keep all content layers intact — the Studio is fully populated regardless

**Unless you say stop, I'm executing this top to bottom now.**
