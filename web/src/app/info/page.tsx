import type {Metadata} from 'next'

import {client} from '@/sanity/client'
import {INFO_QUERY} from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Info',
  description:
    'About Richard Murphy — product design and platform strategy. Contact, locations and links.',
  alternates: {canonical: '/info'},
}

export default async function InfoPage() {
  const settings = await client.fetch(INFO_QUERY)

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-16 sm:px-8 sm:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
        Info
      </p>
      <h1 className="mt-3 text-[clamp(28px,4vw,46px)] font-semibold leading-[1.08] tracking-[-0.025em]">
        {settings?.title || 'Richard Murphy'}
      </h1>

      {settings?.intro ? (
        <p className="mt-6 max-w-[56ch] text-[clamp(17px,1.8vw,21px)] leading-[1.55] text-[#2b2c33]">
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
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-[17px] text-smalt underline decoration-from-font underline-offset-2 hover:text-smalt-deep"
              >
                {settings.contactEmail}
              </a>
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
                      className="text-[17px] text-smalt underline decoration-from-font underline-offset-2 hover:text-smalt-deep"
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
    </div>
  )
}
