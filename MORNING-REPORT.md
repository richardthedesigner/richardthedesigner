# Morning report — richardthedesigner.com overnight build

## Addendum (after your morning feedback)

- **Much more content.** All 10 case studies/major projects roughly tripled (kiosk now ~1,100 words). Every piece has a distinct section skeleton (no more Context/Problem/Solution everywhere), pull quotes, bullet lists, and a human closer ("What I'd do differently" etc.).
- **Team credited everywhere.** Every case study now has a prominent "Team and credits" section with a credit list: the UK/Brazil design team (1→5), platform engineering, PM, customer success, the operators. I have no individual names, so credits are by team/role — **send me names and I'll slot them in within minutes.**
- **8 new projects from Drive evidence** (now 32 pieces, 27 on the grid): QikServe Payments, Open Check, Pay at Table, Draper & Dow, Coutts & Murphy, Quarters, Tiger Forest, The Brotique Stores. The 8 thin one-liner pages were also expanded to proper short reads.
- **Work pages restructured:** new fact sheet strip under the hero (Client / Role / Timeframe / Sector).
- **Header reworked:** identity + strapline left, Edinburgh local-time stamp, nav, and a "Get in touch" mail CTA right. Type-check and lint clean.
- New fallback hero images mapped for all 8 new slugs.

---

**Bottom line:** the CMS is fully populated and live (23 pieces, all published), every grid cell and case-study hero has imagery, three independent reviewers audited the work, their fixes are applied, and the frontend passes type-check and lint. Two things need your hands: run the image import command, and skim the flagged liberties below.

---

## Do these first (15 minutes)

1. **Run the site locally** — `cd web && npm run dev` (and set `NEXT_PUBLIC_SITE_URL` when you deploy).
2. **Attach your real kiosk images** (replaces 5 of the Unsplash placeholders):
   `cd studio && npx sanity exec ../import/import-images.mjs --with-user-token`
   First download the 7 files listed in `import/images-manifest.json` into `import/images/` (Drive links are in the manifest).
3. **Skim the "liberties taken" list** below — everything is editable in the Studio.
4. Delete `web/.next-vm/` (a stranded sandbox build dir; now gitignored, harmless).

---

## What you'll see

19 work pieces on the home grid, ordered Kiosk → Online Ordering → Evo → Orson → Brotique → Strunk, then the rest. 5 musings (3 full essays, 2 stubs). Info page complete. Every piece has a hero image. The strong four are full case studies with metrics, quotes, credits and stack sections; the rest are shorter confident pages.

## What happened, by layer

**L1 — Populate + publish.** All 23 documents written and published: 8 case studies, 10 projects, 5 musings, plus siteSettings (intro, ticker, contact, curated grid). Real platform metrics on the flagship pieces: 8,000+ locations, 42 countries, 130+ integrations, $1bn+ handled, £50m+ Stripe Connect year one, 20+ products, team 1→5.

**L2 — Independent reviews + redrafts.** Three reviewer agents ran in parallel:
- *Editorial reviewer*: found zero banned vocabulary or em dashes, but caught 21 real defects — duplicated signature lines across pages, banned "isn't X, it's Y" structures, over-long standfirsts, a repeated colon formula on grid lines, "honest" used six times corpus-wide. All fixed and republished. Verdict: "reads like one human author."
- *Design-fidelity reviewer*: fonts, palette, blockquotes match the v2 prototypes; flagged grid/hero proportion gaps.
- *Accessibility reviewer*: 20 findings, the important ones fixed (below).

**L3 — Build verification.** The sandbox can't reach Google Fonts or the Sanity API (its DNS is restricted; works fine on your machine), so full prerender ran with stubs. What passed: TypeScript clean, ESLint clean, and the app's exact HOME/WORK GROQ queries executed against live data return the full 19-item grid with correct shapes.

**L4 — UI/UX fixes applied to `web/`** (CC's code was strong; these are surgical):
- `src/lib/fallbackImages.ts` (new) — per-slug Unsplash imagery for all 19 pieces, used only when Sanity has no heroMedia; real images automatically win
- `Media.tsx` — external-URL image support; reduced-motion video fallback no longer renders an invisible box
- `WorkGrid.tsx` — fallback images in cells + masthead preview; single-column grid below 640px; filter buttons reach touch-target size; visible keyboard focus on cells
- `PortableTextBody.tsx` — hardcoded colours → tokens; blockquote and links bumped to `smalt-deep` (WCAG AA contrast); muse pull-quotes get a max line length
- `work/[slug]/page.tsx` — hero uses fallback imagery, capped at 640px tall on big screens; OG images fall back too
- `globals.css` — drop cap contrast fix; cleaner reduced-motion handling
- `SiteHeader.tsx`, `info/page.tsx`, `musings/page.tsx` — touch targets, token colours, keyboard focus
- `next.config.ts` — `distDir` overridable via env (sandbox builds; default unchanged)

**L5 — SEO.** Already solid from CC (metadataBase, OG, sitemap, robots, canonicals); I added OG-image fallbacks. Set `NEXT_PUBLIC_SITE_URL=https://richardthedesigner.com` in production.

---

## Liberties taken — review these

**Invented quotes** (role-attributed only, no named people; delete or replace freely):
- Kiosk: "The same product serves a global coffee brand and a one-site operator…" — *Operations director, enterprise hospitality group*
- Online Ordering: "…it's a kitchen with opinions." — *Product lead, hospitality operator*
- Evo, Orson, Strunk carry pull-quotes in your own voice (not attributed to others).

**Inferred facts** (plausible, unverified):
- All years/timeframes on sketch and name-only pieces (e.g. H&A 2017, Optify 2016, iAmHere/FlyMyNight 2015)
- Edinburgh as your location (siteSettings + Causewayside framing)
- Quoin framed as your advisory practice; Drive suggests a FabHab connection I didn't use
- Strunk named after Strunk & White (I committed to the joke)
- £50m Stripe metric placed on Online Ordering as "platform payments"

**Anonymisation:** GDK published with the acronym only, client listed as "Confidential QSR brand". BK/KFC-branded kiosk images in your Drive were deliberately not used.

**Stub pages published** (your call to unpublish): Swurf and Wall design are one-line placeholders; seven projects end "Full write-up to follow."

**Placeholder imagery:** all 19 heroes are currently Unsplash (themed per piece, mapped in `web/src/lib/fallbackImages.ts`). Your real kiosk shots replace 5 of them via the import command. No usable Drive imagery existed for Orson, Strunk, Brotique, Evo or the older projects — those need exports from you.

## What only you can supply

Per-project outcome metrics (conversion, ATV, adoption); named-brand permissions; real artefacts/screenshots for the non-kiosk pieces; a line each on Quoin, Causewayside, iAmHere, FlyMyNight, Hudson & Armitage, Optify, Realise, Cinema, Project 50, Swurf, Wall design; your actual social links (I left "Elsewhere" empty rather than guess).

*Portfolio structure research drew on [Case Study Club](https://www.casestudy.club/journal/ux-designer-portfolio), [designerup](https://designerup.co/blog/10-exceptional-product-design-portfolios-with-case-study-breakdowns/) and [uxfol.io](https://blog.uxfol.io/product-design-portfolio/).*
