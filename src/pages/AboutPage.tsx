import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { buttonStyles } from '../components/ui/buttonStyles'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ArrowRight, ArrowUpRight } from '../components/ui/icons'
import { profile, visibleEducations, visibleExperiences } from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AboutPage() {
  useDocumentTitle('Tentang Saya')

  return (
    <>
      <PageHeader
        eyebrow="Tentang saya"
        title={`${profile.name} — ${profile.headline}`}
        description={profile.bio}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/portofolio" className={buttonStyles()}>
            Lihat karya
            <ArrowUpRight className="size-4" />
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className={buttonStyles({ variant: 'secondary' })}
          >
            Kirim email
          </a>
        </div>
      </PageHeader>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Kolom kiri: foto placeholder + info singkat */}
          <div className="space-y-6">
            <div className="surface overflow-hidden p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-lilac/25 via-ink-800 to-ink-950">
                <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-50" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-7xl font-medium tracking-tighter text-paper/20">
                    {profile.initials}
                  </span>
                </div>
                <span className="absolute bottom-4 left-4 rounded-full border border-hairline bg-ink-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted backdrop-blur">
                  Foto profil (placeholder)
                </span>
              </div>
            </div>

            <dl className="surface divide-y divide-hairline p-6 text-sm">
              <div className="flex items-baseline justify-between gap-4 pb-3">
                <dt className="text-muted">Lokasi</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-muted">Email publik</dt>
                <dd className="text-right">
                  <a href={`mailto:${profile.email}`} className="hover:text-accent">
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <dt className="text-muted">Status</dt>
                <dd className="text-right text-accent">{profile.availability}</dd>
              </div>
            </dl>
          </div>

          {/* Kolom kanan: bio, keahlian, pendidikan, pengalaman */}
          <div className="space-y-14">
            <section aria-labelledby="keahlian">
              <h2 id="keahlian" className="eyebrow">
                Keahlian
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <li key={skill}>
                    <Badge tone="accent">{skill}</Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Daftar ini hanya contoh. Nanti diisi dari data profil di database.
              </p>
            </section>

            <section aria-labelledby="pendidikan">
              <SectionHeading
                eyebrow="Pendidikan"
                title="Riwayat pendidikan"
                description="Hanya entri yang ditandai tampil oleh admin yang muncul di sini."
              />
              <ol className="mt-8 space-y-4">
                {visibleEducations.map((education) => (
                  <li key={education.id} className="surface p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold">{education.institution}</h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                        {education.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-accent">{education.program}</p>
                    {education.summary ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted">{education.summary}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="pengalaman-singkat">
              <SectionHeading
                eyebrow="Pengalaman"
                title="Yang sedang dan pernah saya kerjakan"
                action={
                  <Link
                    to="/pengalaman"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                  >
                    Semua pengalaman
                    <ArrowRight className="size-4" />
                  </Link>
                }
              />
              <ul className="mt-8 space-y-4">
                {visibleExperiences.slice(0, 2).map((experience) => (
                  <li key={experience.id} className="surface p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold">{experience.role}</h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                        {experience.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-accent">{experience.organization}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{experience.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </Container>
    </>
  )
}
