import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ArrowUpRight } from '../components/ui/icons'
import { adminNavItems } from '../config/navigation'
import { profile } from '../data/mockData'
import { cn } from '../lib/cn'

function adminLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'flex items-center rounded-xl px-3 py-2.5 text-sm transition-colors',
    isActive
      ? 'bg-accent/10 text-accent'
      : 'text-muted hover:bg-ink-800 hover:text-paper',
  )
}

function AdminNav({ variant }: { variant: 'sidebar' | 'mobile' }) {
  return (
    <nav aria-label={variant === 'sidebar' ? 'Navigasi admin' : 'Navigasi admin (ponsel)'}>
      <ul
        className={cn(
          variant === 'sidebar'
            ? 'space-y-1'
            : 'flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]',
        )}
      >
        {adminNavItems.map((item) => (
          <li key={item.to} className={variant === 'mobile' ? 'shrink-0' : undefined}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(adminLinkClass({ isActive }), variant === 'mobile' && 'whitespace-nowrap')
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Kerangka area admin. BELUM ada proteksi login/route guard — itu Tahap 4.
 * Jangan mengisi halaman admin dengan data sensitif nyata sebelum proteksi aktif.
 */
export function AdminLayout() {
  const location = useLocation()
  const currentPage =
    adminNavItems.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
    )?.label ?? 'Admin'

  return (
    <div className="min-h-screen bg-ink-950 lg:grid lg:grid-cols-[264px_1fr]">
      <a
        href="#konten-admin"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Lewati ke konten admin
      </a>

      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-hairline bg-ink-900/40 p-5 lg:flex">
        <Link to="/admin" className="flex items-center gap-3 px-2 py-2">
          <span className="grid size-9 place-items-center rounded-full bg-accent font-display text-xs font-bold text-ink-950">
            {profile.initials}
          </span>
          <span className="font-display text-sm font-semibold">
            Panel Admin<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="mt-6">
          <AdminNav variant="sidebar" />
        </div>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-lilac/25 bg-lilac/5 p-4 text-[11px] leading-relaxed text-muted">
            Kerangka Tahap 1. Login, proteksi route, dan CRUD menyusul pada Tahap 4.
          </div>
          <Link
            to="/"
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-ink-800 hover:text-paper"
          >
            Lihat situs publik
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Bar atas */}
        <header className="sticky top-0 z-40 border-b border-hairline bg-ink-950/90 backdrop-blur-md">
          <div className="px-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm font-medium lg:hidden"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-accent font-display text-[10px] font-bold text-ink-950">
                    {profile.initials}
                  </span>
                  Admin
                </Link>
                <div className="hidden lg:block">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    Panel admin
                  </p>
                  <p className="text-sm font-medium">{currentPage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="lilac">Tahap 1 · Kerangka</Badge>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-accent"
                >
                  Situs publik
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Navigasi ponsel/tablet */}
            <div className="pb-3 lg:hidden">
              <AdminNav variant="mobile" />
            </div>
          </div>
        </header>

        <main id="konten-admin" tabIndex={-1} className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>

        <footer className="border-t border-hairline px-5 py-5 sm:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Data dummy · belum ada autentikasi · belum terhubung Supabase
          </p>
        </footer>
      </div>
    </div>
  )
}
