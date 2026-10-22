import { SocialLinks } from '../components/SocialLinks'
import { buttonStyles } from '../components/ui/buttonStyles'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { MailIcon } from '../components/ui/icons'
import { profile, visibleSocialLinks } from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ContactPage() {
  useDocumentTitle('Kontak')

  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Mari terhubung"
        description="Untuk kolaborasi, pertanyaan, atau sekadar berbagi ide, silakan hubungi lewat email atau salah satu kanal di bawah ini."
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section aria-labelledby="kontak-email" className="surface p-6 sm:p-8">
            <h2 id="kontak-email" className="eyebrow">
              Email
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 block break-all font-display text-2xl font-semibold tracking-tight transition-colors hover:text-accent sm:text-3xl"
            >
              {profile.email}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Tautan ini membuka aplikasi email Anda dengan alamat tujuan yang sudah terisi.
            </p>
            <div className="mt-7">
              <a href={`mailto:${profile.email}`} className={buttonStyles()}>
                <MailIcon className="size-4" />
                Kirim email
              </a>
            </div>

            <dl className="mt-8 space-y-3 border-t border-hairline pt-5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">Lokasi</dt>
                <dd className="text-right">{profile.location}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">Status</dt>
                <dd className="text-right text-accent">{profile.availability}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="kontak-sosial" className="surface p-6 sm:p-8">
            <h2 id="kontak-sosial" className="eyebrow">
              Media sosial
            </h2>
            <SocialLinks links={visibleSocialLinks} className="mt-2" />
            <p className="mt-5 text-xs text-muted">
              Semua tautan membuka tab baru. Tautan yang disembunyikan admin tidak ditampilkan.
            </p>
          </section>
        </div>

        <p className="mt-6 rounded-2xl border border-hairline bg-ink-900/40 p-5 text-xs leading-relaxed text-muted">
          Sesuai keputusan A-06 pada PRD, halaman kontak belum menyediakan formulir pesan. Data
          pengunjung tidak dikumpulkan pada MVP. Formulir hanya akan ditambahkan jika Anda
          menyetujui perubahan cakupan.
        </p>
      </Container>
    </>
  )
}
