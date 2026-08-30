import type {Metadata} from 'next'

import {sanityFetch} from '@/sanity/live'
import {HOME_QUERY} from '@/sanity/queries'
import {WorkGrid} from '@/components/WorkGrid'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: {canonical: '/'},
}

export default async function HomePage() {
  const {data} = await sanityFetch({query: HOME_QUERY})
  const work = [...(data?.ordered ?? []), ...(data?.extra ?? [])]

  return <WorkGrid work={work} />
}
