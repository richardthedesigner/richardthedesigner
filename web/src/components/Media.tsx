'use client'

import type {SanityImageSource} from '@sanity/image-url'

import {urlForImage} from '@/sanity/image'
import {useReducedMotion} from '@/hooks/useReducedMotion'

export type MediaLike = {
  kind?: 'image' | 'video' | null
  alt?: string | null
  caption?: string | null
  image?: SanityImageSource | null
  poster?: SanityImageSource | null
  videoUrl?: string | null
  lqip?: string | null
  /** Plain remote image URL (e.g. Unsplash fallback) used when no Sanity asset exists. */
  externalUrl?: string | null
}

type Props = {
  media: MediaLike | null | undefined
  /** Target rendered width in px (drives the requested image size). */
  width?: number
  /** Fill the positioned parent and crop to cover. */
  fill?: boolean
  className?: string
  /** Eager-load the first/hero image for LCP. */
  priority?: boolean
  sizes?: string
}

export function Media({
  media,
  width = 1200,
  fill = false,
  className = '',
  priority = false,
  sizes,
}: Props) {
  const reduced = useReducedMotion()
  if (!media) return null

  const alt = media.alt ?? ''
  const base = fill
    ? `absolute inset-0 h-full w-full object-cover ${className}`
    : `block h-auto w-full ${className}`

  // Video: autoplay muted loop — unless the user prefers reduced motion, in
  // which case we show the poster still image instead of any movement.
  if (media.kind === 'video' && media.videoUrl) {
    const posterUrl = media.poster
      ? urlForImage(media.poster).width(width).url()
      : undefined

    if (reduced) {
      return posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={posterUrl} alt={alt} className={base} loading="lazy" decoding="async" />
      ) : (
        <span
          className={base}
          role="img"
          aria-label={alt}
          style={{backgroundColor: 'var(--color-paper-2)'}}
        />
      )
    }

    return (
      <video
        className={base}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl}
        aria-label={alt || undefined}
      >
        <source src={media.videoUrl} type="video/mp4" />
      </video>
    )
  }

  // External fallback image (no Sanity asset)
  if (!media.image && media.externalUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.externalUrl}
        sizes={sizes}
        alt={alt}
        className={base}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    )
  }

  // Image
  if (media.image) {
    const url = urlForImage(media.image).width(width).url()
    const url2x = urlForImage(media.image)
      .width(width * 2)
      .url()
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        srcSet={`${url} 1x, ${url2x} 2x`}
        sizes={sizes}
        alt={alt}
        className={base}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        style={
          media.lqip
            ? {backgroundSize: 'cover', backgroundImage: `url(${media.lqip})`}
            : undefined
        }
      />
    )
  }

  return null
}
