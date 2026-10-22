import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type NotFoundPageProps = {
  title?: string
  description?: string
}

export function NotFoundPage({
  title = 'Halaman tidak ditemukan',
  description = 'Alamat yang Anda buka tidak tersedia. Mungkin tautannya salah ketik atau halaman sudah dipindahkan.',
}: NotFoundPageProps) {
  useDocumentTitle(title)

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <Container className="relative flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Error 404</p>
        <p aria-hidden="true" className="mt-5 font-display text-7xl font-medium tracking-tighter text-paper/20 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/">Kembali ke beranda</ButtonLink>
          <ButtonLink to="/portofolio" variant="secondary">
            Lihat portofolio
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
