import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-ink-950 hover:bg-accent-dim',
  secondary:
    'border border-hairline bg-ink-800/60 text-paper hover:border-accent/60 hover:text-accent',
  ghost: 'text-muted hover:text-accent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
}

type StyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/**
 * Kelas tombol dipakai ulang oleh <button>, <Link>, dan <a>,
 * sehingga tampilan tautan dan tombol selalu konsisten.
 */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: StyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], className)
}
