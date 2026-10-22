/** Daftar menu publik. Urutan mengikuti sitemap PRD bagian 6.1. */
export const publicNavItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang', to: '/tentang' },
  { label: 'Portofolio', to: '/portofolio' },
  { label: 'Sertifikat', to: '/sertifikat' },
  { label: 'Pengalaman', to: '/pengalaman' },
  { label: 'Kontak', to: '/kontak' },
] as const

/** Daftar menu admin. Struktur mengikuti sitemap PRD bagian 6.2. */
export const adminNavItems = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Proyek', to: '/admin/proyek', end: false },
  { label: 'Sertifikat', to: '/admin/sertifikat', end: false },
  { label: 'Profil', to: '/admin/profil', end: false },
  { label: 'Pendidikan', to: '/admin/pendidikan', end: false },
  { label: 'Pengalaman', to: '/admin/pengalaman', end: false },
  { label: 'Tautan Sosial', to: '/admin/sosial', end: false },
] as const
