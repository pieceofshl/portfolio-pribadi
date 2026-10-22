import { cn } from '../../lib/cn'

type LoadingStateProps = {
  label?: string
  count?: number
  className?: string
}

/**
 * Placeholder saat data sedang dimuat. Dipakai pada tahap integrasi data;
 * sekarang ditampilkan sebagai pratinjau komponen di dashboard admin.
 */
export function LoadingState({
  label = 'Memuat konten…',
  count = 3,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn('space-y-4', className)} aria-busy="true" aria-live="polite">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-hairline bg-ink-900/60 p-4"
          >
            <div className="aspect-[4/3] rounded-2xl bg-ink-800" />
            <div className="mt-4 h-3 w-1/3 rounded-full bg-ink-700" />
            <div className="mt-3 h-4 w-3/4 rounded-full bg-ink-700" />
            <div className="mt-2 h-3 w-full rounded-full bg-ink-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
