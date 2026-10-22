import { Link, useParams } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { Badge } from '../components/ui/Badge'
import { buttonStyles } from '../components/ui/buttonStyles'
import { Container } from '../components/ui/Container'
import { ArrowLeft, ArrowUpRight, InfoIcon } from '../components/ui/icons'
import {
  getCategoryLabel,
  getPublishedProjectBySlug,
  publishedProjects,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../lib/cn'
import { projectCoverGradients } from '../lib/projectCover'
import { NotFoundPage } from './NotFoundPage'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getPublishedProjectBySlug(slug) : undefined

  useDocumentTitle(project ? project.title : 'Proyek tidak ditemukan')

  if (!project) {
    return (
      <NotFoundPage
        title="Proyek tidak ditemukan"
        description="Proyek ini belum diterbitkan, sudah dihapus, atau alamatnya salah. Kembali ke daftar portofolio untuk melihat karya lain."
      />
    )
  }

  const relatedProjects = publishedProjects
    .filter((item) => item.id !== project.id)
    .slice(0, 2)

  const externalLinks = [
    project.demoUrl ? { label: 'Lihat demo', href: project.demoUrl } : null,
    project.repoUrl ? { label: 'Repositori', href: project.repoUrl } : null,
    project.videoUrl ? { label: 'Tonton video', href: project.videoUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null)

  return (
    <>
      <article>
        <header className="relative overflow-hidden border-b border-hairline bg-ink-900/30">
          <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-40" />
          <Container className="relative py-10 sm:py-14">
            <Link
              to="/portofolio"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" />
              Semua proyek
            </Link>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Badge tone="accent">{getCategoryLabel(project.category)}</Badge>
              <Badge>{project.year}</Badge>
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {project.summary}
            </p>
          </Container>
        </header>

        <Container className="py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_0.85fr] lg:gap-14">
            <div>
              {/* Sampul proyek (CSS-only, pengganti gambar sementara) */}
              <div
                className={cn(
                  'relative aspect-[16/10] overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br',
                  projectCoverGradients[project.category],
                )}
                role="img"
                aria-label={`Sampul proyek ${project.title}`}
              >
                <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-60" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center font-display text-[5rem] font-medium tracking-tighter text-paper/15 sm:text-[7rem]"
                >
                  {project.year}
                </span>
                <span className="absolute left-5 top-5">
                  <Badge tone="neutral">Sampul placeholder</Badge>
                </span>
              </div>

              <div className="mt-10 space-y-5 text-sm leading-relaxed text-paper/85 sm:text-base">
                {project.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="surface p-6">
                <h2 className="eyebrow">Tautan proyek</h2>
                {externalLinks.length > 0 ? (
                  <div className="mt-4 flex flex-col gap-2">
                    {externalLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonStyles({ variant: 'secondary' })}
                      >
                        {link.label}
                        <ArrowUpRight className="size-4" />
                        <span className="sr-only">(buka di tab baru)</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    Belum ada tautan demo, repositori, atau video untuk proyek ini.
                  </p>
                )}
              </div>

              <div className="surface p-6">
                <h2 className="eyebrow">Detail</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted">Kategori</dt>
                    <dd className="text-right">{getCategoryLabel(project.category)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
                    <dt className="text-muted">Tahun</dt>
                    <dd>{project.year}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
                    <dt className="text-muted">Slug</dt>
                    <dd className="break-all font-mono text-xs text-muted">/{project.slug}</dd>
                  </div>
                </dl>
              </div>

              <p className="flex gap-2 rounded-2xl border border-hairline bg-ink-900/40 p-4 text-xs leading-relaxed text-muted">
                <InfoIcon className="mt-0.5 size-4 shrink-0" />
                Tautan eksternal pada halaman ini masih contoh. Media asli ditambahkan pada tahap
                upload.
              </p>
            </aside>
          </div>

          {relatedProjects.length > 0 ? (
            <section className="mt-16 border-t border-hairline pt-12">
              <h2 className="eyebrow">Proyek lain</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {relatedProjects.map((item, index) => (
                  <ProjectCard key={item.id} project={item} index={index + 1} />
                ))}
              </div>
            </section>
          ) : null}
        </Container>
      </article>
    </>
  )
}
