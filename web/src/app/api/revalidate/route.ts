import {revalidatePath} from 'next/cache'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

// Publishing used to take up to 60 seconds to show, because every route is on
// time-based ISR and a visitor arriving inside that window got stale content.
// Sanity calls this on publish and the affected paths are rebuilt in about a
// second, which also cuts query volume: the 60s floor can stay as a backstop.
//
// Note this uses revalidatePath, not revalidateTag. sanityFetch does call
// cacheTag internally, but only inside a `use cache` boundary, and this app
// caches per route via `export const revalidate`. Tags would register nothing
// here, so revalidateTag would silently do nothing.

const SECRET = process.env.SANITY_REVALIDATE_SECRET

type Payload = {_type?: string; slug?: string}

export async function POST(request: Request) {
  if (!SECRET) {
    return Response.json(
      {message: 'SANITY_REVALIDATE_SECRET is not configured'},
      {status: 500},
    )
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  if (!signature) {
    return Response.json({message: 'Missing signature'}, {status: 401})
  }

  // Read the raw body: the signature is over the exact bytes sent.
  const body = await request.text()
  if (!(await isValidSignature(body, signature, SECRET))) {
    return Response.json({message: 'Invalid signature'}, {status: 401})
  }

  const {_type, slug} = JSON.parse(body) as Payload

  // Every document type reaches the home page (the grid) or the layout
  // (ticker, footer), so '/' is always revalidated alongside the detail route.
  const paths = new Set<string>(['/'])
  switch (_type) {
    case 'caseStudy':
    case 'project':
      if (slug) paths.add(`/work/${slug}`)
      break
    case 'musing':
      paths.add('/musings')
      if (slug) paths.add(`/musings/${slug}`)
      break
    case 'siteSettings':
      paths.add('/info')
      break
    case 'clientVignette':
    case 'advisoryRole':
      paths.add('/info')
      break
    default:
      // An unknown type still touched something; the home page covers the grid.
      break
  }

  for (const path of paths) revalidatePath(path)

  return Response.json({revalidated: [...paths], now: Date.now()})
}
