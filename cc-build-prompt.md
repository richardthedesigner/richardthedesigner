# CC build prompt — richardthedesigner.com

Copy everything below the line into Claude Code.

---

We're building richardthedesigner.com: a Sanity Studio plus public frontend. Technical foundations (git, repo) are already in place in this folder. Work in two phases and stop for sign-off between them.

## Hard constraints

- **New Sanity project.** Do NOT reuse the existing "The Brotique" project (qkz5fhit) for anything.
- **The schema is already written** in `sanity-schema/`. Three document types only: `caseStudy`, `project`, `musing`, plus a `siteSettings` singleton and the `mediaItem`, `metric`, `contentBody` objects. `shared.ts` holds the five story tags (operate / build / systems / transform / craft) and the internal `publishingStatus` list. Do not invent extra fields, do not add document types, do not add a confidentiality field (that's handled later via password protection, not schema).
- **No deploys without confirming first.** Present what you're about to deploy, wait for sign-off.
- **Don't write portfolio content.** Real content arrives separately as NDJSON imports. Use `sanity-schema/seed.ndjson` only as placeholder data for testing rendering.

## Phase 1 — Studio + schema

1. `sanity init` a new project and Studio (if not already created).
2. Move `sanity-schema/` in as `./schema` and wire `schemaTypes` into `sanity.config.ts`.
3. Set up the Structure tool so `siteSettings` is a singleton — see `sanity-schema/README-handoff.md` for the exact structure snippet and full wiring notes.
4. Deploy the schema and Studio (after sign-off). Paste the Studio URL.
5. Run TypeGen and report the generated types.
6. Import `seed.ndjson` into the dataset for development.

## Phase 2 — Frontend

**Stack:** your choice, but justify it briefly before scaffolding. Requirements: first-class Sanity integration (GROQ + TypeGen types), image and mp4 video rendering, fast/mostly-static output, easy Vercel deployment.

**Design reference — this is the approved visual direction, match it closely:**

- `bn-grid-smalt-riffs-v2.html` — the home index grid
- `bn-article-motion-v2.html` — the article/case-study template and motion behaviour

Read both files in full before writing any frontend code. Extract the typography (Fraunces display serif + IBM Plex Sans + IBM Plex Mono), the warm paper palette with dark ink and accent colours, the grid layout, rollover/motion behaviour, and the footer ticker treatment directly from them. Translate into design tokens, don't eyeball.

**Pages:**

- **Home** — work grid ordered by `siteSettings.gridOrder`, filterable by the five story tags. Video (`mediaItem` mp4) is first-class in grid cells: autoplay muted loop with poster fallback.
- **Case study detail** — full narrative from `contentBody`, with the `metrics` array rendered as proof points.
- **Project detail** — lighter template, same family.
- **Musings** — index + detail.
- **Info/about** — `siteSettings.intro`, contact email, locations, social links.
- **Footer ticker** — `siteSettings.tickerItems`, sitewide, per the prototypes.

**Rules:**

- Only render published documents. `publishingStatus` is an internal workflow field — never expose it or use it for public filtering.
- Accessibility is non-negotiable (it's a stated capability of the portfolio's owner): semantic HTML, keyboard-navigable grid and filters, alt text from `mediaItem.alt`, and full `prefers-reduced-motion` support for all grid/article motion.
- SEO basics: per-page metadata, Open Graph images, sitemap, sensible canonical URLs.
- Run TypeGen against your actual GROQ queries; no hand-rolled types for Sanity data.

**Verify before reporting done:** clean production build, all pages render with seed data, motion respects reduced-motion, Lighthouse accessibility ≥ 95 on home and one detail page.

**Deployment:** prepare for Vercel but do not deploy the frontend without sign-off.

## After you finish

Report: Studio URL, dataset name, project ID, generated types, frontend dev URL, and anything in the schema that fought the frontend (so it can be patched before content import). Import-ready content (starting with Orson, QikServe Kiosk, QikServe Online Ordering, Strunk) will follow from the content workstream.
