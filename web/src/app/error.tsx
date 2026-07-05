'use client'

import Link from 'next/link'

// Route-level error boundary: keeps a CMS or network hiccup from turning the
// whole site into a raw 500. Styled minimally with the site's own tokens.
export default function ErrorPage({reset}: {error: Error; reset: () => void}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center gap-5 px-6 py-16 sm:px-11">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">Error</p>
      <h1 className="max-w-[24ch] text-[clamp(24px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        Something went wrong loading this page.
      </h1>
      <p className="max-w-[48ch] text-[15px] text-soft">
        Probably temporary. Try again, or head back to the index.
      </p>
      <div className="flex gap-4 font-mono text-[13px]">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer border-b-2 border-smalt py-0.5 text-smalt transition-colors hover:text-ink"
        >
          Try again
        </button>
        <Link href="/" className="border-b-2 border-line py-0.5 text-soft transition-colors hover:text-ink">
          Back to index
        </Link>
      </div>
    </div>
  )
}
