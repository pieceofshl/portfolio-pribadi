import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { publicNavItems } from '../../config/navigation'
import { profile } from '../../data/mockData'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { CloseIcon, MenuIcon } from '../ui/icons'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-full px-3.5 py-2 text-sm transition-colors',
    isActive
      ? 'bg-ink-800 text-paper'
      : 'text-muted hover:bg-ink-900 hover:text-paper',
  )
}

export function Navbar() {
  const location = useLocation()
  // Menu dianggap terbuka hanya untuk path saat ini, sehingga otomatis
  // tertutup ketika pengguna berpindah halaman (tanpa effect tambahan).
  const [openOnPath, setOpenOnPath] = useState<string | null>(null)
  const isOpen = openOnPath === location.pathname

  return (
    <header className="sticky top-0 z-50 border-b border-hairline/80 bg-ink-950/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link to="/" className="flex items-center gap-3" aria-label="Beranda portofolio">
          <span className="grid size-9 place-items-center rounded-full bg-accent font-display text-xs font-bold text-ink-950">
            {profile.initials}
          </span>
          <span className="font-display text-sm font-semibold tracking-tight sm:text-base">
            {profile.name}
            <span className="text-accent">.</span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {publicNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={navLinkClass}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink to="/kontak" size="sm" className="hidden sm:inline-flex">
            Ayo bicara
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpenOnPath(isOpen ? null : location.pathname)}
            aria-expanded={isOpen}
            aria-controls="menu-ponsel"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            className="grid size-10 place-items-center rounded-full border border-hairline text-paper hover:border-accent/60 hover:text-accent lg:hidden"
          >
            {isOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <div id="menu-ponsel" className="border-t border-hairline bg-ink-950 lg:hidden">
          <Container className="py-4">
            <nav aria-label="Navigasi utama (ponsel)">
              <ul className="flex flex-col">
                {publicNavItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setOpenOnPath(null)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between rounded-xl px-3 py-3 text-sm',
                          isActive
                            ? 'bg-ink-800 text-accent'
                            : 'text-muted hover:bg-ink-900 hover:text-paper',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <ButtonLink
              to="/kontak"
              className="mt-4 w-full"
              onClick={() => setOpenOnPath(null)}
            >
              Ayo bicara
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
