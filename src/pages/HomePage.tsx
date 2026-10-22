import { Link } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { buttonStyles } from '../components/ui/buttonStyles'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ArrowRight, ArrowUpRight } from '../components/ui/icons'
import {
  PROJECT_CATEGORIES,
  profile,
  publishedCertificates,
  publishedProjects,
  visibleExperiences,
  visibleSocialLinks,
} from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function HomePage() {
  useDocumentTitle('Beranda')
  const featuredProjects = publishedProjects.slice(0, 3)

  const stats = [
    { label: 'Proyek terbit', value: publishedProjects.length },
    { label: 'Sertifikat', value: publishedCertificates.length },
    { label: 'Pengalaman', value: visibleExperiences.length },
  ]

  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-40" />
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-52 -left-32 size-[26rem] rounded-full bg-lilac/10 blur-3xl"
        />

        <Container className="relative py-14 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ink-900/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {profile.availability}
              </p>

              <h1 className="mt-6 text-[2.15rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Merancang &amp; membangun{' '}
                <span className="text-accent">antarmuka</span> yang terasa hidup.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {profile.bio}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink to="/portofolio">
                  Lihat karya
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
                <ButtonLink to="/tentang" variant="secondary">
                  Tentang saya
                </ButtonLink>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-hairline pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-semibold text-paper">
                      {String(stat.value).padStart(2, '0')}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Kartu profil singkat */}
            <aside className="surface overflow-hidden p-1.5">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-hairline/70 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-6 sm:p-7">
                <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-40" />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="eyebrow">Profil singkat</span>
                  <ArrowUpRight aria-hidden="true" className="size-4 text-muted" />
                </div>

                <div className="relative mt-8 flex items-center gap-4">
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 font-display text-xl font-semibold text-accent">
                    {profile.initials}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold leading-tight">
                      {profile.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">{profile.headline}</p>
                  </div>
                </div>

                <dl className="relative mt-7 space-y-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
                    <dt className="text-muted">Lokasi</dt>
                    <dd className="text-right">{profile.location}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
                    <dt className="text-muted">Email</dt>
                    <dd className="text-right">
                      <a
                        href={`mailto:${profile.email}`}
                        className="break-all transition-colors hover:text-accent"
                      >
                        {profile.email}
                      </a>
                    </dd>
                  </div>
                </dl>

                <ul className="relative mt-7 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <li key={skill}>
                      <Badge>{skill}</Badge>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/tentang"
                  className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  Kenali saya lebih jauh
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* --------------------------- Proyek terbaru --------------------------- */}
      <section className="border-b border-hairline">
        <Container className="py-14 sm:py-20">
          <SectionHeading
            eyebrow="Karya terbaru"
            title="Proyek yang baru diterbitkan"
            description="Contoh tampilan kartu proyek berstatus terbit. Daftar lengkap dan pencarian ada di halaman portofolio."
            action={
              <Link
                to="/portofolio"
                className={buttonStyles({ variant: 'secondary', size: 'sm' })}
              >
                Semua proyek
                <ArrowRight className="size-4" />
              </Link>
            }
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------- Bidang kerja ---------------------------- */}
      <section className="border-b border-hairline bg-ink-900/30">
        <Container className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:gap-8">
          <p className="eyebrow shrink-0">Bidang kerja</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {PROJECT_CATEGORIES.map((category) => (
              <li key={category.id} className="text-sm text-muted">
                {category.label}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* -------------------------------- CTA -------------------------------- */}
      <section>
        <Container className="py-14 sm:py-20">
          <div className="surface relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
            <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-30" />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
            />
            <div className="relative">
              <p className="eyebrow">Kolaborasi</p>
              <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold tracking-tight sm:text-4xl">
                Punya ide yang ingin diwujudkan?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Terbuka untuk proyek desain antarmuka, pengembangan web, dan eksplorasi visual.
                Hubungi lewat email atau media sosial yang tertera.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink to="/kontak">
                  Mulai percakapan
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
                <a
                  href={`mailto:${profile.email}`}
                  className={buttonStyles({ variant: 'secondary' })}
                >
                  {profile.email}
                </a>
              </div>
              <p className="mt-8 text-xs text-muted">
                {visibleSocialLinks.length} tautan sosial aktif · {profile.location}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
