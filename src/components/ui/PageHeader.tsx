import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type PageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

/** Kepala halaman untuk semua halaman dalam (selain beranda). */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'relative overflow-hidden border-b border-hairline bg-ink-900/30',
        className,
      )}
    >
      <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-32 size-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  )
}
