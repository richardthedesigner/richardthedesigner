import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
        404
      </p>
      <h1 className="mt-3 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.025em]">
        Nothing here.
      </h1>
      <p className="mt-4 max-w-[44ch] text-[15px] text-soft">
        That page has moved, or never existed. Head back to the index.
      </p>
      <Link
        href="/"
        className="mt-8 self-start rounded-full bg-smalt px-5 py-2.5 font-mono text-xs text-white transition-colors hover:bg-smalt-deep"
      >
        ← Back to work
      </Link>
    </div>
  )
}
