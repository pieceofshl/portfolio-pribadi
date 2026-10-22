import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { StageNotice } from '../../components/admin/StageNotice'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { certificates } from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminCertificatesPage() {
  useDocumentTitle('Kelola Sertifikat')

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Kelola"
        title="Sertifikat"
        description="Daftar seluruh sertifikat, termasuk draft dan berkas pendukung. Upload PDF dikerjakan pada Tahap 5."
        action={
          <Button disabled title="Form sertifikat baru aktif pada Tahap 4">
            + Sertifikat baru
          </Button>
        }
      />

      <StageNotice>
        Tampilan baca-saja. Belum ada berkas yang benar-benar diunggah atau dapat diunduh.
      </StageNotice>

      <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-ink-900/50">
        {certificates.map((certificate) => (
          <li
            key={certificate.id}
            className="grid gap-3 p-4 sm:grid-cols-[1.6fr_1fr_auto] sm:items-center sm:p-5"
          >
            <div>
              <p className="font-medium">{certificate.title}</p>
              <p className="mt-1 text-xs text-muted">
                {certificate.issuer} · {certificate.date}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={certificate.status === 'published' ? 'accent' : 'warning'}>
                {certificate.status === 'published' ? 'Terbit' : 'Draft'}
              </Badge>
              {certificate.documentLabel ? (
                <Badge>PDF · {certificate.documentLabel}</Badge>
              ) : (
                <span className="text-[11px] text-muted">Tanpa berkas</span>
              )}
            </div>
            <div className="flex gap-2 sm:justify-end">
              <Button variant="secondary" size="sm" disabled title="Edit aktif pada Tahap 4">
                Edit
              </Button>
              <Button variant="ghost" size="sm" disabled title="Hapus aktif pada Tahap 4">
                Hapus
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {certificates.length} sertifikat · {certificates.filter((item) => item.status === 'draft').length}{' '}
        draft
      </p>
    </div>
  )
}
