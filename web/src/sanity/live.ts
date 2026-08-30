import {defineLive} from 'next-sanity/live'

import {client} from './client'

// A *viewer* token: read-only, and the only reason drafts are reachable at all.
// Without it the site behaves exactly as before, serving published content.
const token = process.env.SANITY_API_READ_TOKEN

if (process.env.NODE_ENV === 'production' && !token) {
  // Not fatal. The published site must keep building and serving if the token
  // is missing or rotated; only the preview loop goes dark.
  console.warn(
    'SANITY_API_READ_TOKEN is not set — draft mode and live preview are disabled.',
  )
}

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
