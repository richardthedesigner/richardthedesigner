type Props = {
  items: string[]
}

// Sitewide footer ticker. Items are duplicated so the -50% scroll loops
// seamlessly. Decorative motion: hidden from the accessibility tree and frozen
// under prefers-reduced-motion (see globals.css).
export function Ticker({items}: Props) {
  if (!items.length) return null
  const run = [...items, ...items]

  return (
    <footer
      className="overflow-hidden border-t border-line bg-paper py-2.5"
      aria-label="Site information"
    >
      <div className="ticker-run font-mono text-[11.5px] text-soft" aria-hidden="true">
        {run.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </footer>
  )
}
