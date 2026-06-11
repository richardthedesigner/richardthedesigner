/* eslint-disable no-console */
// Uploads images from import/images/ to Sanity and patches them onto documents.
// Run from the studio folder so it uses your CLI auth:
//
//   cd studio && npx sanity exec ../import/import-images.mjs --with-user-token
//
// Requires the files listed in ../import/images-manifest.json to exist in
// ../import/images/ (download from the Drive links in the manifest).

import {getCliClient} from 'sanity/cli'
import {createReadStream, existsSync} from 'node:fs'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const client = getCliClient({apiVersion: '2025-01-01'})

const manifest = JSON.parse(await readFile(path.join(here, 'images-manifest.json'), 'utf8'))

let ok = 0
let skipped = 0

for (const img of manifest.images) {
  if (!img.targetQuery) {
    skipped++
    continue
  }
  const file = path.join(here, 'images', img.filename)
  if (!existsSync(file)) {
    console.warn(`SKIP (file missing): ${img.filename} — download from ${img.viewUrl}`)
    skipped++
    continue
  }
  const docId = await client.fetch(img.targetQuery)
  if (!docId) {
    console.warn(`SKIP (no target doc): ${img.filename}`)
    skipped++
    continue
  }
  const asset = await client.assets.upload('image', createReadStream(file), {
    filename: img.filename,
  })
  const mediaItem = {
    _type: 'mediaItem',
    kind: 'image',
    alt: img.alt,
    image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
  }
  // Patch the draft if one exists, otherwise the published doc.
  const draftId = `drafts.${docId.replace(/^drafts\./, '')}`
  const publishedId = docId.replace(/^drafts\./, '')
  const targetId = (await client.getDocument(draftId)) ? draftId : publishedId

  if (img.field === 'gallery') {
    await client
      .patch(targetId)
      .setIfMissing({gallery: []})
      .append('gallery', [{...mediaItem, _key: `imp-${Date.now()}-${ok}`}])
      .commit()
  } else {
    await client.patch(targetId).set({[img.field]: mediaItem}).commit()
  }
  console.log(`OK: ${img.filename} -> ${targetId}.${img.field}`)
  ok++
}

console.log(`\nDone. ${ok} uploaded, ${skipped} skipped.`)
console.log('If you patched published docs, no further action needed. If drafts, publish them in the Studio.')
