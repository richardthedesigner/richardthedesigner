import type {Metadata} from 'next'

import {client} from '@/sanity/client'
import {HOME_QUERY} from '@/sanity/queries'
import {WorkGrid} from '@/components/WorkGrid'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: {canonical: '/'},
}

export default async function HomePage() {
  const data = await client.fetch(HOME_QUERY)
  const work = [...(data?.ordered ?? []), ...(data?.extra ?? [])]

  return (
    <WorkGrid
      work={work}
      // The first N items are the curated gridOrder; they earn the large
      // image-faced cells in the mosaic.
      featuredCount={data?.ordered?.length ?? 0}
      intro={data?.settings?.intro ?? null}
    />
  )
}
