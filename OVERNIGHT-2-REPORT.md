# Overnight pass 2 — refinement report

All four scope items done. Nothing here needed your machine; the live render still does.

---

## 1 · Copyedit + liberty fixes (all republished)

**Fixed autonomously:**
- **Both invented quote attributions removed.** The kiosk and online-ordering pull quotes stay, but now read as your own lines — no more "Operations director, enterprise hospitality group" or "Product lead, hospitality operator". Zero fabricated voices remain on the site.
- **All invented dates removed**: `year` unset on 13 projects (Hudson & Armitage, Optify, Causewayside, iAmHere, FlyMyNight, Cinema Design, Project 50, Draper & Dow, Coutts & Murphy, Quarters, Tiger Forest, Brotique Stores, Realise Offices); `year` + `timeframe` unset on the go-live and Kiosk Pocket case studies. Fact sheets simply omit the row.
- **GDK anonymisation contradiction resolved** — the body claimed confidentiality while the title and slug named the brand. Now "QSR Kiosk Go-Live" / `qsr-kiosk-go-live` throughout. Restore the name in the Studio in seconds if you get permission.
- Three grammar/tense fixes (kiosk, go-live, Prepay). Everything else audited clean: no em dashes, no US spellings, no AI-marker vocabulary across all 32 documents.

**Needs your confirmation (couldn't verify):**
1. Timeframes kept as plausible: Kiosk 2018–2024, Online Ordering 2019–2024, Prepay 2021–2022, Evo 2022–2024, EvoGuest 2023–2024, Orson 2023–, Quoin 2023–, Strunk 2023, Brotique 2025.
2. **Brotique origin contradiction**: the Stores page says online-first, the main page says bricks-first. Only you know — fix one in the Studio.
3. Strunk page and the "Words are infrastructure" musing still share their core argument (intentional cross-reference or self-plagiarism — your call).
4. Quoin framed as your advisory practice; Drive hints at a FabHab link I didn't use.
5. Team credits remain role-based; names still slot in on request.

## 2 · Accessibility (fresh audit, fixes applied)

Done this round: filter buttons moved out of the `h1` (clean heading tree); sr-only h1 on home; duplicate footer landmark removed (ticker now decorative `div`); white focus outlines on every smalt surface (cells, filters, rail links, footer email); footer email underline contrast raised; media fallback spans no longer announce empty labels; tile hover-summaries hidden from the tree so link names stay short. Plus `llms.txt` (CMS-generated) and JSON-LD (`Person`/`WebSite` sitewide, `CreativeWork` per work page, `Article` per musing) for agentic readers.

Outstanding (needs a running browser): DevTools accessibility-tree spot-check and a VoiceOver pass — code audits can't replace either.

## 3 · Taxonomy proposal: a sixth bucket

**Proposal: `play` — "Play in public."** The masthead sentence extends naturally: *How I work / operate / build / design / transform / craft / play.* It holds the personal and experimental pieces the five work-verbs strain to contain.

- Staged (one restart from live): `play` added to `studio/schema/shared.ts` story tags.
- Candidates to tag: Swurf, Wall design, FlyMyNight, iAmHere, Quarters, Tiger Forest, Brotique Stores, Causewayside.
- Deliberately NOT yet in the frontend filter — an empty filter looks broken. Flip it by adding one line to `web/src/lib/tags.ts` (and `SENTENCE_WORDS` in WorkGrid) after tagging the docs.
- Alternative considered and rejected: a separate "Personal" section fragments the grid and buries the venture pieces that make the portfolio distinctive; one extra verb keeps everything in one story.

## 4 · Article shapes

**Added a `shape` field** (staged in `studio/schema/documents/caseStudy.ts` + `project.ts`): `long-read` → panorama hero, `brief` → split header, `prototype` → poster header + gallery-forward. Musings are inherently the fourth shape (`muse` template). The frontend already reads it: an editor-chosen shape wins, otherwise the existing per-slug automatic variant applies — so nothing breaks before the schema deploys, and you gain manual control after.

Suggested assignments once live: long-read → Kiosk, Online Ordering, Evo, Orson; brief → most projects; prototype → Pocket, Open Check, Pay at Table, Optify, iAmHere, FlyMyNight.

---

## NEXT STEPS (prioritised, morning)

1. **Run the site** (`cd web && npm run dev`) — first human look at the fused rollover, layout variants, footer, galleries.
2. **Attach real kiosk imagery**: download the 7 files in `import/images-manifest.json`, then `cd studio && npx sanity exec ../import/import-images.mjs --with-user-token`.
3. **Deploy the schema changes** (shape field + play tag): restart Studio / `sanity schema deploy`, then `sanity typegen generate` (regenerating types also restores full type-safety where I added the `shape` projection). Note: `studio/sanity.cli.ts` has a pre-existing TS error (`typegen.enabled` isn't a valid option) — one-line delete.
4. **Resolve the two content questions**: Brotique origin story (which came first, shops or site?) and whether GDK gets named.
5. **Set `shape` on documents** in the Studio (suggested mapping above) and tag the `play` pieces, then flip the frontend filter on.
6. **Confirm timeframes + send team names** for the credits sections.
7. **VoiceOver + DevTools accessibility-tree pass** (10 min) and check `/llms.txt` renders.
8. Deploy to Vercel with `NEXT_PUBLIC_SITE_URL=https://richardthedesigner.com` when happy.
