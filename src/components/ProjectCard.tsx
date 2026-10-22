import { Link } from 'react-router-dom'
import { getCategoryLabel, type Project } from '../data/mockData'
import { cn } from '../lib/cn'
import { projectCoverGradients } from '../lib/projectCover'
import { Badge } from './ui/Badge'
import { ArrowUpRight } from './ui/icons'

type ProjectCardProps = {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <Link
      to={`/portofolio/${project.slug}`}
      className="group block rounded-3xl border border-hairline bg-ink-900/50 p-3 transition-colors hover:border-accent/50"
    >
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br',
          projectCoverGradients[project.category],
        )}
      >
        <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-70" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950/80 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-display text-6xl font-medium tracking-tighter text-paper/10 transition-transform duration-500 group-hover:scale-105 sm:text-7xl"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="absolute left-4 top-4">
          <Badge>{getCategoryLabel(project.category)}</Badge>
        </div>

        <span className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70">
          {project.year}
        </span>
        <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full border border-paper/15 bg-ink-950/60 text-paper transition-all duration-300 group-hover:border-accent/70 group-hover:text-accent">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="px-2 pb-2 pt-5">
        <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.summary}</p>
      </div>
    </Link>
  )
}
