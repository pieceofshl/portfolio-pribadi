import { Link } from 'react-router-dom'
import { publicNavItems } from '../../config/navigation'
import { profile, visibleSocialLinks } from '../../data/mockData'
import { Container } from '../ui/Container'
import { ArrowUpRight } from '../ui/icons'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-ink-900/30">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-accent font-display text-xs font-bold text-ink-950">
              {profile.initials}
            </span>
            <span className="font-display text-sm font-semibold">{profile.name}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted">{profile.headline}</p>
          <p className="mt-4 text-sm text-muted">{profile.location}</p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Halaman</h2>
          <ul className="mt-4 space-y-2.5">
            {publicNavItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-paper/80 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Terhubung
          </h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-sm text-paper/80 transition-colors hover:text-accent"
              >
                {profile.email}
                <ArrowUpRight className="size-3.5" />
              </a>
            </li>
            {visibleSocialLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-paper/80 transition-colors hover:text-accent"
                >
                  {link.platform}
                  <ArrowUpRight className="size-3.5" />
                  <span className="sr-only">(buka di tab baru)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-hairline/70">
        <Container className="flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {CURRENT_YEAR} {profile.name}. Dibuat dengan React, Vite, dan Tailwind CSS.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
            Tahap 1 · Data dummy, belum terhubung ke database
          </p>
        </Container>
      </div>
    </footer>
  )
}
