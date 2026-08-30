# Sanity upgrade — execution plan

From the Sanity Upgrade Spec, 30 August 2026. One phase per session; read this
back at the start of each.

Ground rules carried from the spec's section 0: the media pipeline, the
`fallbackImages` map, the derived-SEO defaults and the internal
`publishingStatus` field are all correct as they stand. Do not restructure them.

---

## Phase 0.1 — Live bug: preoday-qikserve fallback key   ✅ SHIPPED ef01288

`FALLBACK_IMAGES` and `SLUG_THEMES` both keyed the case study as
`prepay-qikserve`, so it rendered with no hero, gallery or og:image. Renamed,
and the remaining 27 audited against the dataset: no other mismatch either way.
The parity guard the spec asks for is folded into Phase 4, which is where the
test setup gets built once and can serve both guards.

## Phase 1 — Preview loop (Presentation + draft mode)   ← CODE COMPLETE, BLOCKED ON TOKEN

The one Richard asked for. Blocked at the last step on a token only he can mint.

- [x] `next-sanity` to >= 13.1.5 (`useIsPresentationTool` needs it)
- [x] CORS: production origin already had credentials; added the stable preview
      alias `richardthedesigner-git-main-…vercel.app`, deliberately not a
      `*.vercel.app` wildcard (a credentialed wildcard would let any
      Vercel-hosted site make authenticated requests to the dataset)
- [x] `next.config.ts`: replace blanket `X-Frame-Options: DENY` with
      `frame-ancestors` allowing the two Studio origins
- [x] Studio: `presentationTool` + `src/presentation/resolve.ts` (four types)
- [x] Web: stega on the client, `sanity/live.ts`, all 15 fetch sites moved to
      `sanityFetch`
- [x] `stega: false` on every machine-readable surface (metadata, static params,
      sitemap, llms.txt)
- [x] `api/draft-mode/enable` + `disable`
- [x] `layout.tsx`: `<SanityLive />` always, `<VisualEditing />` + disable button
      only under draft mode
- [x] `stegaClean()` audit of every comparison against a CMS string
- [ ] **BLOCKED, Richard:** create a Viewer token in the project's API settings,
      then add `SANITY_API_READ_TOKEN` to Vercel (all environments) and to
      `web/.env.local`
- [x] Published-mode output verified clean: 0 stega characters across `/`,
      a work page, `/musings`, `/info`, `/sitemap.xml`, `/llms.txt`. This was
      with no token present, so it proves the code path, not the
      token-present case
- [ ] Verify 1e end to end: draft visible in the iframe, click-to-edit lands on
      the field, edits appear without reload, and the public site still serves
      clean HTML with no stega in `<title>` or the sitemap

## Phase 2 — Stop the schema drifting   ✅ DONE

`.github/workflows/schema.yml` on push to main touching `studio/schema/**`:
`npm ci` → `sanity schemas deploy --workspace default` → `npm run typegen` →
fail if `web/src/sanity/sanity.types.ts` came back dirty. Needs a repo secret
`SANITY_AUTH_TOKEN` with deploy permission. Matters for Agent Actions, which
read the deployed schema.

## Phase 3 — SEO override layer   ✅ DONE

`studio/schema/objects/seo.ts` (`metaTitle` 60, `metaDescription` 155,
`ogImage`, `noIndex`), optional on `caseStudy`, `project`, `musing`,
`siteSettings`. Coalesce override before derived in each `generateMetadata`;
emit `robots: {index:false, follow:false}` on `noIndex`. Add to queries,
regenerate types.

## Phase 4 — Parity guards (Option A only)   ✅ DONE

A test asserting `studio/schema/shared.ts` and `web/src/lib/tags.ts` hold
identical `value` arrays in the same order. Ten lines. Option B (tag documents)
is out of scope unless Richard wants tag landing pages.

## Phase 5 — gridOrder → orderRank   ← BLOCKED

Blocked on Richard: `designmynight` still has no position in `gridOrder` and
falls through the `extra` branch that this phase deletes. It needs an explicit
place first. The migration also writes to 28 published documents, so it needs
sign-off before it runs.


`@sanity/orderable-document-list`, `orderRankField` on `caseStudy` and
`project`, orderable lists in the structure. Migrate from the existing
`gridOrder` sequence first, confirm the rendered order is unchanged on a preview
deploy, and only then drop the field and the `extra` branches from
`HOME_QUERY` / `WORK_ORDER_QUERY`. Content migration: needs sign-off.

## Phase 6 — Instant publish   ← CODE DONE, WEBHOOK NEEDS RICHARD

`api/revalidate/route.ts` verifying the signature with `@sanity/webhook`. It
calls `revalidatePath`, **not** `revalidateTag`: sanityFetch calls `cacheTag`
only inside a `use cache` boundary, and this app caches per route via
`export const revalidate`, so tags would register nothing and revalidateTag
would silently no-op. Still needs the webhook created in Sanity with a matching
`SANITY_REVALIDATE_SECRET` in Vercel. Then a
publish webhook in Sanity pointing at it. `<SanityLive />` covers draft mode
only; the published site still needs this.

---

## Not for CC, per the spec

Agent Actions (as a script in `/import`, not a Studio button) and
Functions/Blueprints. Both are Richard's calls.
