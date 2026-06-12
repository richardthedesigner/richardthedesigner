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
  'gdk-kiosk-go-live': {
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
