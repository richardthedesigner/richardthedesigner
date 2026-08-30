import type {Metadata} from 'next'

import {sanityFetch} from '@/sanity/live'
import {INFO_QUERY} from '@/sanity/queries'
import {ObfuscatedEmail} from '@/components/ObfuscatedEmail'
import {PageNav} from '@/components/PageNav'

export const revalidate = 60

// Local (untyped) query for the vignette/advisory doc types, which sit
// outside the typegen'd query set.
const INFO_EXTRAS_QUERY = `{
  "clients": *[_type == "clientVignette"] | order(coalesce(order, 100) asc){_id, title, sector, work, oneLiner},
  "advisory": *[_type == "advisoryRole"] | order(coalesce(order, 100) asc){_id, title, organisation, timeframe, description, url}
}`

type InfoExtras = {
  clients: {
    _id: string
    title: string | null
    sector: string | null
    work: string | null
    oneLiner: string | null
  }[]
  advisory: {
    _id: string
    title: string | null
    organisation: string | null
    timeframe: string | null
    description: string | null
    url: string | null
  }[]
}

// Static export replaced by a resolver so the singleton's seo overrides apply.
export async function generateMetadata(): Promise<Metadata> {
  // stega:false — this builds <title>, description and canonical.
  const {data} = await sanityFetch({query: INFO_QUERY, stega: false})
  return {
    title: data?.seo?.metaTitle || 'Info',
    description:
      data?.seo?.metaDescription ||
      'About Richard Murphy — product design and platform strategy. Contact, locations and links.',
    robots: data?.seo?.noIndex ? {index: false, follow: false} : undefined,
    alternates: {canonical: '/info'},
  }
}

export default async function InfoPage() {
  const [settings, extras] = await Promise.all([
    sanityFetch({query: INFO_QUERY}).then((r) => r.data),
    sanityFetch({query: INFO_EXTRAS_QUERY})
      .then((r) => r.data as InfoExtras)
      .catch(() => null),
  ])

  return (
    <>
      <PageNav current="info" />
      <div className="mx-auto w-full max-w-[760px] px-6 py-16 sm:px-8 sm:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
        Info
      </p>
      <h1 className="mt-3 text-[clamp(28px,4vw,46px)] font-semibold leading-[1.08] tracking-[-0.025em]">
        {settings?.title || 'Richard Murphy'}
      </h1>

      {settings?.intro ? (
        <p className="mt-6 max-w-[56ch] text-[clamp(17px,1.8vw,21px)] leading-[1.55] text-ink">
          {settings.intro}
        </p>
      ) : null}

      <dl className="mt-14 grid grid-cols-1 gap-10 border-t border-line pt-10 sm:grid-cols-2">
        {settings?.contactEmail ? (
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-soft">
              Contact
            </dt>
            <dd className="mt-2">
              <ObfuscatedEmail
                user={settings.contactEmail.split('@')[0]}
                domain={settings.contactEmail.split('@')[1] ?? ''}
                className="text-[17px] text-smalt-deep underline decoration-from-font underline-offset-2 hover:text-smalt"
              />
            </dd>
          </div>
        ) : null}

        {settings?.locations?.length ? (
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-soft">
              {settings.locations.length === 1 ? 'Location' : 'Locations'}
            </dt>
            <dd className="mt-2 text-[17px] text-ink">
              {settings.locations.join(' · ')}
            </dd>
          </div>
        ) : null}

        {settings?.social?.length ? (
          <div className="sm:col-span-2">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-soft">
              Elsewhere
            </dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {settings.social.map((s) => (
                  <li key={s._key}>
                    <a
                      href={s.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[17px] text-smalt-deep underline decoration-from-font underline-offset-2 hover:text-smalt"
                    >
                      {s.label || s.url}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>

      {/* Selected clients — pattern-level credibility, never project detail */}
      {extras?.clients?.length ? (
        <section aria-label="Selected clients" className="mt-14 border-t border-line pt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-soft">
            Selected clients
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {extras.clients.map((c) => (
              <li key={c._id}>
                <p className="text-[17px] font-semibold leading-snug text-ink">
                  {c.title}
                  {c.sector ? (
                    <span className="ml-2.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-soft">
                      {c.sector}
                    </span>
                  ) : null}
                </p>
                {c.oneLiner ? (
                  <p className="mt-1 max-w-[44ch] text-[14px] leading-[1.5] text-soft">
                    {c.oneLiner}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[60ch] font-mono text-[11.5px] leading-[1.6] text-soft">
            Client work is described at pattern level. Named engagements and
            outcomes are shared in conversation, confidentiality permitting.
          </p>
        </section>
      ) : null}

      {/* Board and advisory */}
      {extras?.advisory?.length ? (
        <section aria-label="Board and advisory" className="mt-14 border-t border-line pt-10">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-soft">
            Board &amp; advisory
          </h2>
          <ul className="mt-5 flex flex-col gap-7">
            {extras.advisory.map((a) => (
              <li key={a._id}>
                <p className="text-[17px] font-semibold leading-snug text-ink">
                  {a.url ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-from-font underline-offset-2 hover:text-smalt"
                    >
                      {a.organisation}
                    </a>
                  ) : (
                    a.organisation
                  )}
                  <span className="ml-2.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-soft">
                    {[a.title, a.timeframe].filter(Boolean).join(' · ')}
                  </span>
                </p>
                {a.description ? (
                  <p className="mt-1 max-w-[64ch] text-[14px] leading-[1.55] text-soft">
                    {a.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      </div>
    </>
  )
}
