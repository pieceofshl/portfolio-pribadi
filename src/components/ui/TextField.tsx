import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  hint?: string
  error?: string
}

/**
 * Input teks dengan label yang selalu terhubung (aksesibilitas).
 * Pesan error dihubungkan lewat aria-describedby.
 */
export function TextField({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-paper">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-xl border border-hairline bg-ink-950/70 px-4 py-3 text-sm text-paper placeholder:text-muted/70',
          'focus:border-accent/70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          error && 'border-red-400/60',
          className,
        )}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
