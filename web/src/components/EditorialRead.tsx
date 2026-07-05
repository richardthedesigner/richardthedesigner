import type {ReadSection, PTBlock} from '@/lib/portable'
import {plainText} from '@/lib/portable'
import {Media, type MediaLike} from '@/components/Media'
import {PortableTextBody} from '@/components/PortableTextBody'
import {Reveal} from '@/components/Reveal'

export type StageImage = MediaLike & {caption?: string | null}

// Editorial long-read: each section is composed by what it actually contains,
// not poured into one text column. Lists become card grids, credits become a
// credit roll, the stack becomes chips, pull quotes become full-bleed smalt
// bands, prose alternates split and full-band image layouts, and the final
// reflection closes the piece on its own terms.
type Treatment = 'prose' | 'cards' | 'credits' | 'chips' | 'closer'

function isListItem(b: PTBlock): boolean {
  return b._type === 'block' && b.listItem != null
}

function classify(section: ReadSection): Treatment {
  const t = (section.title ?? '').toLowerCase()
  if (/team|credit/.test(t)) return 'credits'
  if (/stack|approach/.test(t)) return 'chips'
  if (/what i'd do differently|what it taught me|where it goes|why advisory/.test(t)) return 'closer'
  if (section.blocks.filter(isListItem).length >= 3) return 'cards'
  return 'prose'
}

function SectionNumber({i, light = false}: {i: number; light?: boolean}) {
  return (
    <p aria-hidden="true" className={`font-mono text-xs ${light ? 'text-white/80' : 'text-smalt'}`}>
      {String(i + 1).padStart(2, '0')}
    </p>
  )
}

function Heading({title, light = false}: {title: string | null; light?: boolean}) {
  if (!title) return null
  return (
    <h2
      className={`mt-2.5 mb-4 max-w-[24ch] text-[clamp(23px,2.3vw,32px)] font-semibold leading-[1.12] tracking-[-0.02em] ${
        light ? 'text-white' : 'text-ink'
      }`}
    >
      {title}
    </h2>
  )
}

type SectionPlan = {
  section: ReadSection
  treatment: Treatment
  /** For prose sections: 0 split, 1 band, 2 mirrored split. */
  flavour: number
  image: StageImage | null
  quotes: PTBlock[]
  blocks: PTBlock[]
}

// Pure planning pass: decides each section's treatment, image and quote
// extraction up front so rendering below is a straight map.
function planSections(sections: ReadSection[], images: StageImage[]): SectionPlan[] {
  const plans: SectionPlan[] = []
  let proseIdx = 0
  let imageIdx = 0
  for (const section of sections) {
    const treatment = classify(section)
    const quotes = section.blocks.filter((b) => b._type === 'block' && b.style === 'blockquote')
    const blocks = section.blocks.filter((b) => !(b._type === 'block' && b.style === 'blockquote'))
    let flavour = -1
    let image: StageImage | null = null
    if (treatment === 'prose') {
      flavour = proseIdx % 3
      proseIdx += 1
      image = images.length ? images[imageIdx % images.length] : null
      imageIdx += 1
    }
    plans.push({section, treatment, flavour, image, quotes, blocks})
  }
  return plans
}

export function EditorialRead({
  sections,
  images,
}: {
  sections: ReadSection[]
  images: StageImage[]
}) {
  const plans = planSections(sections, images)

  return (
    <div>
      {plans.map(({section, treatment, flavour, image, quotes, blocks}, i) => {
        let rendered: React.ReactNode
        if (treatment === 'cards') {
          rendered = <CardsSection i={i} section={section} blocks={blocks} />
        } else if (treatment === 'credits') {
          rendered = <CreditsSection i={i} section={section} blocks={blocks} />
        } else if (treatment === 'chips') {
          rendered = <ChipsSection i={i} section={section} blocks={blocks} />
        } else if (treatment === 'closer') {
          rendered = <CloserSection i={i} section={section} blocks={blocks} />
        } else if (flavour === 1) {
          rendered = <BandSection i={i} section={section} blocks={blocks} image={image} />
        } else {
          rendered = (
            <SplitSection
              i={i}
              section={section}
              blocks={blocks}
              image={image}
              mirrored={flavour === 2}
            />
          )
        }

        return (
          <div key={section.key} id={`s-${section.key}`} className="scroll-mt-[12vh]">
            {rendered}
            {quotes.map((q) => (
              <Reveal key={q._key} className="bg-smalt px-6 py-[9vh] text-white sm:px-11">
                <p className="max-w-[18ch] text-[clamp(28px,3.4vw,52px)] font-semibold leading-[1.12] tracking-[-0.025em]">
                  {plainText(q)}
                </p>
              </Reveal>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/* Prose, image beside the text; sides alternate between visits. */
function SplitSection({
  i,
  section,
  blocks,
  image,
  mirrored,
}: {
  i: number
  section: ReadSection
  blocks: PTBlock[]
  image: StageImage | null
  mirrored: boolean
}) {
  return (
    <Reveal className="grid items-center gap-x-10 gap-y-7 px-6 py-[6vh] sm:px-11 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className={mirrored ? 'md:order-2' : ''}>
        <SectionNumber i={i} />
        <Heading title={section.title} />
        <PortableTextBody value={blocks as never} variant="article" />
      </div>
      {image ? (
        <figure
          aria-hidden="true"
          className={`relative aspect-[4/5] max-h-[72vh] w-full overflow-hidden rounded-md bg-paper-2 ${
            mirrored ? 'md:order-1' : ''
          }`}
        >
          <Media media={image} fill width={900} sizes="(max-width: 768px) 100vw, 34vw" />
          {image.caption ? (
            <span className="absolute bottom-3.5 left-3.5 rounded bg-ink/55 px-2.5 py-1.5 font-mono text-[11.5px] text-white backdrop-blur-sm">
              {image.caption}
            </span>
          ) : null}
        </figure>
      ) : null}
    </Reveal>
  )
}

/* Full-width image band with the heading overlaid; prose in a column below. */
function BandSection({
  i,
  section,
  blocks,
  image,
}: {
  i: number
  section: ReadSection
  blocks: PTBlock[]
  image: StageImage | null
}) {
  return (
    <section className="py-[4vh]">
      {image ? (
        <Reveal className="relative h-[52vh] min-h-[340px] overflow-hidden bg-smalt-deep">
          <Media media={image} fill width={1800} sizes="100vw" className="opacity-80" />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-11">
            <SectionNumber i={i} light />
            <Heading title={section.title} light />
          </div>
        </Reveal>
      ) : null}
      <Reveal className="px-6 pt-8 sm:px-11">
        <div className="max-w-[680px]">
          {!image ? (
            <>
              <SectionNumber i={i} />
              <Heading title={section.title} />
            </>
          ) : null}
          <PortableTextBody value={blocks as never} variant="article" />
        </div>
      </Reveal>
    </section>
  )
}

/* Bullet-heavy sections: intro prose, then each item as an indexed card. */
function CardsSection({i, section, blocks}: {i: number; section: ReadSection; blocks: PTBlock[]}) {
  const firstItem = blocks.findIndex(isListItem)
  const intro = firstItem === -1 ? blocks : blocks.slice(0, firstItem)
  const rest = firstItem === -1 ? [] : blocks.slice(firstItem)
  const items = rest.filter(isListItem)
  const after = rest.filter((b) => !isListItem(b))

  return (
    <Reveal className="px-6 py-[6vh] sm:px-11">
      <SectionNumber i={i} />
      <Heading title={section.title} />
      {intro.length ? (
        <div className="max-w-[640px]">
          <PortableTextBody value={intro as never} variant="article" />
        </div>
      ) : null}
      <ul className="mt-2 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, n) => (
          <li
            key={item._key}
            className="flex flex-col gap-2.5 border border-line bg-paper px-5 py-4"
          >
            <span aria-hidden="true" className="font-mono text-[11px] text-smalt">
              {String(n + 1).padStart(2, '0')}
            </span>
            <span className="text-[15px] leading-[1.55] text-ink">{plainText(item)}</span>
          </li>
        ))}
      </ul>
      {after.length ? (
        <div className="mt-6 max-w-[640px]">
          <PortableTextBody value={after as never} variant="article" />
        </div>
      ) : null}
    </Reveal>
  )
}

/* Team and credits: a quiet credit roll on the secondary paper. */
function CreditsSection({i, section, blocks}: {i: number; section: ReadSection; blocks: PTBlock[]}) {
  const items = blocks.filter(isListItem)
  const prose = blocks.filter((b) => !isListItem(b))
  return (
    <Reveal className="bg-paper-2 px-6 py-[6vh] sm:px-11">
      <SectionNumber i={i} />
      <h2 className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
        {section.title}
      </h2>
      {prose.length ? (
        <div className="mt-4 max-w-[560px] [&_p]:text-[14.5px] [&_p]:italic [&_p]:text-soft">
          <PortableTextBody value={prose as never} variant="article" />
        </div>
      ) : null}
      {items.length ? (
        <ul className="mt-6 grid max-w-[880px] gap-x-12 gap-y-3.5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item._key} className="border-l-2 border-line pl-4 text-[13.5px] leading-[1.55] text-soft">
              {plainText(item)}
            </li>
          ))}
        </ul>
      ) : null}
    </Reveal>
  )
}

/* Stack and approach: the toolkit as chips. */
function ChipsSection({i, section, blocks}: {i: number; section: ReadSection; blocks: PTBlock[]}) {
  const chips = blocks
    .flatMap((b) => plainText(b).split(/,(?![^(]*\))/))
    .map((c) => c.replace(/\.\s*$/, '').replace(/^and /, '').trim())
    .filter(Boolean)
  return (
    <Reveal className="border-t border-b border-line px-6 py-[5vh] sm:px-11">
      <SectionNumber i={i} />
      <h2 className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
        {section.title}
      </h2>
      <ul className="mt-5 flex max-w-[880px] flex-wrap gap-2">
        {chips.map((chip, n) => (
          <li
            key={n}
            className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[12px] text-ink"
          >
            {chip}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

/* The reflection that ends the piece. */
function CloserSection({i, section, blocks}: {i: number; section: ReadSection; blocks: PTBlock[]}) {
  return (
    <Reveal className="px-6 py-[7vh] sm:px-11">
      <div className="max-w-[680px] border-t-2 border-smalt pt-8">
        <SectionNumber i={i} />
        <Heading title={section.title} />
        <div className="[&_p]:text-[clamp(17px,1.5vw,20px)] [&_p]:leading-[1.65]">
          <PortableTextBody value={blocks as never} variant="article" />
        </div>
      </div>
    </Reveal>
  )
}
