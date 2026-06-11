import {client} from '@/sanity/client'
import {HOME_QUERY} from '@/sanity/queries'
import {WorkGrid} from '@/components/WorkGrid'

export const revalidate = 60

export default async function HomePage() {
  const data = await client.fetch(HOME_QUERY)
  const work = [...(data?.ordered ?? []), ...(data?.extra ?? [])]

  return <WorkGrid work={work} intro={data?.settings?.intro ?? null} />
}
