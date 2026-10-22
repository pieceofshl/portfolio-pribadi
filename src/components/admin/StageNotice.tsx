import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { InfoIcon } from '../ui/icons'

type StageNoticeProps = {
  children: ReactNode
  className?: string
}

/** Pengingat bahwa halaman admin masih kerangka Tahap 1. */
export function StageNotice({ children, className }: StageNoticeProps) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border border-lilac/25 bg-lilac/5 p-4 text-xs leading-relaxed text-muted',
        className,
      )}
    >
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-lilac" />
      <p>{children}</p>
    </div>
  )
}
