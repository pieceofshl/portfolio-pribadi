import { Link } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { StageNotice } from '../../components/admin/StageNotice'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { ArrowUpRight, FolderIcon } from '../../components/ui/icons'
import { adminNavItems } from '../../config/navigation'
import {
  certificates,
  experiences,
  projects,
  socialLinks,
  visibleEducations,
} from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminDashboardPage() {
  useDocumentTitle('Dashboard Admin')

  const draftProjects = projects.filter((project) => project.status === 'draft')
  const draftCertificates = certificates.filter(
    (certificate) => certificate.status === 'draft',
  )
  const hiddenExperiences = experiences.filter((experience) => !experience.isVisible)
  const hiddenSocialLinks = socialLinks.filter((link) => !link.isVisible)

  const stats = [
    { label: 'Total proyek', value: projects.length, hint: `${draftProjects.length} draft` },
    {
      label: 'Sertifikat',
      value: certificates.length,
      hint: `${draftCertificates.length} draft`,
    },
    {
      label: 'Pengalaman',
      value: experiences.length,
      hint: `${hiddenExperiences.length} disembunyikan`,
    },
    {
      label: 'Tautan sosial',
      value: socialLinks.length,
      hint: `${hiddenSocialLinks.length} disembunyikan`,
    },
  ]

  const manageItems = adminNavItems.filter((item) => item.to !== '/admin')

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Ringkasan konten"
        description="Semua angka di bawah berasal dari data dummy. Belum ada data yang tersimpan di database."
        action={<Badge tone="lilac">Data dummy</Badge>}
      />

      <StageNotice>
        Halaman admin masih kerangka visual. Belum ada login, proteksi route, penyimpanan, upload,
        atau CRUD. Komponen di bawah disiapkan agar mudah dihubungkan ke Supabase pada Tahap 4.
      </StageNotice>

      <section aria-labelledby="statistik-konten">
        <h2 id="statistik-konten" className="sr-only">
          Statistik konten
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="surface p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-3xl font-semibold">
                {String(stat.value).padStart(2, '0')}
              </dd>
              <dd className="mt-1 text-xs text-muted">{stat.hint}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section aria-labelledby="kelola-konten" className="surface p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 id="kelola-konten" className="text-lg font-semibold">
              Kelola konten
            </h2>
            <FolderIcon className="size-5 text-muted" />
          </div>
          <ul className="mt-5 divide-y divide-hairline">
            {manageItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="group flex items-center justify-between gap-4 py-3.5 text-sm transition-colors hover:text-accent"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="catatan-tahap" className="surface p-6">
          <h2 id="catatan-tahap" className="text-lg font-semibold">
            Yang belum ada di Tahap 1
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>Login &amp; logout Supabase Auth</li>
            <li>Proteksi route admin</li>
            <li>CRUD proyek &amp; sertifikat</li>
            <li>Upload gambar/PDF &amp; draft/published</li>
            <li>Penyimpanan data sungguhan</li>
          </ul>
          <p className="mt-5 rounded-xl border border-hairline bg-ink-950/50 p-3 text-xs leading-relaxed text-muted">
            Profil: {visibleEducations.length} pendidikan tampil · halaman publik masih memakai
            data dummy.
          </p>
        </section>
      </div>

      <section aria-labelledby="pratinjau-state">
        <h2 id="pratinjau-state" className="eyebrow">
          Pratinjau status antarmuka
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Komponen loading, kosong, dan error sudah disiapkan agar dipakai saat data diambil dari
          Supabase pada tahap berikutnya.
        </p>

        <details className="surface mt-4 p-5">
          <summary className="cursor-pointer text-sm font-medium">
            Tampilkan contoh loading, empty, dan error state
          </summary>
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Loading
              </p>
              <LoadingState count={2} />
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Empty
                </p>
                <EmptyState
                  title="Belum ada konten"
                  description="Contoh tampilan ketika daftar proyek masih kosong."
                  className="py-8"
                />
              </div>
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Error
                </p>
                <ErrorState
                  description="Contoh pesan ketika permintaan data gagal. Tidak menampilkan detail teknis ke pengguna."
                />
              </div>
            </div>
          </div>
        </details>
      </section>
    </div>
  )
}
