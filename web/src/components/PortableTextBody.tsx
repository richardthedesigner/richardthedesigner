import {PortableText} from 'next-sanity'

import {Media, type MediaLike} from '@/components/Media'
import {Reveal} from '@/components/Reveal'

type Variant = 'article' | 'muse'
type PortableTextComponents = NonNullable<
  React.ComponentProps<typeof PortableText>['components']
>
type PortableTextValue = React.ComponentProps<typeof PortableText>['value']

function mediaSerializer(value: MediaLike & {caption?: string | null}) {
  return (
    <Reveal as="figure" className="my-7">
      <div className="overflow-hidden rounded-md bg-paper-2">
        <Media media={value} width={1400} sizes="(max-width: 768px) 100vw, 720px" />
      </div>
      {value.caption ? (
        <figcaption className="mt-2.5 font-mono text-[11.5px] text-soft">
          {value.caption}
        </figcaption>
      ) : null}
    </Reveal>
  )
}

const linkMark: PortableTextComponents['marks'] = {
  link: ({value, children}) => {
    const href = (value as {href?: string})?.href ?? '#'
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className="text-smalt-deep underline decoration-from-font underline-offset-2 hover:text-smalt"
        {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      >
        {children}
      </a>
    )
  },
}

const articleComponents: PortableTextComponents = {
  types: {mediaItem: ({value}) => mediaSerializer(value as MediaLike)},
  marks: linkMark,
  block: {
    normal: ({children}) => (
      <p className="mb-5 max-w-[60ch] text-[17px] leading-[1.7] text-ink">
        {children}
      </p>
    ),
    h2: ({children}) => (
      <h2 className="mt-12 mb-3.5 max-w-[28ch] text-[clamp(22px,2.2vw,30px)] font-semibold tracking-[-0.02em] text-ink">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="mt-8 mb-3 text-[19px] font-semibold tracking-[-0.01em] text-ink">
        {children}
      </h3>
    ),
    blockquote: ({children}) => (
      <blockquote className="my-8 max-w-[20ch] text-[clamp(22px,2.6vw,34px)] font-semibold leading-[1.18] tracking-[-0.02em] text-smalt-deep">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="mb-5 max-w-[60ch] list-disc space-y-2 pl-5 text-[17px] leading-[1.6] text-ink">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="mb-5 max-w-[60ch] list-decimal space-y-2 pl-5 text-[17px] leading-[1.6] text-ink">
        {children}
      </ol>
    ),
  },
}

const museComponents: PortableTextComponents = {
  types: {mediaItem: ({value}) => mediaSerializer(value as MediaLike)},
  marks: linkMark,
  block: {
    normal: ({children}) => (
      <p className="mb-[22px] font-display text-[20px] leading-[1.72] text-warm-ink">
        {children}
      </p>
    ),
    h2: ({children}) => (
      <h2 className="mt-10 mb-4 font-display text-[clamp(24px,3vw,34px)] font-medium leading-[1.2] text-warm-ink">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="mt-7 mb-3 font-display text-[22px] font-medium text-warm-ink">
        {children}
      </h3>
    ),
    blockquote: ({children}) => (
      <p className="mx-auto my-8 max-w-[26ch] text-center font-display text-[clamp(24px,2.6vw,32px)] font-medium leading-[1.3] text-rust-deep">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="mb-[22px] list-disc space-y-2 pl-5 font-display text-[19px] leading-[1.6] text-warm-ink">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="mb-[22px] list-decimal space-y-2 pl-5 font-display text-[19px] leading-[1.6] text-warm-ink">
        {children}
      </ol>
    ),
  },
}

export function PortableTextBody({
  value,
  variant = 'article',
}: {
  value: PortableTextValue | null | undefined
  variant?: Variant
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <PortableText
      value={value}
      components={variant === 'muse' ? museComponents : articleComponents}
    />
  )
}
