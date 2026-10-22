import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { AlertIcon } from './icons'

type ErrorStateProps = {
  title?: string
  description: string
  action?: ReactNode
  className?: string
}

/** Pesan gagal yang tidak menampilkan detail teknis/stack trace. */
export function ErrorState({
  title = 'Ada yang tidak berjalan lancar',
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-3xl border border-red-400/30 bg-red-400/5 px-6 py-10',
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-2xl border border-red-400/30 bg-red-400/10 text-red-300">
        <AlertIcon className="size-5" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-5 flex flex-wrap gap-3">{action}</div> : null}
    </div>
  )
}
