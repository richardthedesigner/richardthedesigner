# Sanity schema handoff — richardthedesigner.com

Ready-to-deploy schema for the new portfolio project. Drop these files into the Studio and deploy.

## Locked decisions

- **Three document types only:** `caseStudy`, `project`, `musing`. Cleaner than the six-type option.
- **New Sanity project** for the portfolio. Do not reuse the existing "The Brotique" project.
- **Confidentiality is handled later** by password-protecting sensitive areas or the whole site, not in the schema. No confidentiality field for now.
- **Story tags are the taxonomy.** Five values (`operate`, `build`, `systems`, `transform`, `craft`) live in `shared.ts`. They drive the home-grid filter and double as capability themes. One list, one source of truth.
- **`publishingStatus`** is an internal workflow field (drafted / framed / sketch / name-only) so the CMS works as a knowledge base first. Not public.
- **Media is image-or-mp4.** `mediaItem` treats video as first-class because the home grid leans on motion.

## Files

```
sanity-schema/
  shared.ts                 story tags + publishing status lists
  index.ts                  exports schemaTypes
  objects/
    mediaItem.ts            image or mp4, with poster + alt
    metric.ts               value + label proof point
    contentBody.ts          Portable Text body (blocks + inline media)
  documents/
    caseStudy.ts            flagship narrative
    project.ts              lighter project page
    musing.ts               essay / talk / perspective
    siteSettings.ts         singleton: grid order, ticker, contact
```

## Wiring it up

1. Move `sanity-schema/` into the Studio (e.g. `./schema`) and point the config at it:

   ```ts
   // sanity.config.ts
   import {schemaTypes} from './schema'
   export default defineConfig({
     // ...
     schema: {types: schemaTypes},
   })
   ```

2. **Make `siteSettings` a singleton** in the Structure tool so there is only ever one:

   ```ts
   // structure.ts
   export const structure = (S) =>
     S.list()
       .title('Content')
       .items([
         S.listItem()
           .title('Site settings')
           .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
         S.divider(),
         S.documentTypeListItem('caseStudy').title('Case studies'),
         S.documentTypeListItem('project').title('Projects'),
         S.documentTypeListItem('musing').title('Musings'),
       ])
   ```

3. Deploy: `sanity schema deploy` then `sanity deploy` (or your CI). Run TypeGen after.

## Paste-ready prompt for the Claude Code session

> We are building the portfolio Sanity Studio for richardthedesigner.com in a **new** Sanity project (do not reuse The Brotique project). The schema is already written in `sanity-schema/` (three document types: caseStudy, project, musing, plus mediaItem, metric, contentBody objects and a siteSettings singleton). Tasks: 1) run `sanity init` to create the new project and Studio if not already done; 2) move `sanity-schema/` in as `./schema` and wire `schemaTypes` into `sanity.config.ts`; 3) set up the Structure tool so `siteSettings` is a singleton (see README-handoff.md); 4) deploy the schema and Studio; 5) run TypeGen and report the generated types. Do not invent extra fields. Confirm the deploy succeeded and paste the Studio URL.

## After deploy

I will shape the strongest pieces into this model and hand you import-ready content (NDJSON or `create` calls), starting with Orson, QikServe Kiosk, QikServe Online Ordering and Strunk. The real metrics (8,000+ locations, 42 countries, 130+ integrations, over $1bn handled, Stripe Connect past £50m year one) go in the `metrics` array on the relevant case studies.
