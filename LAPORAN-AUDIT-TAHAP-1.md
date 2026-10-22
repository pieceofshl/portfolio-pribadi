# Laporan Audit Kualitas & Potensi Bug — Website Portofolio (Tahap 1)

| Metadata | Nilai |
|---|---|
| Tanggal audit | 22 Oktober 2026 |
| Acuan produk | `PRD.md` versi 0.1 |
| Cakupan kode | 44 file TypeScript/TSX di `src/` (±3.251 baris) |
| Status proyek | Tahap 1 — Kerangka frontend, data dummy, tanpa Supabase |
| Jenis laporan | Audit baca-saja (tidak ada perbaikan kode) |
| Kesimpulan singkat | Fondasi tipe, routing, dan isolasi draft sehat. Tidak ada bug kritis pada kondisi sekarang. Satu risiko tinggi (area admin terbuka) wajib ditutup sebelum integrasi Supabase |

> **Ruang lingkup:** Supabase, login, CRUD, upload, dan RLS **tidak** dianggap sudah diterapkan, sesuai README dan kode. Temuan di bawah hanya menilai apa yang benar-benar ada di repository.

---

## 0. Metode, Perintah, dan Batasan

### 0.1 Pemeriksaan yang dijalankan (masing-masing sekali)

| Perintah | Hasil |
|---|---|
| `npm run lint` (oxlint) | 0 error / 0 warning, 45 file, 116 rule aktif |
| `npm run build` (`tsc -b && vite build`) | Sukses, exit 0, tanpa error TypeScript; 65 modul; JS 333,53 kB (97,64 kB gzip); CSS 48,56 kB (8,34 kB gzip) |
| Harness render in-memory | Vite SSR + `react-dom/server` tanpa menulis file: 9 halaman, 3 variasi detail proyek, 7 path pada tabel route `App.tsx` |
| `git status --porcelain` | Seluruh file aplikasi belum dilacak (lihat A-05) |
| `npx oxlint --rules` | Memastikan `exhaustive-deps` dan `jsx_a11y/alt-text` tersedia tetapi nonaktif |
| Uji render React untuk URL | `javascript:` diblokir React 19.3; `data:` dan URL domain asing tetap dirender |

### 0.2 Batasan audit

- Browser (Chrome) tidak tersedia di lingkungan audit, sehingga **tidak ada** uji visual 360/768/1280 px, uji pembaca layar, pengukuran kontras, uji Lighthouse, atau uji end-to-end.
- Semua temuan yang bergantung pada perilaku browser dikelompokkan di bagian **B** dan ditandai sebagai perlu pengujian.
- Harness SSR meniru `BrowserRouter` dengan stub `window`; hasilnya representatif untuk markup dan tabel route, tetapi bukan pengganti uji browser nyata.
- Laporan ini **tidak** mengklaim lengkap. Bug yang hanya muncul dengan data dinamis, interaksi nyata, atau jaringan lambat masih mungkin ada.
- Tidak ada file proyek yang diubah atau dihapus. `dist/` ditulis ulang oleh `npm run build` dan sudah masuk `.gitignore`.

### 0.3 Ringkasan prioritas

| Prioritas | A. Teramati | B. Perlu diuji |
|---|---|---|
| Kritis | 0 | 0 |
| Tinggi | 1 (A-03) | 0 |
| Sedang | 1 (A-01) | 6 (B-01, B-02, B-03, B-07, B-08, B-13) |
| Rendah | 3 (A-02, A-04, A-05) | 9 (B-04, B-05, B-06, B-09, B-10, B-11, B-12, B-14, B-15) |

**Tidak ada temuan berkategori kritis yang dapat direproduksi pada kondisi data dummy sekarang.**

---

## A. Bug yang berhasil direproduksi

### A-01 — Sedang — Dua section di `/tentang` menunjuk `aria-labelledby` yang tidak ada

- **File/lokasi:** `src/pages/AboutPage.tsx` baris 91 (`aria-labelledby="pendidikan"`) dan baris 115 (`aria-labelledby="pengalaman-singkat"`); `src/components/ui/SectionHeading.tsx` hanya merender `<h2>` tanpa `id`.
- **Gejala:** section Pendidikan dan Pengalaman tidak memiliki nama aksesibel. Pembaca layar mengumumkan region/section tanpa judul sehingga navigasi landmark tidak informatif.
- **Bukti:** hasil render `/tentang` → `dangling: ["pendidikan", "pengalaman-singkat"]`. `grep` menunjukkan satu-satunya `id` yang cocok adalah `id="keahlian"` (baris 76). Section lain (`ContactPage`, `AdminProfilePage`, `AdminDashboardPage`) tidak bermasalah.
- **Langkah reproduksi:**
  1. `npm run dev`, buka `/tentang`.
  2. Buka DevTools, cari `aria-labelledby`.
  3. Periksa nilai `pendidikan` dan `pengalaman-singkat` — tidak ada elemen dengan `id` tersebut.
  4. Alternatif: buka Accessibility pane; nama section kosong.
- **Rekomendasi:** tambahkan prop `headingId` pada `SectionHeading` (`<h2 id={headingId}>`) dan isi `headingId="pendidikan"` / `"pengalaman-singkat"`, atau ganti dengan `aria-label` yang eksplisit.

### A-02 — Rendah — Hierarki heading melompat h1 → h3 di `/portofolio` dan `/sertifikat`

- **File/lokasi:** `src/pages/PortfolioPage.tsx` (grid hasil, sekitar baris 133–139) memakai `ProjectCard` yang merender `<h3>` (`src/components/ProjectCard.tsx`); `src/pages/CertificatesPage.tsx` baris 26–31 memakai `CertificateCard` (`<h3>`, `src/components/CertificateCard.tsx`). Kedua halaman tidak punya `<h2>`.
- **Gejala:** struktur dokumen tidak logis (AC-NFR-02 "heading tersusun secara logis"); pengguna yang menavigasi per heading melewati satu level.
- **Bukti:** render `/portofolio` → `h1: Karya yang sudah diterbitkan`, lalu `h3: Kalkulator Kalori Harian`, dst. Render `/sertifikat` → `h1`, lalu `h3`.
- **Langkah reproduksi:**
  1. Buka `/portofolio` atau `/sertifikat`.
  2. Jalankan heading outline (ekstensi/DevTools) — urutan 1 → 3.
  3. Bandingkan dengan `/` dan `/pengalaman` yang benar (1 → 2 → 3).
- **Rekomendasi:** tambahkan heading tingkat 2 (terlihat atau `sr-only`) sebelum grid, atau ubah judul kartu menjadi `h2` bila halaman tidak punya heading bagian lain.

### A-03 — Tinggi (menjadi Kritis saat data nyata) — Seluruh area admin terbuka tanpa autentikasi

- **File/lokasi:** `src/App.tsx` baris 43–67 (route `/admin` tanpa guard); `src/layouts/AdminLayout.tsx` (komentar "BELUM ada proteksi login/route guard", sekitar baris 39–50); seluruh `src/pages/admin/*`.
- **Gejala:** siapa pun yang membuka `/admin`, `/admin/proyek`, `/admin/sertifikat`, `/admin/profil`, `/admin/pendidikan`, `/admin/pengalaman`, `/admin/sosial` langsung melihat dashboard dan **daftar konten draft** (judul/ringkasan proyek draft "Eksperimen Tipografi Ekspresif", sertifikat draft, entri pengalaman yang disembunyikan).
- **Bukti:** render `App` pada `/admin` menghasilkan dashboard lengkap + sidebar (`hasAdminNav: true`) tanpa redirect/login. `AdminDashboardPage` juga menampilkan jumlah draft. Ini **sesuai dokumentasi** README ("Admin (belum diproteksi)") — bukan regresi, tetapi tetap risiko yang harus ditutup sebelum Supabase.
- **Langkah reproduksi:**
  1. `npm run dev`.
  2. Buka `http://localhost:5173/admin/proyek` di jendela privat.
  3. Daftar 7 proyek termasuk 1 draft tampil tanpa diminta kredensial.
- **Rekomendasi:** buat `ProtectedRoute`/layout guard (cek sesi Supabase → redirect `/admin/login`). Jangan andalkan guard frontend: RLS tetap lapisan utama. Sebelum itu, pertimbangkan menyembunyikan konten draft di luar tampilan baca-saja.

### A-04 — Rendah — Area admin tidak punya skip link; `<main>` admin tanpa `id`

- **File/lokasi:** `src/layouts/AdminLayout.tsx` (elemen `<main className="flex-1 ...">`); bandingkan `src/layouts/PublicLayout.tsx` baris 7–20 yang punya "Lewati ke konten utama".
- **Gejala:** pengguna keyboard di area admin harus melewati sidebar + 7 menu + top bar setiap kali berpindah halaman (AC-NFR-02).
- **Bukti:** render `/admin` → `hasSkipLink: false`; render `/` → `true`. `AdminLoginPage` juga tidak punya landmark `<main>` maupun skip link.
- **Langkah reproduksi:**
  1. Buka `/admin`.
  2. Tekan Tab dari awal halaman — tidak ada tautan lewati.
- **Rekomendasi:** tambahkan skip link dan `<main id="konten-admin" tabIndex={-1}>`, plus landmark `<main>` pada halaman login.

### A-05 — Sedang (proses) — Source code belum masuk Git

- **File/lokasi:** seluruh repository (`git status --porcelain`).
- **Gejala:** tidak ada riwayat/rollback untuk pekerjaan Tahap 1. Jika integrasi Supabase merusak sesuatu, tidak ada titik kembali. Bertentangan dengan PRD 10.6 dan Tahap 0 ("repository bersih", source di GitHub).
- **Bukti:** repo memiliki 1 commit (dokumen), tetapi `git status` menampilkan `?? .gitignore`, `?? src/`, `?? package.json`, dst. — semua file aplikasi untracked.
- **Langkah reproduksi:**
  1. `git status --porcelain`
  2. `git log --stat`
- **Rekomendasi:** tinjau isi lalu commit fondasi Tahap 1 sebelum menyentuh Supabase (tanpa mengubah kode).

---

## B. Potensi bug yang perlu diuji

### B-01 — Sedang — Form login tanpa `onSubmit`; submit native akan memuat ulang SPA

- **File/lokasi:** `src/pages/admin/AdminLoginPage.tsx` baris 51 (`<form className="mt-7 space-y-4" aria-describedby="login-belum-aktif">`) dan baris 69 (`<Button type="submit" ... disabled>`).
- **Skenario:** saat field/tombol diaktifkan di Tahap 4, Enter atau klik "Masuk" memicu submit HTML default (method GET, action = URL saat ini) karena tidak ada `onSubmit`/`action`. Halaman SPA ter-reload, state hilang, dan tidak ada panggilan `signInWithPassword`. Catatan: input saat ini belum punya atribut `name`, jadi kredensial belum masuk query string; begitu `name` ditambahkan untuk Supabase, nilai bisa bocor ke URL/riwayat log.
- **Bukti:** tidak ada `onSubmit`, `action`, atau `method` di file; satu-satunya `type="submit"` ada di baris 69. Tombol `disabled` membuat ini belum dapat dipicu sekarang.
- **Langkah reproduksi (setelah tombol diaktifkan):**
  1. Hapus sementara `disabled` pada tombol.
  2. Isi form, tekan Enter.
  3. Amati navigasi/reload penuh dan URL berubah.
- **Rekomendasi:** handler `onSubmit` dengan `preventDefault()` + `supabase.auth.signInWithPassword`, `method="post"`, serta state error/loading eksplisit.

### B-02 — Sedang — "Kembali ke atas" saat pindah halaman bisa beranimasi, bukan langsung

- **File/lokasi:** `src/components/layout/ScrollToTop.tsx` baris 9 (`behavior: 'auto'`); `src/index.css` baris 20–23 (`html { scroll-behavior: smooth }`).
- **Skenario:** menurut CSSOM, `behavior: 'auto'` mengikuti nilai `scroll-behavior` CSS. Perpindahan route dari halaman panjang akan smooth-scroll ke atas; konten halaman baru sempat tampil di posisi scroll lama.
- **Bukti:** kombinasi dua file di atas; `prefers-reduced-motion` menimpa ke `auto` sehingga hanya terlihat pada pengguna normal.
- **Langkah reproduksi:**
  1. Buka `/pengalaman`, scroll ke bawah.
  2. Klik menu "Kontak" — amati animasi gulir (bukan potongan langsung).
  3. Ulangi dengan "Emulate prefers-reduced-motion" — hasilnya langsung.
- **Rekomendasi:** `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`, atau matikan `scroll-behavior` selama transisi.

### B-03 — Sedang — Kondisi "belum ada data" salah ditampilkan sebagai "tidak ada yang cocok"

- **File/lokasi:** `src/pages/PortfolioPage.tsx` baris 142–150; `src/pages/HomePage.tsx` (grid `featuredProjects`, sekitar baris 180–190); `src/pages/AboutPage.tsx` (daftar pendidikan/pengalaman).
- **Skenario:** saat Supabase mengembalikan 0 proyek terbit, `/portofolio` menampilkan "Tidak ada proyek yang cocok" dengan tombol "Hapus filter & kata kunci" yang tidak melakukan apa pun (karena tidak ada filter aktif, `isFiltering` false tetapi aksi tetap dirender). Beranda menampilkan heading "Proyek yang baru diterbitkan" dengan grid kosong tanpa pesan. AC-PUB-01/AC-PUB-03 meminta empty state informatif.
- **Bukti:** blok `filteredProjects.length > 0 ? ... : <EmptyState ... action={<Button ... onClick={resetFilters}>}>` tidak membedakan "data kosong" dari "hasil filter kosong"; `HomePage` memetakan array tanpa cabang kosong.
- **Langkah reproduksi:**
  1. Sementara set `publishedProjects` menjadi `[]` di `mockData` (jangan di-commit).
  2. Buka `/` dan `/portofolio`; amati pesan yang menyesatkan dan tombol tanpa efek.
- **Rekomendasi:** dua empty state terpisah; sembunyikan tombol reset bila `!isFiltering`.

### B-04 — Rendah — Menu ponsel tidak bisa ditutup dengan Escape/klik luar dan bisa "terbuka sendiri"

- **File/lokasi:** `src/components/layout/Navbar.tsx` baris 21–25 dan 61–73.
- **Skenario:** (1) Menu dibuka, tekan Escape → tidak menutup. (2) State `openOnPath` bertahan lintas breakpoint: buka menu di 360 px, perbesar ke 1280 px, perkecil lagi → menu muncul terbuka walau pengguna tidak membukanya. `aria-expanded`/`aria-controls`/`aria-label` sudah benar; hanya manajemen state/dismissal yang kurang.
- **Bukti:** satu `onClick` toggle; tidak ada listener `keydown`/`pointerdown`; `isOpen = openOnPath === location.pathname` tidak direset saat viewport berubah.
- **Langkah reproduksi:**
  1. Buka menu → tekan Escape (tidak menutup).
  2. Buka menu → ubah lebar viewport 360 → 1280 → 360.
- **Rekomendasi:** tutup pada Escape, klik di luar, dan perubahan breakpoint (`matchMedia('(min-width:1024px)')`).

### B-05 — Rendah — Kontras placeholder dan teks 10 px perlu diukur

- **File/lokasi:** input pencarian `src/pages/PortfolioPage.tsx` dan `src/pages/admin/AdminProjectsPage.tsx` (`placeholder:text-muted/70`), `src/components/layout/Footer.tsx` (`text-muted/80`, 10 px), `src/components/ui/Badge.tsx` (10 px uppercase).
- **Skenario:** `text-muted` (#9c9ca8) dengan opasitas 70% di atas latar gelap diperkirakan ±4,3:1 — di bawah 4,5:1 untuk teks normal. Ini **estimasi**, belum diukur dengan alat.
- **Bukti:** kelas utilitas di atas; tidak ada uji kontras otomatis (`jsx_a11y` tidak aktif — lihat D-09).
- **Langkah reproduksi:**
  1. Buka halaman portofolio di 360 px.
  2. Ukur placeholder dan label footer dengan DevTools contrast checker atau axe.
- **Rekomendasi:** naikkan placeholder ke `text-muted` penuh atau warna khusus ≥4,5:1; verifikasi semua teks kecil.

### B-06 — Rendah — Potensi scroll horizontal dengan teks panjang di 360 px

- **File/lokasi:** `src/pages/AboutPage.tsx` (email di `<dd>` tanpa `break-all`/`min-w-0`), `src/pages/admin/AdminCertificatesPage.tsx` (grid `sm:grid-cols-[1.6fr_1fr_auto]`, sel pertama tanpa `min-w-0`), `src/pages/ExperiencePage.tsx` (kolom ringkasan tanpa `min-w-0`).
- **Skenario:** email/URL/judul sertifikat panjang tanpa spasi mendorong track grid melebihi viewport → halaman bergeser horizontal (AC-NFR-01). Grid item default `min-width: auto` sehingga tidak menyusut.
- **Bukti:** `ProjectCard`/`ProjectDetailPage` sudah memakai `break-all`/`min-w-0`, menunjukkan pola yang benar sudah dikenal; tiga lokasi di atas belum.
- **Langkah reproduksi:**
  1. Isi sementara email `nama.pemilik.portofolio.yang.sangat.panjang@contoh-domain-panjang.com`.
  2. Buka 360 px, cek `document.documentElement.scrollWidth > window.innerWidth`.
- **Rekomendasi:** `min-w-0` pada sel grid dan `break-all`/`break-words` untuk email/URL.

### B-07 — Sedang — Tidak ada error boundary dan tidak ada validasi data saat runtime

- **File/lokasi:** `src/App.tsx` (tidak ada `errorElement`/ErrorBoundary), `src/main.tsx` baris 6, `src/pages/ProjectDetailPage.tsx` baris 95 (`project.description.map`), `src/lib/projectCover.ts` (lookup `Record`).
- **Skenario:** satu field null/tipe salah dari Supabase (mis. `description` null, `category` nilai tak dikenal) akan melempar saat render dan mengosongkan seluruh aplikasi (layar putih), bukan satu halaman error. `projectCoverGradients[project.category]` untuk kategori asing menjadi `undefined` dan dibuang diam-diam oleh `cn()` → sampul tanpa gradien (tidak crash, tetapi salah tampil).
- **Bukti:** tidak ada `ErrorBoundary`/`useRouteError`; tipe `Project.description: string[]` hanya jaminan compile-time; `tsconfig.app.json` tidak mengaktifkan `noUncheckedIndexedAccess`.
- **Langkah reproduksi (setelah integrasi):**
  1. Kirim satu baris dengan `description = null`.
  2. Buka detail proyek; amati layar putih dan error di console.
- **Rekomendasi:** error boundary di level route + validasi runtime (mis. zod) di batas data, dengan fallback `description: []` dan kategori default.

### B-08 — Sedang — URL eksternal dirender mentah dari data

- **File/lokasi:** `src/components/SocialLinks.tsx`, `src/components/layout/Footer.tsx`, `src/pages/ProjectDetailPage.tsx` baris 105–117, `src/components/CertificateCard.tsx` baris 30–38.
- **Skenario:** saat `url`, `demoUrl`, `credentialUrl` berasal dari database/admin, nilai seperti `data:text/html,...` atau domain phishing dirender apa adanya. React 19.3 **memblokir** `javascript:` (terverifikasi: output menjadi `href="javascript:throw new Error('React has blocked a javascript: URL…')"`), jadi klaim XSS via `javascript:` tidak berlaku; risiko tersisa adalah tautan `data:` dan tujuan berbahaya tanpa peringatan host.
- **Bukti:** tidak ada validasi protokol/host di komponen mana pun; `rel="noopener noreferrer"` sudah benar di keempat lokasi.
- **Langkah reproduksi (setelah integrasi):**
  1. Isi satu tautan sosial dengan `data:text/html,<h1>x</h1>`.
  2. Isi satu dengan domain asing, lalu klik.
- **Rekomendasi:** validasi `https:`/`http:` (dan `mailto:` bila perlu) di form admin dan saat render; tampilkan hostname; pertimbangkan CSP di level deploy.

### B-09 — Rendah — Fokus & landmark setelah navigasi SPA

- **File/lokasi:** `src/layouts/PublicLayout.tsx` baris 7–20, `src/hooks/useDocumentTitle.ts`.
- **Skenario:** (1) Target skip link `<main id="konten-utama">` tidak `tabIndex={-1}`, sehingga pemindahan fokus berbeda antar browser/pembaca layar (perlu diuji). (2) Setelah pindah route, fokus tetap di tautan yang diklik dan tidak ada pengumuman heading. (3) Grup tombol kategori tidak punya nama grup (label "Kategori" adalah `<p>`, bukan `fieldset`/`role="group"`).
- **Bukti:** markup render `<main id="konten-utama">` tanpa `tabindex`; tidak ada `aria-label` pada grup filter.
- **Langkah reproduksi:**
  1. Tab ke skip link → Enter → periksa `document.activeElement`.
  2. Navigasi dengan pembaca layar (NVDA/VoiceOver).
- **Rekomendasi:** `tabIndex={-1}` pada `<main>`, fokuskan `h1`/main setelah route berubah, dan bungkus filter dengan `role="group" aria-labelledby`.

### B-10 — Rendah — Risiko duplicate key pada paragraf deskripsi

- **File/lokasi:** `src/pages/ProjectDetailPage.tsx` baris 95–97 (`key={paragraph}`).
- **Skenario:** dua paragraf identik dari admin → React memperingatkan duplicate key dan rekonsiliasi bisa salah saat konten berubah. Data dummy sekarang tidak memicunya.
- **Bukti:** key memakai isi teks, bukan indeks/id stabil.
- **Langkah reproduksi:**
  1. Duplikasi satu paragraf di `mockData`.
  2. Buka detail proyek, cek console.
- **Rekomendasi:** `key={index}` (aman untuk daftar statis) atau ID paragraf dari model.

### B-11 — Rendah — Filter/pencarian tidak tersimpan di URL dan pencarian bersifat substring persis

- **File/lokasi:** `src/pages/PortfolioPage.tsx` baris 22–52.
- **Skenario:** refresh, tombol Back, atau berbagi tautan menghilangkan kategori/kata kunci. Pencarian `"kalori kalkulator"` gagal walau `"kalkulator kalori"` berhasil, karena `searchTarget.includes(query)` memerlukan urutan kata yang sama. PRD tidak mewajibkan URL state, jadi ini keputusan desain yang perlu disadari.
- **Bukti:** state `useState` lokal; tidak ada `useSearchParams`.
- **Langkah reproduksi:**
  1. Pilih kategori Coding + ketik "kanvas" → refresh → filter hilang.
  2. Cari "kalori kalkulator" → 0 hasil.
- **Rekomendasi:** simpan filter di query param dan pecah kata kunci menjadi beberapa term (semua harus cocok).

### B-12 — Rendah — Dokumen sertifikat tampil seolah dapat dibuka, tetapi tidak ada target

- **File/lokasi:** `src/components/CertificateCard.tsx` baris 39–47; model `src/data/mockData.ts` baris 64–72 (`documentLabel?: string`, tanpa path/URL PDF).
- **Skenario:** badge "PDF · Sertifikat.pdf" tampak seperti tautan unduhan tetapi tidak dapat diklik; sertifikat dengan dokumen saja (tanpa `credentialUrl`) tidak punya aksi apa pun. AC-PUB-05 meminta tombol lihat/unduh bila dokumen tersedia, sehingga model data perlu field path/URL sebelum Tahap 5.
- **Bukti:** `documentLabel` hanya dirender sebagai `<Badge>`; tidak ada `<a>` untuk PDF.
- **Langkah reproduksi:**
  1. Buka `/sertifikat`.
  2. Periksa kartu "Motion Graphics untuk Sosial Media" (hanya `documentLabel`) — tidak ada tombol.
- **Rekomendasi:** tambah `documentPath`/`documentUrl` dan render tautan dengan label jelas; jangan tampilkan badge yang tampak interaktif.

### B-13 — Sedang — Model data belum mendukung "terbaru", pengurutan, dan foto profil

- **File/lokasi:** `src/data/mockData.ts` baris 50–88 (tipe `Project`, `Certificate`, `Experience`, `Education`, `SocialLink`, `SiteProfile`); `src/pages/HomePage.tsx` baris 23 (`publishedProjects.slice(0, 3)`).
- **Skenario:** F-01 meminta "proyek terbaru", tetapi tidak ada `createdAt`/`publishedAt`/`order`, sehingga urutan bergantung urutan array (sekarang kebetulan kronologis). PRD juga meminta urutan eksplisit untuk pendidikan/pengalaman/tautan sosial, path foto profil, dan path PDF — tidak ada di model. Jika dibiarkan, Tahap 3/5 akan memaksa perubahan skema setelah UI dibangun.
- **Bukti:** tipe di atas; tidak ada field tanggal/urutan/foto; `year` dan `period` berupa string bebas.
- **Langkah reproduksi:**
  1. Tambahkan proyek tahun 2023 di akhir array `projects`.
  2. Buka beranda — proyek tersebut tidak muncul sebagai "terbaru", membuktikan urutan memakai posisi array, bukan tanggal.
- **Rekomendasi:** tetapkan kolom `published_at`, `sort_order`, `photo_path`, `document_path` di desain tabel sebelum Tahap 3, dengan query ber-`order`.

### B-14 — Rendah — `aria-describedby` pada `<form>` tanpa nama aksesibel

- **File/lokasi:** `src/pages/admin/AdminLoginPage.tsx` baris 51.
- **Skenario:** `<form>` tanpa `aria-label`/`aria-labelledby` tidak selalu dipetakan ke landmark `form`, sehingga `aria-describedby` (menunjuk `#login-belum-aktif`) mungkin tidak diumumkan — padahal teks itu menjelaskan kenapa form nonaktif.
- **Bukti:** atribut hanya `className` + `aria-describedby`; tidak ada nama.
- **Langkah reproduksi:** periksa accessibility tree halaman `/admin/login`.
- **Rekomendasi:** pindahkan keterangan ke area konten yang selalu terbaca, atau beri form nama (`aria-labelledby`) agar deskripsi ikut diumumkan.

### B-15 — Rendah — "Proyek lain" tidak benar-benar terkait

- **File/lokasi:** `src/pages/ProjectDetailPage.tsx` baris 32–34 (`.filter(id !== current).slice(0, 2)`).
- **Skenario:** setiap detail proyek menampilkan dua proyek pertama dalam urutan data, bukan proyek sekategori/terdekat; untuk proyek non-coding, rekomendasi terasa acak. Label "Proyek lain" netral sehingga bukan bug fungsional, tetapi nilai UX rendah dan akan terlihat jelas saat data nyata.
- **Bukti:** render detail `aplikasi-kalkulator-kalori` → "Identitas Visual Kopi Randu", "Papan Kolaborasi Kanvas" (dua item pertama).
- **Langkah reproduksi:**
  1. Buka detail `motion-reel-gerak-ritmis`.
  2. Amati saran tetap dua proyek pertama.
- **Rekomendasi:** urutkan kategori sama terlebih dahulu, lalu `publishedAt` terbaru.

---

## C. Pemeriksaan yang sudah lulus

| ID | Yang diperiksa | Hasil |
|---|---|---|
| C-01 | `npm run build` (tsc strict + Vite) | Sukses, exit 0, tanpa error TypeScript; 65 modul |
| C-02 | `npm run lint` | 0 error / 0 warning pada 45 file (cakupan rule terbatas — lihat D-09) |
| C-03 | Disiplin tipe | Tidak ada `any`, `as any`, `@ts-ignore`, `@ts-expect-error`; satu non-null assertion wajar di `main.tsx:6`; `Record<ProjectCategoryId, string>` dan union status menjaga kategori/status saat kompilasi |
| C-04 | Routing & 404 | `/`, `/tentang`, `/portofolio`, `/portofolio/:slug`, `/sertifikat`, `/pengalaman`, `/kontak`, `/admin*` merender; path tak dikenal → 404 publik dengan navbar/footer dan dua tautan kembali; `/admin/tidak-ada` → 404 admin; `/portofolio/<slug>/extra` → 404; `/admin/login` terpisah dari layout admin |
| C-05 | Isolasi draft di data publik | Slug draft `eksperimen-tipografi-ekspresif` → "Proyek tidak ditemukan" (1.577 byte, judul draft tidak ada di markup); proyek/sertifikat draft, pengalaman tersembunyi, dan tautan sosial tersembunyi difilter di `mockData.ts` (turunan `published*`/`visible*`) |
| C-06 | Tautan eksternal | 4 pemakaian `target="_blank"`, semuanya `rel="noopener noreferrer"`, plus teks `sr-only` "(buka di tab baru)"; React 19.3 memblokir `javascript:` (terverifikasi) |
| C-07 | Struktur dasar | Tepat satu `<h1>` per halaman (9 halaman + 3 variasi detail); tidak ada `id` duplikat pada semua hasil render |
| C-08 | Label form | Input pencarian publik & admin punya `<label htmlFor>`; `TextField` menghubungkan label, `aria-invalid`, dan `aria-describedby` untuk hint/error |
| C-09 | Gambar/ikon dekoratif | Tidak ada `<img>` (sampul CSS); semua ornamen `aria-hidden`; sampul detail memakai `role="img"` + `aria-label`; ikon SVG `aria-hidden` + `focusable={false}` |
| C-10 | Perilaku tombol | Tombol non-submit memakai `type="button"` (default komponen `Button`); toggle menu punya `aria-expanded`, `aria-controls`, `aria-label`; tidak ada elemen interaktif bersarang di kartu |
| C-11 | Logika filter/pencarian | Kombinasi kategori + kata kunci benar, tidak peka huruf besar/kecil, `trim()` diterapkan, reset membersihkan keduanya, jumlah hasil diumumkan lewat `aria-live="polite"`; pencarian mencakup judul + ringkasan + deskripsi (melebihi minimum PRD) |
| C-12 | Kebersihan keamanan frontend | Tidak ada secret/`VITE_`/`service_role` di source maupun HTML; tidak ada `dangerouslySetInnerHTML`; `.gitignore` mencakup `node_modules`, `dist`, `*.local` |
| C-13 | Performa dasar | Bundle tunggal 97,64 kB gzip; tanpa gambar/video autoplay; `prefers-reduced-motion` dihormati; font `display=swap` |
| C-14 | Kejujuran tahap | Tidak ada sesi/login palsu; tombol CRUD `disabled` disertai `title` penjelasan; `StageNotice` konsisten di semua halaman admin |
| C-15 | Konsistensi UI | Pola `cn()`, `buttonStyles()`, `Container`, `PageHeader`, `EmptyState` dipakai konsisten; tidak ada markup rusak pada render statis semua halaman |

---

## D. Fitur yang belum dapat diaudit karena belum diimplementasikan

| ID | Area | Alasan / catatan |
|---|---|---|
| D-01 | Supabase Database, Auth, Storage, RLS (F-21) | Tidak ada klien, env var, migration, atau policy. AC-SEC-01/02/03 tidak dapat diuji sama sekali |
| D-02 | Login/logout/sesi kedaluwarsa (F-08, F-20) | Form sengaja dinonaktifkan; tidak ada sesi, redirect, atau pesan error kredensial |
| D-03 | CRUD proyek/sertifikat (F-10, F-11) | Baca-saja; tombol tambah/edit/hapus `disabled`; validasi slug unik, field wajib, dan konfirmasi hapus belum ada |
| D-04 | Upload & validasi media (F-12) | Tidak ada upload; batas 5 MB/10 MB, MIME, indikator progres, dan file yatim belum ada |
| D-05 | Transisi draft↔published (F-13) | Tidak ada aksi status; pencabutan akses file setelah unpublish belum ada. Isolasi draft saat ini hanya filter data statis (C-05) |
| D-06 | Akses file langsung / URL Storage | Tidak ada berkas. Uji "draft file tidak bisa diunduh anonim" belum mungkin dilakukan |
| D-07 | SEO teknis (F-22) | Tidak ada `robots.txt`, sitemap, meta description per halaman, Open Graph, canonical; area admin/login **tidak** diberi `noindex`; `<title>` awal di `index.html` statis (judul per halaman hanya di-set client-side oleh `useDocumentTitle`) |
| D-08 | Fallback SPA di Vercel | Tidak ada `vercel.json`/rewrite (Tahap 7). Tanpa itu, refresh `/portofolio/:slug` di deployment produksi akan 404; di dev server tidak terlihat |
| D-09 | Pengujian otomatis | Tidak ada runner, script `test`, atau file uji. Filter/pencarian, validasi, guard route, dan RLS tidak terlindungi regresi. Celah lint: `.oxlintrc.json` hanya mengaktifkan 2 rule; `exhaustive-deps` dan `jsx_a11y/alt-text` tersedia di oxlint (`npx oxlint --rules`) tetapi nonaktif |
| D-10 | Performa terukur (LCP/CLS/INP) | Tidak ada gambar nyata dan tidak ada browser/Lighthouse di lingkungan ini; AC-NFR-03 belum dapat diukur |
| D-11 | Kontak | Sesuai A-06, memang tanpa formulir — tidak ada bug; hanya perlu dicatat sebagai cakupan |
| D-12 | Loading/error state publik (F-03) | `LoadingState`/`ErrorState` hanya dipakai sebagai pratinjau di dashboard admin; belum dipakai halaman publik karena data masih statis |

---

## E. Rekomendasi urutan tindak lanjut

Prioritas yang disarankan bila perbaikan disetujui:

1. **A-01 + A-02 + A-04** — aksesibilitas, dampak langsung dan biaya rendah.
2. **A-05** — commit fondasi agar ada titik rollback sebelum integrasi.
3. **B-01 + B-03 + B-07** — kesiapan menerima data dinamis (submit form, empty state, error boundary/validasi).
4. **A-03** — syarat wajib sebelum data nyata tersambung (guard route + RLS).
5. **D-09** — tambahkan tes otomatis untuk filter/pencarian, 404, dan isolasi draft; aktifkan `exhaustive-deps` dan `jsx_a11y` di oxlint.
6. **D-08** — fallback SPA Vercel sebelum uji deployment.

---

## F. Catatan penutup

- Tidak ada file proyek yang diubah atau dihapus selama audit.
- Bukti render berasal dari harness in-memory (Vite SSR + `react-dom/server`) yang tidak menyentuh berkas proyek.
- Semua klaim visual, kontras, animasi, dan pembaca layar masih memerlukan pengujian manual di browser; lihat daftar di bagian 0.2.
- Temuan pada bagian B **bukan** bug yang sudah terbukti terjadi; statusnya adalah dugaan berbasis kode yang perlu diverifikasi dengan data dinamis atau browser sungguhan.
