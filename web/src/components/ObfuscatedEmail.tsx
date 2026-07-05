'use client'

import {useEffect, useState} from 'react'

// Contact email, assembled in the browser so the address never appears as a
// plain user@domain string in the served HTML (defeats regex harvesters).
// Until hydration (and for no-JS visitors) it renders munged text instead.
export function ObfuscatedEmail({
  user,
  domain,
  className = '',
}: {
  user: string
  domain: string
  className?: string
}) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  if (!ready) {
    return (
      <span className={className}>
        {user}
        &#8203;[at]&#8203;
        {domain}
      </span>
    )
  }

  const address = `${user}@${domain}`
  return (
    <a href={`mailto:${address}`} className={className}>
      {address}
    </a>
  )
}
