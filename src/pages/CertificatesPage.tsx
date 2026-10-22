import { CertificateCard } from '../components/CertificateCard'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { publishedCertificates } from '../data/mockData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function CertificatesPage() {
  useDocumentTitle('Sertifikat')

  return (
    <>
      <PageHeader
        eyebrow="Sertifikat"
        title="Bukti belajar & pelatihan"
        description="Kumpulan sertifikat yang sudah diterbitkan. Sertifikat berstatus draft tidak ditampilkan di halaman publik."
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {publishedCertificates.length} sertifikat terbit
        </p>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        {/* Heading level 2 menjaga urutan h1 → h2 → h3 tanpa mengubah tampilan. */}
        <h2 className="sr-only">Daftar sertifikat</h2>
        {publishedCertificates.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              {publishedCertificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
            <p className="mt-8 rounded-2xl border border-hairline bg-ink-900/40 p-5 text-xs leading-relaxed text-muted">
              Catatan Tahap 1: tautan kredensial dan nama berkas di atas masih data contoh. Unduhan
              PDF serta kredensial asli akan aktif setelah integrasi Supabase Storage.
            </p>
          </>
        ) : (
          <EmptyState
            title="Belum ada sertifikat terbit"
            description="Sertifikat yang sudah diterbitkan akan muncul di halaman ini."
            action={
              <ButtonLink to="/kontak" variant="secondary" size="sm">
                Hubungi pemilik
              </ButtonLink>
            }
          />
        )}
      </Container>
    </>
  )
}
