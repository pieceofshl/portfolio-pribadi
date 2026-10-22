import { useMemo, useState } from 'react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { StageNotice } from '../../components/admin/StageNotice'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { SearchIcon } from '../../components/ui/icons'
import { getCategoryLabel, projects } from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminProjectsPage() {
  useDocumentTitle('Kelola Proyek')
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          normalizedQuery === '' ||
          `${project.title} ${project.slug} ${project.summary}`
            .toLowerCase()
            .includes(normalizedQuery),
      ),
    [normalizedQuery],
  )

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Kelola"
        title="Proyek"
        description="Daftar seluruh proyek, termasuk yang masih draft. CRUD dan unggah media dikerjakan pada Tahap 4–5."
        action={
          <Button disabled title="Form proyek baru aktif pada Tahap 4">
            + Proyek baru
          </Button>
        }
      />

      <StageNotice>
        Ini tampilan baca-saja dari data dummy. Tombol tambah, edit, dan hapus sengaja dinonaktifkan
        agar tidak terkesan ada penyimpanan data.
      </StageNotice>

      <div className="max-w-sm">
        <label
          htmlFor="cari-proyek-admin"
          className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
        >
          Cari di daftar (lokal)
        </label>
        <div className="relative">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
          />
          <input
            id="cari-proyek-admin"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Judul atau slug proyek…"
            className="w-full rounded-xl border border-hairline bg-ink-900/60 py-3 pl-11 pr-4 text-sm text-paper placeholder:text-muted/70 focus:border-accent/70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-ink-900/50">
          {filteredProjects.map((project) => (
            <li
              key={project.id}
              className="grid gap-3 p-4 sm:grid-cols-[1.6fr_1fr_auto] sm:items-center sm:p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{project.title}</p>
                <p className="mt-1 truncate font-mono text-[11px] text-muted">
                  /portofolio/{project.slug}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{getCategoryLabel(project.category)}</Badge>
                <Badge tone={project.status === 'published' ? 'accent' : 'warning'}>
                  {project.status === 'published' ? 'Terbit' : 'Draft'}
                </Badge>
                <span className="font-mono text-[10px] text-muted">{project.year}</span>
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
      ) : (
        <EmptyState
          title="Tidak ada proyek yang cocok"
          description="Ubah kata kunci pencarian untuk melihat proyek lain."
          action={
            <Button variant="secondary" size="sm" onClick={() => setQuery('')}>
              Hapus pencarian
            </Button>
          }
        />
      )}

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {filteredProjects.length} dari {projects.length} proyek ditampilkan
      </p>
    </div>
  )
}
