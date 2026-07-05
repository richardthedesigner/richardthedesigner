// Public Sanity connection details. Env vars win so the values can be
// overridden per environment; the fallbacks are the project's own public
// identifiers (dataset is read via the CDN with no token), so a build never
// hard-fails just because an environment — a Vercel preview, a fork, a fresh
// clone — hasn't set them. Mirrors the inline default already used for
// apiVersion below and the graceful fallbacks in lib/site.ts.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dbfopugh'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-11'
