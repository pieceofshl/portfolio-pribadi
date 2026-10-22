import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { StageNotice } from '../../components/admin/StageNotice'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { experiences } from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminExperiencePage() {
  useDocumentTitle('Kelola Pengalaman')

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Kelola"
        title="Pengalaman"
        description="Pengalaman kerja, organisasi, dan proyek yang ditampilkan pada halaman pengalaman."
        action={
          <Button disabled title="Form pengalaman aktif pada Tahap 4">
            + Tambah pengalaman
          </Button>
        }
      />

      <StageNotice>
        Perhatikan contoh entri berstatus “Disembunyikan” di bawah. Entri seperti ini tidak muncul di
        halaman publik. Pengurutan dan form edit baru aktif pada Tahap 4.
      </StageNotice>

      <ul className="space-y-4">
        {experiences.map((experience, index) => (
          <li key={experience.id} className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Urutan {index + 1}
                </p>
                <h2 className="mt-2 text-base font-semibold">{experience.role}</h2>
                <p className="mt-1 text-sm text-accent">{experience.organization}</p>
                <p className="mt-1 text-xs text-muted">{experience.period}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                  {experience.summary}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={experience.isVisible ? 'accent' : 'warning'}>
                  {experience.isVisible ? 'Tampil' : 'Disembunyikan'}
                </Badge>
                <Button variant="secondary" size="sm" disabled title="Edit aktif pada Tahap 4">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" disabled title="Hapus aktif pada Tahap 4">
                  Hapus
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {experiences.length} entri · {experiences.filter((item) => item.isVisible).length} tampil
      </p>
    </div>
  )
}
