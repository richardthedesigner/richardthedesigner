import type {MetadataRoute} from 'next'

import {client} from '@/sanity/client'
import {SITE_URL} from '@/lib/site'

export const revalidate = 3600

// Local (untyped) query so we can project _updatedAt for lastModified without
// touching the typegen'd query set.
const SITEMAP_QUERY = `{
  "work": *[_type in ["caseStudy", "project"] && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "musings": *[_type == "musing" && defined(slug.current)]{"slug": slug.current, _updatedAt}
}`

type SitemapEntry = {slug: string | null; _updatedAt: string}
type SitemapData = {work: SitemapEntry[]; musings: SitemapEntry[]}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch<SitemapData>(SITEMAP_QUERY)

  const latest = [...data.work, ...data.musings]
    .map((e) => e._updatedAt)
    .sort()
    .at(-1)

  const staticRoutes: MetadataRoute.Sitemap = [
    {url: `${SITE_URL}/`, priority: 1, lastModified: latest},
    {url: `${SITE_URL}/musings`, priority: 0.6, lastModified: latest},
    {url: `${SITE_URL}/info`, priority: 0.5},
  ]

  const workRoutes: MetadataRoute.Sitemap = data.work
    .filter((w) => w.slug)
    .map((w) => ({
      url: `${SITE_URL}/work/${w.slug}`,
      priority: 0.8,
      lastModified: w._updatedAt,
    }))

  const musingRoutes: MetadataRoute.Sitemap = data.musings
    .filter((m) => m.slug)
    .map((m) => ({
      url: `${SITE_URL}/musings/${m.slug}`,
      priority: 0.6,
      lastModified: m._updatedAt,
    }))

  return [...staticRoutes, ...workRoutes, ...musingRoutes]
}
