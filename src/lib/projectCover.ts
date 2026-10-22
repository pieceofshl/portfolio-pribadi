import type { ProjectCategoryId } from '../data/mockData'

/**
 * Warna sampul proyek per kategori (CSS-only, tanpa file gambar).
 * Nanti diganti dengan gambar sampul dari media yang diunggah admin.
 */
export const projectCoverGradients: Record<ProjectCategoryId, string> = {
  coding: 'from-lime-300/25 via-emerald-500/10 to-ink-950',
  ilustrasi: 'from-rose-400/25 via-orange-300/10 to-ink-950',
  motion: 'from-lilac/30 via-fuchsia-500/10 to-ink-950',
  'desain-grafis': 'from-amber-300/25 via-orange-500/10 to-ink-950',
  fotografi: 'from-sky-400/25 via-blue-500/10 to-ink-950',
  videografi: 'from-violet-400/30 via-indigo-500/10 to-ink-950',
  lainnya: 'from-slate-300/20 via-slate-500/10 to-ink-950',
}
