import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from './env'

// Read-only client. No token is configured, so it can only ever see *published*
// content via the CDN — drafts and the internal publishingStatus workflow stay
// private. ISR revalidation is driven per-route by `export const revalidate`.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})
