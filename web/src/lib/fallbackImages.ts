// Temporary hero imagery (Unsplash) for pieces that don't yet have real
// work assets in Sanity. Keyed by slug. When a document gains a real
// heroMedia in the Studio, it automatically wins over this map.
// Remove entries as real imagery lands. All photos via images.unsplash.com.

export type FallbackImage = {url: string; alt: string}

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`

export const FALLBACK_IMAGES: Record<string, FallbackImage> = {
  'qikserve-kiosk': {
    url: u('photo-1687969962129-dd77e13b95b7'),
    alt: 'Self-service ordering kiosk in a restaurant',
  },
  'qikserve-online-ordering': {
    url: u('photo-1601972602288-3be527b4f18a'),
    alt: 'Contactless payment on a mobile ordering flow',
  },
  'access-evo': {
    url: u('photo-1493397212122-2b85dda8106b'),
    alt: 'Repeating architectural grid structure',
  },
  orson: {
    url: u('photo-1677442136019-21780ecad995'),
    alt: 'Abstract light forms suggesting machine intelligence',
  },
  'the-brotique': {
    url: u('photo-1585747860715-2ba37e788b70'),
    alt: 'Classic barbershop interior',
  },
  strunk: {
    url: u('photo-1609605348579-3123e3d40eb8'),
    alt: 'Letterpress type blocks in a case',
  },
  'access-evoguest': {
    url: u('photo-1483366774565-c783b9f70e2c'),
    alt: 'Glass facade with a regular structural grid',
  },
  'prepay-qikserve': {
    url: u('photo-1524351543168-8e38787614e9'),
    alt: 'Two converging architectural planes',
  },
  quoin: {
    url: u('photo-1497366216548-37526070297c'),
    alt: 'Quiet modern office interior',
  },
  'qsr-kiosk-go-live': {
    url: u('photo-1711632308710-f2e5bf722778'),
    alt: 'Ordering kiosk screen in a quick-service restaurant',
  },
  'access-kiosk-pocket': {
    url: u('photo-1556742205-e10c9486e506'),
    alt: 'Handheld card payment at the counter',
  },
  'hudson-and-armitage': {
    url: u('photo-1461958508236-9a742665a0d5'),
    alt: 'Metal type sorted in a printer’s tray',
  },
  optify: {
    url: u('photo-1522072783977-1117b39ffb58'),
    alt: 'Abstract structured pattern of repeating units',
  },
  'realise-offices': {
    url: u('photo-1497366412874-3415097a27e7'),
    alt: 'Workplace interior with strong brand surfaces',
  },
  causewayside: {
    url: u('photo-1535905471006-9b3b2c82ea94'),
    alt: 'Stone tenement street in Edinburgh',
  },
  iamhere: {
    url: u('photo-1608531078362-d1dcb855bc9f'),
    alt: 'Minimal abstract marker on an empty field',
  },
  flymynight: {
    url: u('photo-1509413031665-0d52b03f5cde'),
    alt: 'Light trails across a city at night',
  },
  'cinema-design': {
    url: u('photo-1761344580244-767bc4e2e8c8'),
    alt: 'Empty cinema auditorium seats facing the screen',
  },
  'project-50': {
    url: u('photo-1436918898788-ebce04d38e46'),
    alt: 'Vintage numbered type sorts',
  },
  'qikserve-payments': {
    url: u('photo-1609427955204-d0a737cb2c1a'),
    alt: 'Contactless card payment at a terminal',
  },
  'open-check': {
    url: u('photo-1564758596151-c17d1590f483'),
    alt: 'Restaurant table mid-service',
  },
  'pay-at-table': {
    url: u('photo-1568031814106-ac1b1cc12b71'),
    alt: 'Paying the bill from a phone at the table',
  },
  'draper-and-dow': {
    url: u('photo-1610454059909-f9a5a6eb4e58'),
    alt: 'Letterpress type detail',
  },
  'coutts-and-murphy': {
    url: u('photo-1603204254626-d0de8eb24cf1'),
    alt: 'Composed metal type on a press bed',
  },
  quarters: {
    url: u('photo-1497366616365-e78dd380d3dd'),
    alt: 'Considered retail interior',
  },
  'tiger-forest': {
    url: u('photo-1741513542259-e9cc5cb9bb2e'),
    alt: 'Abstract layered forms',
  },
  'brotique-stores': {
    url: u('photo-1709531766566-7e26b3ea582d'),
    alt: 'Stone-fronted shops on an Edinburgh street',
  },
}

export function fallbackFor(slug: string | null | undefined): FallbackImage | null {
  if (!slug) return null
  return FALLBACK_IMAGES[slug] ?? null
}

// ---------------------------------------------------------------------------
// Filler galleries: themed pools so detail pages aren't walls of text while
// real artefacts are gathered. Replaced automatically once a document has a
// real `gallery` in Sanity.
// ---------------------------------------------------------------------------

type Theme = 'kiosk' | 'ordering' | 'ai' | 'print' | 'retail' | 'office' | 'cinema' | 'edinburgh' | 'abstract'

const POOLS: Record<Theme, [string, string][]> = {
  kiosk: [
    ['photo-1771589485221-4440612ada2e', 'Self-service screen in use'],
    ['photo-1777678930403-3d87fad8fd60', 'Ordering interface detail'],
    ['photo-1777679883845-6e1b732e2063', 'Guest interacting with a kiosk'],
  ],
  ordering: [
    ['photo-1601972602288-3be527b4f18a', 'Contactless payment moment'],
    ['photo-1564758596151-c17d1590f483', 'Table mid-service'],
    ['photo-1568031814106-ac1b1cc12b71', 'Settling up from a phone'],
  ],
  ai: [
    ['photo-1674027444485-cec3da58eef4', 'Abstract machine-intelligence forms'],
    ['photo-1727434032773-af3cd98375ba', 'Light structure suggesting computation'],
    ['photo-1695144244472-a4543101ef35', 'Generated pattern detail'],
  ],
  print: [
    ['photo-1581080247486-57989c1f14ab', 'Type detail under the loupe'],
    ['photo-1515325915697-9279b4f7effc', 'Press furniture and sorts'],
    ['photo-1535054820380-92c41678b087', 'Ink on paper texture'],
  ],
  retail: [
    ['photo-1678356164573-9a534fe43958', 'Shop interior detail'],
    ['photo-1519500528352-2d1460418d41', 'Counter and product display'],
    ['photo-1514336937476-a5b961020a5c', 'Considered shelving'],
  ],
  office: [
    ['photo-1520032525096-7bd04a94b5a4', 'Workplace interior'],
    ['photo-1616386261012-8a328c89d5b6', 'Meeting space detail'],
    ['photo-1643267514395-b36b3f7e8281', 'Brand applied to space'],
  ],
  cinema: [
    ['photo-1760170437237-a3654545ab4c', 'Auditorium light'],
    ['photo-1758839295128-b04f48b1b08c', 'Screen room detail'],
    ['photo-1722321974528-ec8eaf725777', 'Foyer atmosphere'],
  ],
  edinburgh: [
    ['photo-1691201200746-9a95b64a3436', 'Edinburgh stone and light'],
    ['photo-1578770701978-0b6bfec6e492', 'Street elevation detail'],
    ['photo-1698129781654-70aaa1cdaf6a', 'City texture'],
  ],
  abstract: [
    ['photo-1493397212122-2b85dda8106b', 'Repeating structural rhythm'],
    ['photo-1524351543168-8e38787614e9', 'Converging planes'],
    ['photo-1770816305998-57eec25ac2d5', 'Minimal geometry'],
  ],
}

const SLUG_THEMES: Record<string, Theme> = {
  'qikserve-kiosk': 'kiosk',
  'qikserve-online-ordering': 'ordering',
  'access-evo': 'abstract',
  orson: 'ai',
  'the-brotique': 'retail',
  strunk: 'print',
  'access-evoguest': 'kiosk',
  'prepay-qikserve': 'abstract',
  quoin: 'office',
  'qsr-kiosk-go-live': 'kiosk',
  'access-kiosk-pocket': 'ordering',
  'hudson-and-armitage': 'print',
  optify: 'abstract',
  'realise-offices': 'office',
  causewayside: 'edinburgh',
  iamhere: 'abstract',
  flymynight: 'cinema',
  'cinema-design': 'cinema',
  'project-50': 'print',
  'qikserve-payments': 'ordering',
  'open-check': 'ordering',
  'pay-at-table': 'ordering',
  'draper-and-dow': 'print',
  'coutts-and-murphy': 'print',
  quarters: 'retail',
  'tiger-forest': 'abstract',
  'brotique-stores': 'edinburgh',
}

export function fallbackGalleryFor(slug: string | null | undefined): FallbackImage[] {
  if (!slug) return []
  const theme = SLUG_THEMES[slug]
  if (!theme) return []
  const hero = FALLBACK_IMAGES[slug]?.url
  return POOLS[theme]
    .map(([id, alt]) => ({url: u(id), alt}))
    .filter((img) => img.url !== hero)
    .slice(0, 3)
}
