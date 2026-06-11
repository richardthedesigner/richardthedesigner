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
NEXT_PUBLIC_SITE_URL=https://<production-domain>   # used for canonical URLs, OG, sitemap
```

The frontend reads only **published** content via the Sanity CDN with no token, so
drafts and the internal `publishingStatus` workflow field are never exposed.

## Design

Visual direction is translated from the approved prototypes
(`bn-grid-smalt-riffs-v2.html`, `bn-article-motion-v2.html`) into design tokens in
`web/src/app/globals.css`: warm paper palette, smalt-blue accent, Fraunces +
IBM Plex Sans + IBM Plex Mono. All grid and article motion respects
`prefers-reduced-motion`.
