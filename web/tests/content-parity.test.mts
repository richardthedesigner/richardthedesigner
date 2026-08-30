import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'

// These guards read the *source text* rather than importing it. The two files
// live in separate npm packages with different module settings, so importing
// across the boundary is more trouble than it is worth, and reading the literal
// each package ships is arguably the stronger check.

const repo = new URL('../../', import.meta.url)
const read = (p: string) => readFileSync(fileURLToPath(new URL(p, repo)), 'utf8')

/** The lines of an array literal, from `const NAME = [` to its closing bracket. */
function arrayBlock(src: string, declaration: string): string {
  const start = src.indexOf(declaration)
  assert.notEqual(start, -1, `could not find "${declaration}"`)
  const open = src.indexOf('[', start)
  const close = src.indexOf('\n]', open)
  assert.ok(close > open, `could not find the end of "${declaration}"`)
  return src.slice(open, close)
}

/** Top-level keys of an object literal, at exactly one level of indent. */
function objectKeys(src: string, declaration: string): string[] {
  const start = src.indexOf(declaration)
  assert.notEqual(start, -1, `could not find "${declaration}"`)
  const body = src.slice(src.indexOf('{', start))
  const end = body.indexOf('\n}')
  return [...body.slice(0, end).matchAll(/^ {2}'?([a-zA-Z0-9-]+)'?:/gm)].map(
    (m) => m[1],
  )
}

const values = (block: string) =>
  [...block.matchAll(/value:\s*'([a-z0-9-]+)'/g)].map((m) => m[1])

// ---------------------------------------------------------------------------
// Tags. The CMS list and the frontend list are a deliberate mirror, but they
// sit in separate packages with nothing checking they agree. In August they
// drifted, and a tag landed on the wrong piece.
// ---------------------------------------------------------------------------
test('story tags match between the schema and the frontend', () => {
  const schema = values(
    arrayBlock(read('studio/schema/shared.ts'), 'export const storyTags'),
  )
  const frontend = values(
    arrayBlock(read('web/src/lib/tags.ts'), 'export const STORY_TAGS'),
  )

  assert.ok(schema.length > 0, 'no tags found in the schema')
  assert.deepEqual(
    frontend,
    schema,
    'web/src/lib/tags.ts and studio/schema/shared.ts disagree. ' +
      'They must hold the same values in the same order.',
  )
})

// ---------------------------------------------------------------------------
// Fallback imagery. A key that does not match a slug is invisible: the piece
// just renders with no hero, no gallery and no og:image, which is exactly what
// `prepay-qikserve` did to a 23-block case study.
// ---------------------------------------------------------------------------
const QUERY = `*[_type in ["caseStudy","project"] && defined(slug.current)]{
  "s": slug.current,
  "hasHero": defined(heroMedia.image) || defined(heroMedia.videoUrl)
}`

type Work = {s: string; hasHero: boolean}

async function publishedWork(): Promise<Work[]> {
  const url =
    'https://dbfopugh.apicdn.sanity.io/v2026-06-11/data/query/production?query=' +
    encodeURIComponent(QUERY)
  const res = await fetch(url)
  assert.ok(res.ok, `Sanity query failed: ${res.status}`)
  const {result} = (await res.json()) as {result: Work[]}
  return result
}

test('fallback imagery covers every piece that has none of its own', async () => {
  const src = read('web/src/lib/fallbackImages.ts')
  const work = await publishedWork()
  assert.ok(work.length > 0, 'no work returned from Sanity')

  const allSlugs = new Set(work.map((w) => w.s))
  // Only pieces without real imagery need a fallback. Once a document has its
  // own heroMedia the map stops being consulted, so a missing key there is
  // fine; a missing key on a piece with nothing is a bare render.
  const needsFallback = work.filter((w) => !w.hasHero).map((w) => w.s)

  for (const decl of ['export const FALLBACK_IMAGES', 'const SLUG_THEMES']) {
    const keys = new Set(objectKeys(src, decl))

    // A key that matches no slug is the `prepay-qikserve` failure: silent, and
    // it costs the piece its hero, gallery and og:image.
    assert.deepEqual(
      [...keys].filter((k) => !allSlugs.has(k)),
      [],
      `${decl} has keys matching no slug`,
    )
    assert.deepEqual(
      needsFallback.filter((s) => !keys.has(s)),
      [],
      `${decl} is missing keys for pieces that have no imagery of their own`,
    )
  }
})
