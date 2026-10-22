/**
 * ============================================================================
 * DATA DUMMY — HANYA UNTUK MEMBANGUN UI (TAHAP 1)
 * ============================================================================
 * Semua isi file ini adalah karangan/placeholder. Belum ada database.
 * Jangan menganggap data ini tersimpan. Pada Tahap 3 file ini diganti dengan
 * pembacaan data dari Supabase, lalu file ini dihapus.
 * ============================================================================
 */

export const MOCK_DATA_NOTICE =
  'Data dummy Tahap 1 — belum tersimpan di database.'

/* -------------------------------------------------------------------------- */
/* Kategori proyek (mengacu PRD 5.1)                                           */
/* -------------------------------------------------------------------------- */

export type ProjectCategoryId =
  | 'coding'
  | 'ilustrasi'
  | 'motion'
  | 'desain-grafis'
  | 'fotografi'
  | 'videografi'
  | 'lainnya'

export const PROJECT_CATEGORIES: ReadonlyArray<{
  id: ProjectCategoryId
  label: string
}> = [
  { id: 'coding', label: 'Coding / Pemrograman' },
  { id: 'ilustrasi', label: 'Ilustrasi' },
  { id: 'motion', label: 'Motion Graphics' },
  { id: 'desain-grafis', label: 'Desain Grafis' },
  { id: 'fotografi', label: 'Fotografi' },
  { id: 'videografi', label: 'Videografi' },
  { id: 'lainnya', label: 'Lainnya' },
]

export function getCategoryLabel(id: ProjectCategoryId): string {
  return PROJECT_CATEGORIES.find((category) => category.id === id)?.label ?? 'Lainnya'
}

/* -------------------------------------------------------------------------- */
/* Tipe data                                                                   */
/* -------------------------------------------------------------------------- */

export type ContentStatus = 'published' | 'draft'

export type Project = {
  id: string
  slug: string
  title: string
  category: ProjectCategoryId
  year: string
  summary: string
  description: string[]
  status: ContentStatus
  demoUrl?: string
  repoUrl?: string
  videoUrl?: string
}

export type Certificate = {
  id: string
  title: string
  issuer: string
  date: string
  status: ContentStatus
  credentialUrl?: string
  documentLabel?: string
}

export type Experience = {
  id: string
  organization: string
  role: string
  period: string
  summary: string
  isVisible: boolean
}

export type Education = {
  id: string
  institution: string
  program: string
  period: string
  summary?: string
  isVisible: boolean
}

export type SocialLink = {
  id: string
  platform: string
  label: string
  url: string
  isVisible: boolean
}

export type SiteProfile = {
  name: string
  initials: string
  headline: string
  bio: string
  location: string
  email: string
  availability: string
  skills: string[]
}

/* -------------------------------------------------------------------------- */
/* Profil                                                                      */
/* -------------------------------------------------------------------------- */

export const profile: SiteProfile = {
  name: 'Nama Pemilik',
  initials: 'NP',
  headline: 'Creative Developer & Visual Designer',
  bio: 'Saya menggabungkan pemrograman dan desain visual untuk membuat antarmuka yang jelas, cepat, dan punya karakter. Terbiasa bekerja dari riset kecil, sketsa, sampai implementasi di browser.',
  location: 'Jakarta, Indonesia',
  email: 'halo@contohpemilik.com',
  availability: 'Terbuka untuk kolaborasi & proyek lepas',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Desain Antarmuka', 'Motion', 'Fotografi'],
}

/* -------------------------------------------------------------------------- */
/* Proyek                                                                      */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    id: 'prj-01',
    slug: 'aplikasi-kalkulator-kalori',
    title: 'Kalkulator Kalori Harian',
    category: 'coding',
    year: '2026',
    summary:
      'Aplikasi web untuk memperkirakan kebutuhan kalori harian dengan input sederhana dan hasil yang mudah dibaca.',
    description: [
      'Kalkulator kalori ini dibuat untuk menjawab kebutuhan sehari-hari: menghitung perkiraan kebutuhan energi tanpa formulir yang membingungkan. Pengguna cukup mengisi data dasar, lalu melihat hasil beserta penjelasan singkat di bawahnya.',
      'Antarmuka disusun mobile-first agar nyaman dipakai dari ponsel. Semua perhitungan berjalan di browser sehingga tidak ada data pribadi yang dikirim ke server.',
    ],
    status: 'published',
    demoUrl: 'https://example.com/demo/kalkulator-kalori',
    repoUrl: 'https://github.com/contoh/kalkulator-kalori',
  },
  {
    id: 'prj-02',
    slug: 'identitas-visual-kopi-randu',
    title: 'Identitas Visual Kopi Randu',
    category: 'desain-grafis',
    year: '2025',
    summary:
      'Sistem identitas untuk kedai kopi lokal: logo, palet warna, tipografi, dan kemasan sederhana.',
    description: [
      'Proyek identitas visual ini berangkat dari satu ide: membawa suasana pagi di bawah pohon randu ke dalam kemasan kopi. Logo dibuat manual, lalu dirapikan menjadi bentuk vektor yang mudah dicetak pada ukuran kecil.',
      'Hasil akhir mencakup panduan warna, aturan tipografi, serta mockup kemasan dan menu. Semua aset diserahkan dalam format siap produksi.',
    ],
    status: 'published',
    demoUrl: 'https://example.com/karya/kopi-randu',
  },
  {
    id: 'prj-03',
    slug: 'papan-kolaborasi-kanvas',
    title: 'Papan Kolaborasi Kanvas',
    category: 'coding',
    year: '2025',
    summary:
      'Papan tulis digital untuk menuangkan ide bersama, lengkap dengan sticky note dan pengaturan papan.',
    description: [
      'Kanvas adalah ruang kolaborasi berbasis browser untuk sesi brainstorming jarak jauh. Saya mengerjakan bagian antarmuka papan, interaksi seret-lepas, dan pengaturan tata letak.',
      'Fokus utama proyek ini adalah performa: papan tetap responsif meski berisi ratusan catatan, dan semua aksi penting dapat dilakukan lewat keyboard.',
    ],
    status: 'published',
    repoUrl: 'https://github.com/contoh/kanvas',
  },
  {
    id: 'prj-04',
    slug: 'motion-reel-gerak-ritmis',
    title: 'Motion Reel — Gerak Ritmis',
    category: 'motion',
    year: '2024',
    summary:
      'Kompilasi animasi pendek yang mengeksplorasi ritme gerak, transisi bentuk, dan tipografi kinetik.',
    description: [
      'Reel ini adalah kumpulan eksperimen motion berdurasi pendek. Setiap potongan dibuat dari satu ide gerak sederhana, lalu dikembangkan dengan tempo yang berbeda.',
      'Video ditampilkan lewat tautan eksternal agar halaman tetap ringan, sesuai batasan MVP pada PRD.',
    ],
    status: 'published',
    videoUrl: 'https://example.com/video/motion-reel',
  },
  {
    id: 'prj-05',
    slug: 'seri-ilustrasi-hujan-pertama',
    title: 'Seri Ilustrasi: Hujan Pertama',
    category: 'ilustrasi',
    year: '2024',
    summary:
      'Enam ilustrasi digital bertema hujan pertama, dibuat dengan pendekatan warna yang hangat dan lembut.',
    description: [
      'Seri ini lahir dari kebiasaan mengamati jalan pulang saat hujan mulai turun. Setiap gambar memakai palet terbatas agar suasana antar-ilustrasi terasa menyatu.',
      'Karya dibuat sepenuhnya digital dengan kuas tekstur, lalu dicetak sebagai kartu pos edisi kecil.',
    ],
    status: 'published',
    demoUrl: 'https://example.com/karya/hujan-pertama',
  },
  {
    id: 'prj-06',
    slug: 'studi-visual-ruang-kota',
    title: 'Studi Visual: Ruang Kota',
    category: 'fotografi',
    year: '2024',
    summary:
      'Dokumentasi sudut kota pada jam-jam sepi, dengan fokus pada garis, bayangan, dan ruang kosong.',
    description: [
      'Studi visual ini mendokumentasikan ruang kota yang biasanya terlewat: sudut bangunan, bayangan pagi, dan bidang kosong di antara gedung.',
      'Semua foto diambil dengan lensa tetap dan diolah seminimal mungkin untuk menjaga warna asli suasana.',
    ],
    status: 'published',
  },
  {
    id: 'prj-07',
    slug: 'eksperimen-tipografi-ekspresif',
    title: 'Eksperimen Tipografi Ekspresif',
    category: 'lainnya',
    year: '2026',
    summary:
      'Draft eksperimen huruf ekspresif yang masih dalam proses penyusunan. Tidak ditampilkan ke publik.',
    description: [
      'Catatan kerja untuk eksperimen tipografi. Halaman ini sengaja berstatus draft agar daftar admin punya contoh konten yang belum diterbitkan.',
    ],
    status: 'draft',
  },
]

/* -------------------------------------------------------------------------- */
/* Sertifikat                                                                  */
/* -------------------------------------------------------------------------- */

export const certificates: Certificate[] = [
  {
    id: 'cert-01',
    title: 'Front-End Web Development',
    issuer: 'Lembaga Contoh Belajar',
    date: 'Maret 2026',
    status: 'published',
    documentLabel: 'Sertifikat.pdf',
    credentialUrl: 'https://example.com/sertifikat/front-end',
  },
  {
    id: 'cert-02',
    title: 'UI/UX Design Fundamental',
    issuer: 'Akademi Contoh Digital',
    date: 'November 2025',
    status: 'published',
    credentialUrl: 'https://example.com/sertifikat/ui-ux',
  },
  {
    id: 'cert-03',
    title: 'Motion Graphics untuk Sosial Media',
    issuer: 'Studio Contoh Kreasi',
    date: 'Juni 2025',
    status: 'published',
    documentLabel: 'sertifikat-motion.pdf',
  },
  {
    id: 'cert-04',
    title: 'Fotografi Dasar',
    issuer: 'Komunitas Contoh Foto',
    date: 'Februari 2025',
    status: 'draft',
  },
]

/* -------------------------------------------------------------------------- */
/* Pengalaman & pendidikan                                                     */
/* -------------------------------------------------------------------------- */

export const experiences: Experience[] = [
  {
    id: 'exp-01',
    organization: 'Studio Contoh Digital',
    role: 'Frontend Developer',
    period: '2024 — Sekarang',
    summary:
      'Membangun antarmuka aplikasi web bersama tim produk, mulai dari komponen dasbor sampai penyempurnaan aksesibilitas.',
    isVisible: true,
  },
  {
    id: 'exp-02',
    organization: 'Komunitas Contoh Kreatif',
    role: 'Desainer Visual (Lepas)',
    period: '2023 — 2024',
    summary:
      'Mengerjakan identitas acara, materi promosi, dan dokumentasi visual untuk kegiatan komunitas.',
    isVisible: true,
  },
  {
    id: 'exp-03',
    organization: 'Proyek Internal (Tidak Ditampilkan)',
    role: 'Kontributor Lepas',
    period: '2022 — 2023',
    summary:
      'Contoh entri yang disembunyikan admin. Tidak boleh muncul di halaman publik.',
    isVisible: false,
  },
]

export const educations: Education[] = [
  {
    id: 'edu-01',
    institution: 'Universitas Contoh',
    program: 'S1 Teknik Informatika',
    period: '2021 — 2025',
    summary: 'Fokus pada pengembangan web dan interaksi manusia-komputer.',
    isVisible: true,
  },
  {
    id: 'edu-02',
    institution: 'Sekolah Contoh Menengah',
    program: 'Jurusan Multimedia',
    period: '2018 — 2021',
    isVisible: true,
  },
]

/* -------------------------------------------------------------------------- */
/* Tautan sosial                                                               */
/* -------------------------------------------------------------------------- */

export const socialLinks: SocialLink[] = [
  {
    id: 'soc-01',
    platform: 'GitHub',
    label: '@contohpemilik',
    url: 'https://github.com/contoh',
    isVisible: true,
  },
  {
    id: 'soc-02',
    platform: 'LinkedIn',
    label: 'Nama Pemilik',
    url: 'https://www.linkedin.com/in/contoh',
    isVisible: true,
  },
  {
    id: 'soc-03',
    platform: 'Instagram',
    label: '@contoh.karya',
    url: 'https://www.instagram.com/contoh',
    isVisible: true,
  },
  {
    id: 'soc-04',
    platform: 'Behance',
    label: 'Portofolio visual',
    url: 'https://www.behance.net/contoh',
    isVisible: true,
  },
  {
    id: 'soc-05',
    platform: 'Dribbble',
    label: 'Tidak ditampilkan',
    url: 'https://dribbble.com/contoh',
    isVisible: false,
  },
]

/* -------------------------------------------------------------------------- */
/* Turunan data untuk halaman publik (hanya item yang boleh tampil)             */
/* -------------------------------------------------------------------------- */

export const publishedProjects = projects.filter((project) => project.status === 'published')
export const publishedCertificates = certificates.filter(
  (certificate) => certificate.status === 'published',
)
export const visibleExperiences = experiences.filter((experience) => experience.isVisible)
export const visibleEducations = educations.filter((education) => education.isVisible)
export const visibleSocialLinks = socialLinks.filter((link) => link.isVisible)

export function getPublishedProjectBySlug(slug: string): Project | undefined {
  return publishedProjects.find((project) => project.slug === slug)
}
