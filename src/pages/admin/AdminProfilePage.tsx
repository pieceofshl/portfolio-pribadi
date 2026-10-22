import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { StageNotice } from '../../components/admin/StageNotice'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { profile } from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminProfilePage() {
  useDocumentTitle('Profil Admin')

  const fields = [
    { label: 'Nama tampilan', value: profile.name },
    { label: 'Headline', value: profile.headline },
    { label: 'Bio singkat', value: profile.bio },
    { label: 'Email publik', value: profile.email },
    { label: 'Lokasi', value: profile.location },
    { label: 'Status ketersediaan', value: profile.availability },
    { label: 'Foto profil', value: 'Belum ada berkas (placeholder inisial)' },
  ]

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Kelola"
        title="Profil"
        description="Data profil yang tampil di beranda, halaman tentang, kontak, dan footer."
        action={
          <Button disabled title="Form edit profil aktif pada Tahap 4">
            Ubah profil
          </Button>
        }
      />

      <StageNotice>
        Halaman ini hanya menampilkan isi data dummy. Form edit, validasi email/URL, dan
        penyimpanan akan dibuat pada Tahap 4.
      </StageNotice>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <section aria-labelledby="data-profil" className="surface p-6">
          <h2 id="data-profil" className="text-lg font-semibold">
            Data profil
          </h2>
          <dl className="mt-5 divide-y divide-hairline text-sm">
            {fields.map((field) => (
              <div
                key={field.label}
                className="grid gap-1 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-6"
              >
                <dt className="text-muted">{field.label}</dt>
                <dd className="break-words text-paper/90">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="space-y-5">
          <section aria-labelledby="pratinjau-profil" className="surface p-6">
            <h2 id="pratinjau-profil" className="eyebrow">
              Pratinjau
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10 font-display text-lg font-semibold text-accent">
                {profile.initials}
              </span>
              <div>
                <p className="font-display font-semibold">{profile.name}</p>
                <p className="text-xs text-muted">{profile.headline}</p>
              </div>
            </div>
            <div className="mt-5">
              <Badge tone="accent">{profile.availability}</Badge>
            </div>
          </section>

          <section aria-labelledby="keahlian-profil" className="surface p-6">
            <h2 id="keahlian-profil" className="eyebrow">
              Keahlian
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <li key={skill}>
                  <Badge>{skill}</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Daftar keahlian belum punya tabel sendiri di PRD; pada tahap integrasi perlu keputusan
              apakah tetap statis atau disimpan bersama profil.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
