# richardthedesigner.com

Portfolio for Richard Murphy — a Sanity Studio plus a Next.js public frontend.

## Structure

```
studio/   Sanity Studio (schema, structure, TypeGen source)   → dbfopugh / production
web/      Next.js 16 frontend (App Router, Tailwind v4)        → Vercel
```

## Sanity

- Project ID: `dbfopugh`
- Dataset: `production`
- Hosted Studio: https://richardthedesigner.sanity.studio

Studio commands (run inside `studio/`):

```bash
npm run dev            # local Studio
npm run deploy-schema  # push schema to Content Lake
npm run deploy         # deploy hosted Studio
npm run typegen        # extract schema + generate types into web/src/sanity/sanity.types.ts
```

## Frontend

Inside `web/`:

```bash
npm run dev    # local dev server
npm run build  # production build
npm run start  # serve the production build
npm run lint
```

### Environment variables (`web/.env.local`)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=dbfopugh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-11
NEXT_PUBLIC_SITE_URL=https://<production-domain>   # canonical URLs, OG, sitemap
NEXT_PUBLIC_SANITY_STUDIO_URL=https://richardthedesigner.sanity.studio
SANITY_API_READ_TOKEN=<viewer token>               # drafts + live preview only
```

The public site reads only **published** content via the CDN. Drafts are
reachable solely through `sanityFetch` in `web/src/sanity/live.ts`, which needs
the viewer token *and* Next's draft mode to be on; the internal
`publishingStatus` field is never projected by any query. Without the token the
site builds and serves exactly as before and only the preview loop goes dark.

## Preview (Presentation)

Open **Presentation** in the Studio to see the site in an iframe, click any text
to jump to its field, and watch edits apply without a reload.

- The Studio's iframe target is baked in at build time and defaults to
  production. For local work set `SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000`
  in `studio/.env` (gitignored) before `npm run dev`.
- `web/next.config.ts` allows the Studio origins to frame the site via
  `Content-Security-Policy: frame-ancestors`. Everything else is still refused.
- In draft mode, strings arrive stega-encoded, carrying an invisible pointer
  back to their field. That is what makes click-to-edit work, so encoded strings
  are passed to the DOM intact and cleaned with `stegaClean()` only where they
  are **compared** rather than rendered (`Media.tsx` on `kind`, `WorkGrid.tsx`
  on `tags`). TypeScript enforces this: branded strings are a compile error
  until cleaned.
- Machine-readable output passes `stega: false`: every `generateMetadata`,
  `generateStaticParams`, `sitemap.ts` and the `llms.txt` route. Invisible
  characters in a `<title>`, canonical or sitemap URL would be a live SEO bug.

## Design

Visual direction is translated from the approved prototypes
(`bn-grid-smalt-riffs-v2.html`, `bn-article-motion-v2.html`) into design tokens in
`web/src/app/globals.css`: warm paper palette, smalt-blue accent, Fraunces +
IBM Plex Sans + IBM Plex Mono. All grid and article motion respects
`prefers-reduced-motion`.
