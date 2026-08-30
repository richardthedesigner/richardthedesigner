import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'

// The way back out of draft mode for anyone who opened it directly rather than
// through the Presentation iframe.
export async function GET(request: Request) {
  ;(await draftMode()).disable()
  const {searchParams} = new URL(request.url)
  redirect(searchParams.get('redirect') || '/')
}
