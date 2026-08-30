import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/sanity/client'

// Presentation calls this to open draft mode. defineEnableDraftMode validates
// the request against the token before it will turn anything on, so this is not
// an open door: without a valid token the route refuses and the visitor keeps
// seeing published content.
export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token: process.env.SANITY_API_READ_TOKEN}),
})
