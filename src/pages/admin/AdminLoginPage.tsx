import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { TextField } from '../../components/ui/TextField'
import { ArrowLeft, LockIcon } from '../../components/ui/icons'
import { profile } from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

/**
 * Kerangka halaman login.
 * Sengaja TIDAK memvalidasi kredensial dan TIDAK membuat sesi palsu.
 * Supabase Auth dihubungkan pada Tahap 4.
 */
export function AdminLoginPage() {
  useDocumentTitle('Login Admin')

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <Container className="relative flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" />
            Kembali ke situs
          </Link>

          <div className="surface mt-6 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-accent font-display text-xs font-bold text-ink-950">
                {profile.initials}
              </span>
              <div>
                <p className="font-display text-sm font-semibold">Panel Admin</p>
                <p className="text-xs text-muted">{profile.name}</p>
              </div>
            </div>

            <h1 className="mt-7 text-2xl font-semibold tracking-tight">Masuk ke dashboard</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Hanya pemilik akun admin yang dapat mengelola konten. Tidak ada pendaftaran publik.
            </p>

            <form className="mt-7 space-y-4" aria-describedby="login-belum-aktif">
              <TextField
                id="admin-email"
                label="Email"
                type="email"
                autoComplete="username"
                placeholder="nama@email.com"
                disabled
              />
              <TextField
                id="admin-password"
                label="Kata sandi"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                disabled
              />

              <Button type="submit" className="w-full" disabled>
                <LockIcon className="size-4" />
                Masuk
              </Button>
            </form>

            <div
              id="login-belum-aktif"
              className="mt-6 rounded-2xl border border-lilac/25 bg-lilac/5 p-4 text-xs leading-relaxed text-muted"
            >
              Form ini sengaja dinonaktifkan. Autentikasi Supabase Auth, pesan error, dan
              pengalihan ke dashboard baru dibuat pada Tahap 4. Tidak ada sesi atau login palsu di
              Tahap 1.
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Area admin nantinya tidak dapat diakses tanpa login.
          </p>
        </div>
      </Container>
    </div>
  )
}
