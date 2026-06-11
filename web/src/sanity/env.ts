export const projectId = assert(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
)
export const dataset = assert(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET',
)
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-11'

function assert(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}
