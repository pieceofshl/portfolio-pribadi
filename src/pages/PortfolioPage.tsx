import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchIcon } from '../components/ui/icons'
import {
  PROJECT_CATEGORIES,
  publishedProjects,
  type ProjectCategoryId,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'

type CategoryFilter = ProjectCategoryId | 'semua'

/**
 * Filter & pencarian masih berjalan di memori memakai data dummy.
 * Pada Tahap 3 filter yang sama akan memakai data proyek terbit dari Supabase.
 */
export function PortfolioPage() {
  useDocumentTitle('Portofolio')
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('semua')

  const normalizedQuery = query.trim().toLowerCase()
  const isFiltering = normalizedQuery !== '' || activeCategory !== 'semua'

  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      const matchesCategory =
        activeCategory === 'semua' || project.category === activeCategory
      const searchTarget = [project.title, project.summary, ...project.description]
        .join(' ')
        .toLowerCase()
      const matchesQuery =
        normalizedQuery === '' || searchTarget.includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, normalizedQuery])

  function resetFilters() {
    setQuery('')
    setActiveCategory('semua')
  }

  return (
    <>
      <PageHeader
        eyebrow="Portofolio"
        title="Karya yang sudah diterbitkan"
        description="Telusuri proyek berdasarkan kategori atau kata kunci. Hanya proyek berstatus terbit yang ditampilkan."
      />

      <Container className="py-12 sm:py-16">
        {/* Filter & pencarian */}
        <div className="space-y-6">
          <div className="max-w-md">
            <label
              htmlFor="pencarian-proyek"
              className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
            >
              Cari proyek
            </label>
            <div className="relative">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />
              <input
                id="pencarian-proyek"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul atau ringkasan…"
                className="w-full rounded-xl border border-hairline bg-ink-900/60 py-3 pl-11 pr-4 text-sm text-paper placeholder:text-muted/70 focus:border-accent/70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Kategori
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('semua')}
                aria-pressed={activeCategory === 'semua'}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
                  activeCategory === 'semua'
                    ? 'border-accent bg-accent text-ink-950'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-paper',
                )}
              >
                Semua
              </button>
              {PROJECT_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={activeCategory === category.id}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
                    activeCategory === category.id
                      ? 'border-accent bg-accent text-ink-950'
                      : 'border-hairline text-muted hover:border-accent/50 hover:text-paper',
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
            <p aria-live="polite" className="text-sm text-muted">
              Menampilkan <span className="text-paper">{filteredProjects.length}</span> dari{' '}
              {publishedProjects.length} proyek terbit
            </p>
            {isFiltering ? (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Hapus filter
              </Button>
            ) : null}
          </div>
        </div>

        {/* Hasil */}
        <div className="mt-8">
          {/* Heading level 2 menjaga urutan h1 → h2 → h3 tanpa mengubah tampilan. */}
          <h2 className="sr-only">Daftar proyek</h2>
          {filteredProjects.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Tidak ada proyek yang cocok"
              description="Coba kata kunci lain atau pilih kategori yang berbeda untuk melihat karya lainnya."
              action={
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Hapus filter & kata kunci
                </Button>
              }
            />
          )}
        </div>
      </Container>
    </>
  )
}
