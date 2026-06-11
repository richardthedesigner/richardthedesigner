import type {MetadataRoute} from 'next'

import {client} from '@/sanity/client'
import {WORK_SLUGS_QUERY, MUSING_SLUGS_QUERY} from '@/sanity/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [work, musings] = await Promise.all([
    client.fetch(WORK_SLUGS_QUERY),
    client.fetch(MUSING_SLUGS_QUERY),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {url: `${SITE_URL}/`, priority: 1},
    {url: `${SITE_URL}/musings`, priority: 0.6},
    {url: `${SITE_URL}/info`, priority: 0.5},
  ]

  const workRoutes: MetadataRoute.Sitemap = work
    .filter((w) => w.slug)
    .map((w) => ({url: `${SITE_URL}/work/${w.slug}`, priority: 0.8}))

  const musingRoutes: MetadataRoute.Sitemap = musings
    .filter((m) => m.slug)
    .map((m) => ({url: `${SITE_URL}/musings/${m.slug}`, priority: 0.6}))

  return [...staticRoutes, ...workRoutes, ...musingRoutes]
}
