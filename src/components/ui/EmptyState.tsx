import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { FolderIcon } from './icons'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

/** Ditampilkan saat pencarian kosong atau data belum tersedia. */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-3xl border border-dashed border-hairline bg-ink-900/40 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-2xl border border-hairline bg-ink-800 text-accent">
        {icon ?? <FolderIcon className="size-5" />}
      </span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  )
}
