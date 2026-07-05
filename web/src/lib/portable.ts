// Utilities for restructuring a Portable Text body into the long-read
// (scrollytelling) layout: the body is split into sections at each h2, which
// become numbered steps; anything before the first h2 becomes the lede.

export type PTBlock = {
  _type: string
  _key: string
  style?: string
  listItem?: string
  level?: number
  children?: {text?: string | null}[]
}

export function plainText(block: PTBlock): string {
  return (block.children ?? []).map((c) => c.text ?? '').join('')
}

export type ReadSection = {
  key: string
  title: string | null
  blocks: PTBlock[]
}

export function splitBody(body: PTBlock[]): {lede: PTBlock[]; sections: ReadSection[]} {
  const lede: PTBlock[] = []
  const sections: ReadSection[] = []
  let current: ReadSection | null = null

  for (const block of body) {
    if (block._type === 'block' && block.style === 'h2') {
      if (current) sections.push(current)
      current = {
        key: block._key,
        title: block.children?.map((c) => c.text ?? '').join('') || null,
        blocks: [],
      }
    } else if (current) {
      current.blocks.push(block)
    } else {
      lede.push(block)
    }
  }
  if (current) sections.push(current)

  return {lede, sections}
}
