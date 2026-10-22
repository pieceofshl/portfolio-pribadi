import type { Certificate } from '../data/mockData'
import { buttonStyles } from './ui/buttonStyles'
import { Badge } from './ui/Badge'
import { ArrowUpRight, SparkIcon } from './ui/icons'

type CertificateCardProps = {
  certificate: Certificate
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const hasCredential = Boolean(certificate.credentialUrl)

  return (
    <article className="surface flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-xl border border-hairline bg-ink-800 text-accent">
          <SparkIcon className="size-5" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {certificate.date}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-snug">{certificate.title}</h3>
      <p className="mt-1 text-sm text-muted">{certificate.issuer}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {hasCredential ? (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: 'secondary', size: 'sm' })}
          >
            Lihat kredensial
            <ArrowUpRight className="size-4" />
            <span className="sr-only">(buka di tab baru)</span>
          </a>
        ) : null}
        {certificate.documentLabel ? (
          <Badge tone="neutral">PDF · {certificate.documentLabel}</Badge>
        ) : null}
        {!hasCredential && !certificate.documentLabel ? (
          <span className="text-xs text-muted">Dokumen belum dilampirkan.</span>
        ) : null}
      </div>
    </article>
  )
}
