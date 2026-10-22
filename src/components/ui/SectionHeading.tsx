import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  /** Dipakai sebagai target `aria-labelledby` pada `<section>` pembungkus. */
  headingId?: string
  className?: string
}

/** Judul bagian dengan label kecil di atasnya + area aksi di kanan. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  headingId,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2
          id={headingId}
          className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
