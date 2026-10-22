import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { ArrowRight } from '../components/ui/icons'
import { visibleEducations, visibleExperiences } from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ExperiencePage() {
  useDocumentTitle('Pengalaman')

  return (
    <>
      <PageHeader
        eyebrow="Pengalaman"
        title="Perjalanan kerja & kolaborasi"
        description="Urutan ditampilkan sesuai pengaturan admin. Entri yang disembunyikan tidak muncul di halaman ini."
      />

      <Container className="py-12 sm:py-16">
        {visibleExperiences.length > 0 ? (
          <ol className="space-y-4">
            {visibleExperiences.map((experience, index) => (
              <li
                key={experience.id}
                className="surface grid gap-4 p-6 sm:grid-cols-[160px_1fr] sm:gap-8 sm:p-8"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                    {experience.period}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-snug">{experience.role}</h2>
                  <p className="mt-1 text-sm text-muted">{experience.organization}</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper/80">
                    {experience.summary}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            title="Belum ada pengalaman ditampilkan"
            description="Entri pengalaman yang terlihat akan muncul di halaman ini."
            action={
              <ButtonLink to="/kontak" variant="secondary" size="sm">
                Hubungi pemilik
              </ButtonLink>
            }
          />
        )}

        <section className="mt-14 border-t border-hairline pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Latar pendidikan</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Riwayat pendidikan</h2>
            </div>
            <Link
              to="/tentang"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              Selengkapnya di halaman tentang
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {visibleEducations.map((education) => (
              <li key={education.id} className="surface p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {education.period}
                </span>
                <h3 className="mt-2 text-base font-semibold">{education.institution}</h3>
                <p className="mt-1 text-sm text-accent">{education.program}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  )
}
