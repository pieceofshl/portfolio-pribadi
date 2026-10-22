import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeTone = 'accent' | 'neutral' | 'warning' | 'lilac'

const tones: Record<BadgeTone, string> = {
  accent: 'border-accent/30 bg-accent/10 text-accent',
  neutral: 'border-hairline bg-ink-800/70 text-muted',
  warning: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
  lilac: 'border-lilac/30 bg-lilac/10 text-lilac',
}

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

/** Label kecil untuk kategori, status, atau metadata. */
export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
