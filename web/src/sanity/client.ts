import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from './env'

// Read-only client. No token is configured here, so on its own it can only ever
// see *published* content via the CDN. Draft access goes through sanityFetch in
// ./live.ts, which supplies a viewer token and flips the perspective; that is
// the only path that can see drafts, and it is gated on Next's draftMode.
//
// `perspective` is deliberately not pinned: sanityFetch needs to switch it.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    // Content-source maps let Presentation turn rendered text into a link back
    // to the field. Encoded only when stega is switched on per fetch, which is
    // draft mode alone.
    studioUrl,
  },
})
