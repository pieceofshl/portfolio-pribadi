import type { SocialLink } from '../data/mockData'
import { cn } from '../lib/cn'
import { ArrowUpRight } from './ui/icons'

type SocialLinksProps = {
  links: SocialLink[]
  className?: string
}

/** Tautan eksternal dengan atribut keamanan dan penanda tab baru. */
export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <ul className={cn('divide-y divide-hairline/70', className)}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 py-3.5"
          >
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm font-medium transition-colors group-hover:text-accent">
                {link.platform}
              </span>
              <span className="text-xs text-muted">{link.label}</span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
            <span className="sr-only">{link.platform} (buka di tab baru)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
