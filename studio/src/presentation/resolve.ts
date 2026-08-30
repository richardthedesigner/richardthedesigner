import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

// Where each document shows up on the site. Presentation uses this for the
// "used on" list and to keep the iframe pointed at the right page while you
// edit. The hrefs must match the routes in web/src/app.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    caseStudy: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled case study', href: `/work/${doc?.slug}`},
          {title: 'Home', href: '/'},
        ],
      }),
    }),

    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled project', href: `/work/${doc?.slug}`},
          {title: 'Home', href: '/'},
        ],
      }),
    }),

    musing: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled musing', href: `/musings/${doc?.slug}`},
          {title: 'Musings', href: '/musings'},
        ],
      }),
    }),

    // The singleton drives the ticker and footer everywhere, but these two are
    // the pages where editing it is worth watching.
    siteSettings: defineLocations({
      message: 'This document is used on every page.',
      locations: [
        {title: 'Home', href: '/'},
        {title: 'Info', href: '/info'},
      ],
    }),
  },
}
