import {sanityFetch} from '@/sanity/live'
import {SITE_URL} from '@/lib/site'

export const revalidate = 3600

type Entry = {
  title: string | null
  slug: string | null
  standfirst?: string | null
  description?: string | null
  excerpt?: string | null
  client?: string | null
  role?: string | null
  timeframe?: string | null
  sector?: string | null
  year?: number | null
}

type LlmsData = {
  settings: {
    title?: string | null
    intro?: string | null
    contactEmail?: string | null
    locations?: string[] | null
  } | null
  caseStudies: Entry[]
  projects: Entry[]
  musings: Entry[]
}

const LLMS_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{title, intro, contactEmail, locations},
  "caseStudies": *[_type == "caseStudy" && defined(slug.current)] | order(coalesce(order, 100) asc){
    title, "slug": slug.current, standfirst, client, role, timeframe, sector
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(coalesce(order, 100) asc){
    title, "slug": slug.current, description, client, year
  },
  "musings": *[_type == "musing" && defined(slug.current)] | order(publishedAt desc){
    title, "slug": slug.current, excerpt
  }
}`

function line(e: Entry, path: string, blurb?: string | null, meta?: string | null) {
  const parts = [`- [${e.title ?? 'Untitled'}](${SITE_URL}/${path}/${e.slug})`]
  if (blurb) parts.push(blurb)
  if (meta) parts.push(`(${meta})`)
  return parts.join(': ').replace(`: (`, ' (')
}

// llms.txt — a plain-text map of the site for AI agents and assistants.
// Generated from the CMS so it never drifts from the published content.
export async function GET() {
  // stega:false — this file is read by machines; no invisible characters.
  const {data} = await sanityFetch({query: LLMS_QUERY, stega: false})
  const llms = data as LlmsData
  const s = llms.settings

  const md = `# ${s?.title ?? 'Richard Murphy'} — Product Design & Platform Strategy

> ${s?.intro ?? 'Portfolio of Richard Murphy, product designer and design leader.'}

This is the portfolio of Richard Murphy, a product designer and design leader based in ${s?.locations?.[0] ?? 'Edinburgh, UK'}. Headline facts: six years leading design across QikServe and Access Group (Head of Product Design, then Hospitality UX Lead); self-service ordering platform grown from ~800 to 8,000+ locations across 42 countries with 100+ integrations and more than $1bn processed annually; design team grown from one to five across the UK and Brazil; WCAG 2.1 AA accessibility delivered as standard. Now Alliances Lead at TBSCG, a trustee of the disabled access charity Euan's Guide, and building Orson, an independent AI-native venture.

Contact: via the email link on ${SITE_URL}/info (address withheld from this file to limit harvesting)
Site: ${SITE_URL}

## Case studies

${llms.caseStudies.map((e) => line(e, 'work', e.standfirst, [e.client, e.role, e.timeframe ?? '', e.sector].filter(Boolean).join(' · '))).join('\n')}

## Projects

${llms.projects.map((e) => line(e, 'work', e.description, [e.client, e.year ? String(e.year) : ''].filter(Boolean).join(' · '))).join('\n')}

## Musings (essays and perspectives)

${llms.musings.map((e) => line(e, 'musings', e.excerpt)).join('\n')}

## Other pages

- [Info / about / contact](${SITE_URL}/info)
- [Sitemap](${SITE_URL}/sitemap.xml)

## Notes for agents

- Some imagery is placeholder while real project artefacts are added; the written content is authoritative.
- Client names on certain enterprise work are withheld deliberately (confidentiality); details available on request via the contact email.
- Metrics quoted on case studies (locations, countries, integrations, value processed) are platform-level figures for the QikServe / Access estate.
`

  return new Response(md, {
    headers: {'Content-Type': 'text/plain; charset=utf-8'},
  })
}
