import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

// File assets (mp4 video) are not images, so build the CDN URL by hand from the
// asset _ref, e.g. "file-<id>-mp4" -> https://cdn.sanity.io/files/<p>/<d>/<id>.mp4
export function fileUrl(ref: string | undefined): string | undefined {
  if (!ref) return undefined
  const [, id, ext] = ref.split('-')
  if (!id || !ext) return undefined
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`
}
