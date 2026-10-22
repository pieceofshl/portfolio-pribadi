import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { StageNotice } from '../../components/admin/StageNotice'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { educations } from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminEducationPage() {
  useDocumentTitle('Kelola Pendidikan')

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Kelola"
        title="Pendidikan"
        description="Riwayat pendidikan yang tampil di halaman tentang dan pengalaman."
        action={
          <Button disabled title="Form pendidikan aktif pada Tahap 4">
            + Tambah pendidikan
          </Button>
        }
      />

      <StageNotice>
        Urutan, tombol sembunyikan/tampilkan, dan form edit belum berfungsi. Item dengan status
        disembunyikan tidak akan tampil di area publik.
      </StageNotice>

      <ul className="space-y-4">
        {educations.map((education, index) => (
          <li key={education.id} className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Urutan {index + 1}
                </p>
                <h2 className="mt-2 text-base font-semibold">{education.institution}</h2>
                <p className="mt-1 text-sm text-accent">{education.program}</p>
                <p className="mt-1 text-xs text-muted">{education.period}</p>
                {education.summary ? (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {education.summary}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={education.isVisible ? 'accent' : 'warning'}>
                  {education.isVisible ? 'Tampil' : 'Disembunyikan'}
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
        {educations.length} entri · {educations.filter((item) => item.isVisible).length} tampil
      </p>
    </div>
  )
}
