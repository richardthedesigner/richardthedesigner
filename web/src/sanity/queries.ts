import {defineQuery} from 'next-sanity'

// Note: no query selects `publishingStatus`. It is an internal workflow field
// and must never reach the public site. Only published docs are visible because
// the client uses the `published` perspective with no token.

// ---------------------------------------------------------------------------
// Home — site settings + work grid (gridOrder first, then any leftover work)
// ---------------------------------------------------------------------------
export const HOME_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    title,
    intro
  },
  "ordered": *[_id == "siteSettings"][0].gridOrder[]->{
    _id,
    _type,
    title,
    "slug": slug.current,
    tags,
    client,
    year,
    "subtitle": select(
      _type == "caseStudy" => coalesce(sector, client, role),
      coalesce(client, description)
    ),
    heroMedia{
      kind,
      alt,
      image,
      poster,
      "videoUrl": coalesce(videoUrl, videoFile.asset->url),
      "lqip": image.asset->metadata.lqip
    }
  },
  "extra": *[
    (_type == "caseStudy" || _type == "project")
    && defined(slug.current)
    && !(_id in *[_id == "siteSettings"][0].gridOrder[]._ref)
  ] | order(coalesce(order, 100) asc, coalesce(year, 0) desc){
    _id,
    _type,
    title,
    "slug": slug.current,
    tags,
    client,
    year,
    "subtitle": select(
      _type == "caseStudy" => coalesce(sector, client, role),
      coalesce(client, description)
    ),
    heroMedia{
      kind,
      alt,
      image,
      poster,
      "videoUrl": coalesce(videoUrl, videoFile.asset->url),
      "lqip": image.asset->metadata.lqip
    }
  }
}`)

// ---------------------------------------------------------------------------
// Ordered work (slug + title + type) for prev/next navigation on detail pages
// ---------------------------------------------------------------------------
export const WORK_ORDER_QUERY = defineQuery(`{
  "ordered": *[_id == "siteSettings"][0].gridOrder[]->{
    _type,
    title,
    "slug": slug.current
  },
  "extra": *[
    (_type == "caseStudy" || _type == "project")
    && defined(slug.current)
    && !(_id in *[_id == "siteSettings"][0].gridOrder[]._ref)
  ] | order(coalesce(order, 100) asc, coalesce(year, 0) desc){
    _type,
    title,
    "slug": slug.current
  }
}`)

// ---------------------------------------------------------------------------
// Work slugs for generateStaticParams
// ---------------------------------------------------------------------------
export const WORK_SLUGS_QUERY = defineQuery(`
  *[(_type == "caseStudy" || _type == "project") && defined(slug.current)]{
    "slug": slug.current
  }
`)

// ---------------------------------------------------------------------------
// Work detail (case study OR project) by slug
// ---------------------------------------------------------------------------
export const WORK_QUERY = defineQuery(`
  *[(_type == "caseStudy" || _type == "project") && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    standfirst,
    description,
    client,
    role,
    sector,
    timeframe,
    year,
    tags,
    heroMedia{
      kind,
      alt,
      caption,
      image,
      poster,
      "videoUrl": coalesce(videoUrl, videoFile.asset->url),
      "lqip": image.asset->metadata.lqip
    },
    metrics[]{
      _key,
      value,
      label,
      note
    },
    body[]{
      ...,
      _type == "mediaItem" => {
        ...,
        "videoUrl": coalesce(videoUrl, videoFile.asset->url),
        "lqip": image.asset->metadata.lqip
      }
    },
    gallery[]{
      _key,
      kind,
      alt,
      caption,
      image,
      poster,
      "videoUrl": coalesce(videoUrl, videoFile.asset->url),
      "lqip": image.asset->metadata.lqip
    }
  }
`)

// ---------------------------------------------------------------------------
// Musings — index + detail
// ---------------------------------------------------------------------------
export const MUSINGS_INDEX_QUERY = defineQuery(`
  *[_type == "musing" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    tags
  }
`)

export const MUSING_SLUGS_QUERY = defineQuery(`
  *[_type == "musing" && defined(slug.current)]{
    "slug": slug.current
  }
`)

export const MUSING_QUERY = defineQuery(`
  *[_type == "musing" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    tags,
    body[]{
      ...,
      _type == "mediaItem" => {
        ...,
        "videoUrl": coalesce(videoUrl, videoFile.asset->url),
        "lqip": image.asset->metadata.lqip
      }
    }
  }
`)

// ---------------------------------------------------------------------------
// Info / about (full site settings)
// ---------------------------------------------------------------------------
export const INFO_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    title,
    intro,
    contactEmail,
    locations,
    social[]{
      _key,
      label,
      url
    }
  }
`)

// ---------------------------------------------------------------------------
// Layout — ticker + contact, sitewide
// ---------------------------------------------------------------------------
export const LAYOUT_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    title,
    tickerItems,
    contactEmail
  }
`)
