# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`richardthedesigner.com` — Richard Murphy's portfolio. Two deployables in one repo:

- `studio/` — Sanity Studio (schema, structure, TypeGen source). Project `dbfopugh`, dataset `production`, hosted at https://richardthedesigner.sanity.studio
- `web/` — Next.js 16 App Router frontend, Tailwind v4, deployed to Vercel (project `richardthedesigner`)

Everything else at the repo root is working material, not product: the `bn-*.html` prototypes (the approved visual direction), `cc-build-prompt.md` (the original build brief and its hard constraints), `import/` (NDJSON content imports), the overnight/morning reports, and several untracked folders (`concepts/`, `product-briefs/`, `airbnb/`, `slack/`, `superhuman/`, `DESIGN.md`) belonging to the adjacent Tiger Forest concept workstream. Don't assume root files are part of the site.

## Commands

Studio (`cd studio`):

```bash
npm run dev            # local Studio
npm run deploy-schema  # push schema to Content Lake
npm run deploy         # deploy hosted Studio
npm run typegen        # extract schema + regenerate web/src/sanity/sanity.types.ts
```

Frontend (`cd web`):

```bash
npm run dev
npm run build          # run this before calling frontend work done
npm run start
npm run lint           # eslint (flat config, eslint-config-next)
```

There is no test suite. `npm run build` plus `npm run lint` in `web/` is the check.

After any change to `studio/schema/`, run `npm run typegen` from `studio/` — it writes generated types straight into `web/src/sanity/sanity.types.ts`, and GROQ result types in the frontend come from there.

## Content model

Three document types plus a singleton, defined in `studio/schema/`:

- `caseStudy` — the flagship narrative type (standfirst, client, role, sector, timeframe, `contentBody`, `metrics`)
- `project` — lighter work entries
- `musing` — writing
- `siteSettings` — singleton, id locked to `siteSettings` via `studio/src/structure/index.ts`. Holds `gridOrder` (drag-ordered references that drive the home grid), ticker items, contact, intro.

Objects: `mediaItem` (image or mp4 with poster), `metric`, `contentBody` (Portable Text).

Two shared lists live in `studio/schema/shared.ts`:

- **Story tags** — `operate / build / systems / transform / craft / play`. One taxonomy driving both the home filter and the capability framing. Mirrored for presentation in `web/src/lib/tags.ts`; change both together.
- **`publishingStatus`** — internal editorial workflow (`drafted / framed / sketch / name-only`). **Never expose it publicly.** No GROQ query selects it, and none should.

Deliberate omissions carried over from the build brief: no confidentiality field (handled by page password protection instead), no extra document types without a decision to add one.

## Frontend architecture

**Data flow.** `web/src/sanity/client.ts` is a read-only client with no token and `perspective: 'published'`, so drafts and workflow state are structurally unreachable from the public site. All GROQ lives in `web/src/sanity/queries.ts` using `defineQuery` so TypeGen can type the results — don't inline query strings in pages.

**Grid ordering pattern.** Home and prev/next navigation both fetch `ordered` (from `siteSettings.gridOrder`) and `extra` (anything not referenced there, sorted by `order` then `year`), then concatenate. Keep both halves of a query in sync when changing what the grid selects.

**Rendering.** Pages are ISR: `export const revalidate = 60` per route, including the root layout. `work/[slug]` uses `generateStaticParams` with `dynamicParams = true`.

**The long-read layout.** `web/src/lib/portable.ts` splits a `contentBody` into a lede plus numbered sections at each `h2`. `web/src/components/EditorialRead.tsx` then *classifies* each section by title and content shape (credits / chips / cards / closer / prose) and gives it a different treatment. Editorial structure is inferred from the content, not authored as layout — if a case study renders oddly, look at its heading text and list density first.

**Fallbacks are load-bearing.** The root layout has static defaults so the shell never 500s when the CMS blinks. `web/src/lib/fallbackImages.ts` maps slugs to temporary Unsplash heroes; a real `heroMedia` in Sanity always wins. Remove entries as real imagery lands.

**URLs.** `web/src/lib/site.ts` resolves `SITE_URL` from `NEXT_PUBLIC_SITE_URL`, falling back to the Vercel production domain, so localhost URLs can't ship. It also exports `jsonLd()`, which escapes `<` — use it for every inline ld+json block since the content is CMS-sourced.

**Email.** The contact address is assembled client-side in `ObfuscatedEmail.tsx` and deliberately kept out of machine-readable surfaces (sitemap, llms.txt, JSON-LD). Don't reintroduce it as a plain string.

## Design system

Tokens live in `web/src/app/globals.css` under `@theme` (Tailwind v4 — no `tailwind.config.js`). Warm paper palette, smalt blue accent, rust warm accent, Fraunces + IBM Plex Sans + IBM Plex Mono loaded via `next/font/google`.

Two rules from the original brief still apply: tokens were translated from the approved prototypes (`bn-grid-smalt-riffs-v2.html`, `bn-article-motion-v2.html`) rather than eyeballed, and `--color-white` is overridden to a soft off-white so nothing glares on the smalt field. All motion must respect `prefers-reduced-motion` — use `web/src/hooks/useReducedMotion.ts`.

## Working constraints

- **Never fabricate portfolio content.** Metrics, dates, client names and product concepts must be real or clearly labelled as placeholder. This has been a repeated correction on this project.
- **Never touch Sanity project `qkz5fhit`** — that's The Brotique, a separate project.
- **Confirm before deploying** either the Studio or the frontend.

## Environment

`web/.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=dbfopugh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-11
NEXT_PUBLIC_SITE_URL=https://richardthedesigner.com
```

No secrets exist in the repo; the Sanity write token lives only in the local `sanity login` session.
