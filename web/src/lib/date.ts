export function formatDate(
  iso: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'},
): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', opts).format(d)
}
