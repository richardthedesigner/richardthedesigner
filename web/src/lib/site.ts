// Canonical site origin, shared by metadata, sitemap, robots, JSON-LD and
// llms.txt. NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is the
// fallback, so a missing env var can never ship localhost URLs to production.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

// JSON.stringify for inline <script type="application/ld+json"> blocks.
// Escapes `<` so CMS-sourced strings can never break out of the script tag.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
