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
    // Purely decorative strip (the real footer is SiteFooter); hidden from the tree.
    <div className="overflow-hidden border-t border-line bg-paper py-2.5" aria-hidden="true">
      <div className="ticker-run font-mono text-[11.5px] text-soft">
        {run.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  )
}
