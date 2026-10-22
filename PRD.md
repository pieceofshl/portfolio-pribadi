# Product Requirements Document (PRD)

## Website Portofolio Pribadi Dinamis

| Metadata | Nilai |
|---|---|
| Status | Draf untuk ditinjau |
| Versi | 0.1 |
| Tanggal | 22 Oktober 2026 |
| Pemilik produk | Pemilik portofolio (admin tunggal) |
| Dokumen | `PRD.md` |

> **Cara membaca dokumen ini:** kebutuhan berlabel **MUST / P0** wajib ada untuk peluncuran MVP. **SHOULD / P1** penting, tetapi dapat ditunda bila menghambat fitur inti. Teks bertanda **Asumsi** adalah keputusan sementara yang sengaja dibuat sederhana dan perlu ditinjau sebelum implementasi.

---

## 1. Ringkasan Produk dan Tujuan

### 1.1 Ringkasan

Website portofolio pribadi yang memungkinkan publik melihat karya, profil, pendidikan, pengalaman, sertifikat, serta tautan kontak pemilik. Pemilik memiliki satu akun admin untuk masuk ke dashboard dan menambah, membaca, mengubah, atau menghapus konten tanpa perlu mengedit kode setiap kali ada pembaruan.

Website dibangun dengan React, Vite, TypeScript, Tailwind CSS, React Router, Supabase (Database, Auth, dan Storage), GitHub, serta Vercel. Konten yang ditampilkan di halaman publik berasal dari database; file media disimpan di Supabase Storage.

### 1.2 Masalah yang ingin diselesaikan

- Karya dan pencapaian tersimpan di berbagai tempat sehingga sulit dilihat sebagai satu portofolio yang utuh.
- Pemilik perlu cara yang lebih mudah untuk memperbarui data diri dan karya tanpa selalu mengubah kode aplikasi.
- Pengunjung membutuhkan halaman yang rapi, mudah dinavigasi, dan nyaman dibuka melalui laptop maupun ponsel.
- Konten yang belum siap dipamerkan harus dapat disimpan sebagai draft dan tidak ditampilkan kepada publik.

### 1.3 Tujuan produk

1. Menampilkan karya dari kategori coding, ilustrasi, motion graphics, desain grafis, fotografi, videografi, dan kategori lainnya.
2. Menampilkan profil, pendidikan, pengalaman kerja/proyek, sertifikat, kontak, dan media sosial.
3. Memungkinkan satu admin mengelola konten melalui dashboard yang sederhana.
4. Memisahkan konten draft dari konten yang sudah diterbitkan.
5. Menjaga akses admin, database, dan file agar tidak dapat diubah oleh pengunjung biasa.
6. Menyediakan fondasi yang mudah dikembangkan tanpa membangun backend khusus dari awal.

### 1.4 Indikator keberhasilan MVP

- Pengunjung dapat menemukan dan membuka proyek atau sertifikat yang sudah diterbitkan.
- Admin dapat login, mengelola konten, mengunggah media, dan menerbitkan atau membatalkan publikasi.
- Perubahan konten yang disimpan oleh admin muncul pada halaman publik tanpa perlu mengubah kode atau melakukan deployment baru.
- Konten draft tidak muncul pada halaman publik dan tidak dapat diakses sebagai file hanya dengan menebak URL.
- Halaman utama dan halaman penting tetap dapat digunakan pada layar ponsel.
- Tidak ada akses tulis anonim ke database atau Storage.

---

## 2. Target Pengguna

### 2.1 Pengunjung publik

Orang yang ingin mengenal pemilik portofolio, misalnya perekrut, calon klien, dosen, teman kolaborasi, atau pengunjung umum.

**Kebutuhan utama:** melihat karya dengan cepat, memahami peran pemilik, melihat bukti pendidikan/pengalaman/sertifikat, dan menemukan jalur kontak.

### 2.2 Admin pribadi

Satu orang pemilik website yang bertanggung jawab atas semua konten.

**Kebutuhan utama:** login dengan aman, mengelola konten tanpa menulis kode, mengatur draft/published, mengunggah gambar dan dokumen, serta memperbarui profil.

### 2.3 Bukan target MVP

- Pengunjung yang perlu membuat akun.
- Admin kedua, editor, atau sistem peran bertingkat.
- Pengguna yang mengunggah karya mereka sendiri ke website.
- Fitur komunitas, komentar, like, atau pesan langsung di dalam website.

---

## 3. Asumsi dan Keputusan Sementara

Asumsi berikut dipakai agar pengembangan dapat dimulai tanpa menunggu keputusan yang belum tersedia.

| ID | Asumsi / keputusan sementara | Alasan | Perlu ditinjau? |
|---|---|---|---|
| A-01 | Website memakai bahasa Indonesia sebagai bahasa antarmuka awal. Judul atau deskripsi karya boleh ditulis dalam bahasa lain. | Paling sederhana untuk MVP; belum ada kebutuhan multibahasa. | Ya |
| A-02 | Hanya ada satu akun admin. Pendaftaran akun publik tidak disediakan. Akun dibuat langsung melalui Supabase Auth oleh pemilik. | Mengurangi permukaan serangan dan kompleksitas dashboard. | Tidak, kecuali perlu admin kedua |
| A-03 | Status `draft` dan `published` berlaku untuk proyek dan sertifikat. Profil, pendidikan, pengalaman, dan tautan sosial disimpan langsung sebagai data aktif; item pendidikan/pengalaman dapat disembunyikan jika tidak ingin ditampilkan. | Menjaga alur sederhana karena kebutuhan workflow draft terutama penting pada karya. | Ya |
| A-04 | Berkas yang diunggah langsung pada MVP adalah gambar dan PDF. Video ditampilkan melalui tautan/embed dari layanan video eksternal atau tautan proyek, bukan mengunggah file video besar ke Storage. | Video cenderung besar dan dapat cepat menghabiskan kuota penyimpanan/bandwidth gratis. | Ya |
| A-05 | Batas awal di tingkat aplikasi: gambar maksimal 5 MB per file dan PDF maksimal 10 MB per file. Format yang diperbolehkan divalidasi di frontend dan, sejauh didukung, di Storage. | Batas konservatif agar penggunaan Storage tetap terkendali; angka dapat diubah setelah uji coba. | Ya |
| A-06 | Untuk MVP, halaman kontak menampilkan email dan tautan sosial. Tidak ada formulir pesan yang menyimpan data pengunjung. | Menghindari kebutuhan backend tambahan, spam protection, dan pengelolaan data pribadi. | Ya |
| A-07 | Setiap proyek memiliki satu kategori utama dari daftar kategori yang telah ditentukan. Pencarian dasar mencakup judul dan ringkasan/deskripsi proyek. | Lebih mudah dikelola daripada tag bebas dan pencarian lanjutan. | Tidak untuk MVP |
| A-08 | Beranda menampilkan profil singkat dan beberapa proyek terbaru yang berstatus `published`; tidak ada fitur khusus untuk menyematkan proyek pilihan pada MVP. | Menghindari pengaturan tambahan yang belum diminta. | Ya |
| A-09 | Website berupa single-page application (SPA) React + Vite dengan React Router, bukan server-side rendering. | Selaras dengan stack yang direncanakan dan lebih sederhana untuk pemula. | Ya, jika SEO proyek menjadi prioritas besar |
| A-10 | Tidak ada blog, newsletter, analytics khusus, komentar, formulir kontak, atau integrasi pembayaran dalam MVP. | Di luar cakupan yang diminta. | Jika dibutuhkan, jelaskan manfaat dan biaya sebelum ditambahkan |
| A-11 | URL proyek menggunakan `slug` yang unik dan mudah dibaca, misalnya `/portofolio/aplikasi-kalkulator-kalori`. | Membuat tautan proyek stabil dan lebih mudah dibagikan. | Tidak |
| A-12 | Mulai menggunakan paket gratis Supabase dan Vercel, lalu pantau kuota. Kelayakan paket harus diperiksa kembali sebelum dipublikasikan dan secara berkala. | Sesuai kebutuhan proyek pribadi dan pemula. | Ya, saat penggunaan meningkat |

---

## 4. User Stories

### 4.1 Pengunjung publik

- **US-P01:** Sebagai pengunjung, saya ingin melihat ringkasan pemilik di beranda agar dapat memahami siapa pemilik website.
- **US-P02:** Sebagai pengunjung, saya ingin melihat proyek berdasarkan kategori agar dapat menemukan jenis karya yang relevan.
- **US-P03:** Sebagai pengunjung, saya ingin mencari proyek menggunakan kata kunci agar tidak perlu menelusuri semua proyek satu per satu.
- **US-P04:** Sebagai pengunjung, saya ingin membuka detail proyek agar dapat membaca deskripsi, melihat media, dan membuka tautan demo/repository/video jika tersedia.
- **US-P05:** Sebagai pengunjung, saya ingin melihat sertifikat, pendidikan, dan pengalaman agar dapat memahami kompetensi dan perjalanan pemilik.
- **US-P06:** Sebagai pengunjung, saya ingin menemukan email dan media sosial pemilik agar dapat menghubunginya melalui kanal yang tersedia.
- **US-P07:** Sebagai pengunjung, saya ingin menggunakan website dari ponsel maupun komputer tanpa kesulitan.
- **US-P08:** Sebagai pengunjung, saya tidak ingin melihat proyek atau sertifikat yang belum diterbitkan.

### 4.2 Admin

- **US-A01:** Sebagai admin, saya ingin login dengan akun yang telah dibuat agar hanya saya yang dapat mengelola website.
- **US-A02:** Sebagai admin, saya ingin menambah, mengubah, melihat, dan menghapus proyek agar portofolio tetap terbaru.
- **US-A03:** Sebagai admin, saya ingin menyimpan proyek sebagai draft lalu menerbitkannya saat siap.
- **US-A04:** Sebagai admin, saya ingin menambah, mengubah, dan menghapus sertifikat serta mengunggah file pendukungnya.
- **US-A05:** Sebagai admin, saya ingin mengunggah gambar dan PDF dengan validasi jenis/ukuran agar tidak tanpa sengaja mengirim file yang tidak didukung.
- **US-A06:** Sebagai admin, saya ingin mengubah profil, pendidikan, pengalaman, dan tautan sosial tanpa mengedit source code.
- **US-A07:** Sebagai admin, saya ingin mendapat pesan yang jelas saat penyimpanan atau upload gagal agar saya tahu apa yang perlu diperbaiki.
- **US-A08:** Sebagai admin, saya ingin logout setelah selesai mengelola konten.
- **US-A09:** Sebagai admin, saya ingin mengakses dashboard hanya setelah autentikasi berhasil; membuka URL admin secara langsung tidak boleh melewati pemeriksaan akses.

---

## 5. Daftar Fitur dan Prioritas MVP

### Prioritas

- **P0 — Wajib:** tidak boleh ditinggalkan sebelum peluncuran.
- **P1 — Penting:** boleh masuk setelah fondasi P0 stabil atau dipangkas bila menghambat MVP.
- **P2 — Di luar MVP:** tidak dibangun sekarang; perlu persetujuan cakupan baru.

| ID | Fitur | Prioritas | Ruang lingkup MVP |
|---|---|---|---|
| F-01 | Beranda | P0 | Pengantar singkat, ringkasan profil, proyek `published` terbaru, navigasi ke bagian utama. |
| F-02 | Tentang Saya | P0 | Foto/profil (jika tersedia), nama, headline, bio, pendidikan, dan pengalaman. |
| F-03 | Daftar Portofolio | P0 | Kartu proyek, kategori, pencarian dasar, kondisi kosong dan pesan error. |
| F-04 | Detail Proyek | P0 | Judul, kategori, deskripsi, gambar/media terkait, tanggal jika ada, repository/demo/video jika tersedia. |
| F-05 | Sertifikat | P0 | Daftar sertifikat yang `published`, informasi penerbit/tanggal, file atau tautan kredensial jika tersedia. |
| F-06 | Pengalaman | P0 | Daftar pengalaman yang terlihat, urutan kronologis atau urutan yang ditentukan admin. |
| F-07 | Kontak | P0 | Email dan tautan sosial; tautan eksternal jelas dan dapat digunakan. |
| F-08 | Login/logout admin | P0 | Login Supabase Auth, status sesi, logout; tanpa pendaftaran publik. |
| F-09 | Dashboard admin | P0 | Ringkasan singkat dan navigasi ke pengelolaan konten. |
| F-10 | CRUD proyek | P0 | Create, read, update, delete; validasi kolom wajib dan `slug` unik. |
| F-11 | CRUD sertifikat | P0 | Create, read, update, delete; validasi kolom wajib. |
| F-12 | Upload gambar/PDF | P0 | Validasi tipe/ukuran, indikator proses, pesan berhasil/gagal, penghapusan file terkait saat konten/file dihapus dengan aman. |
| F-13 | Draft/published | P0 | Admin bisa menyimpan draft, menerbitkan, dan menarik publikasi proyek/sertifikat. Konten draft disembunyikan dari publik termasuk akses berkas terkait. |
| F-14 | Edit profil | P0 | Ubah data profil utama, headline, bio, email, dan foto profil bila digunakan. |
| F-15 | Kelola pendidikan | P0 | Tambah, ubah, hapus, dan sembunyikan/tampilkan entri pendidikan. |
| F-16 | Kelola pengalaman | P0 | Tambah, ubah, hapus, dan sembunyikan/tampilkan entri pengalaman. |
| F-17 | Kelola tautan sosial | P0 | Tambah, ubah, hapus, atur urutan dan visibilitas tautan. |
| F-18 | Filter dan pencarian | P0 | Filter satu kategori dan pencarian teks dasar; filter dan pencarian bisa dikombinasikan. |
| F-19 | Responsif dan aksesibilitas dasar | P0 | Tata letak nyaman di ponsel/tablet/desktop; navigasi keyboard dan label input tersedia. |
| F-20 | Proteksi route admin | P0 | Route admin mengarahkan pengunjung belum login ke login; kebijakan keamanan database tetap menjadi lapisan proteksi utama. |
| F-21 | RLS database dan Storage | P0 | Aturan baca publik hanya untuk konten terbit; operasi tulis/admin hanya untuk akun admin yang disetujui. |
| F-22 | SEO teknis dasar | P1 | Title/description per halaman, metadata sosial dasar, `robots.txt`, sitemap, dan penanganan route SPA. Catat keterbatasan SEO SPA. |
| F-23 | Pengujian regresi dan dokumentasi setup | P0 | Checklist uji, petunjuk environment variable, langkah deployment, dan cara backup dasar. |
| F-24 | Tema gelap/terang | P2 | Tidak termasuk MVP; hanya ditambahkan jika pengguna memang membutuhkannya. |
| F-25 | Blog, analytics, formulir kontak, multi-admin | P2 | Di luar cakupan saat ini. Manfaat, biaya, privasi, dan tambahan kompleksitas perlu disetujui sebelum dibangun. |

### 5.1 Kategori proyek awal

Kategori yang tersedia di form admin:

1. Coding / Pemrograman
2. Ilustrasi
3. Motion Graphics
4. Desain Grafis
5. Fotografi
6. Videografi
7. Lainnya

Admin memilih satu kategori utama untuk setiap proyek. Kategori dapat disimpan sebagai nilai terkontrol agar filter tidak dipenuhi variasi ejaan.

### 5.2 Data minimum setiap konten

**Proyek:** judul, slug, kategori, ringkasan, deskripsi, status, serta tanggal dibuat/diubah. Gambar sampul disarankan; tautan demo, repository, atau video bersifat opsional.

**Sertifikat:** judul, penerbit, tanggal/tahun bila diketahui, status, serta file PDF atau tautan kredensial bila tersedia.

**Profil:** nama tampilan, headline, bio singkat, email publik, dan path foto profil bila dipakai.

**Pendidikan:** institusi, program/jenjang, rentang tahun, deskripsi opsional, urutan, dan status tampil/sembunyi.

**Pengalaman:** organisasi, jabatan/peran, rentang waktu, ringkasan tanggung jawab, urutan, dan status tampil/sembunyi.

**Tautan sosial:** nama platform, URL, label tampilan, urutan, dan status tampil/sembunyi.

Data yang belum diketahui boleh kosong jika kolom tersebut memang opsional. Antarmuka harus membedakan kolom wajib dan opsional.

---

## 6. Sitemap

### 6.1 Area publik

```text
/
├── /tentang
├── /portofolio
│   └── /portofolio/:slug
├── /sertifikat
├── /pengalaman
└── /kontak
```

Halaman yang tidak ditemukan menampilkan halaman 404 yang memiliki tautan kembali ke beranda. Navigasi utama dapat berupa header/navbar; di layar sempit navigasi harus tetap mudah digunakan.

### 6.2 Area admin

```text
/admin/login
└── /admin
    ├── /admin/proyek
    │   ├── /admin/proyek/baru
    │   └── /admin/proyek/:id/edit
    ├── /admin/sertifikat
    │   ├── /admin/sertifikat/baru
    │   └── /admin/sertifikat/:id/edit
    ├── /admin/profil
    ├── /admin/pendidikan
    ├── /admin/pengalaman
    └── /admin/sosial
```

Rute yang tertera merupakan rancangan konseptual. Struktur path akhir boleh disederhanakan selama fungsi dan proteksi akses tetap sama. Halaman edit berdasarkan `id` hanya untuk admin; gunakan `slug` untuk URL detail proyek publik.

---

## 7. Alur Pengguna

### 7.1 Alur pengunjung

1. Pengunjung membuka beranda.
2. Pengunjung melihat ringkasan profil serta karya terbaru yang telah diterbitkan.
3. Pengunjung membuka daftar portofolio.
4. Pengunjung memilih kategori, mengetik kata kunci, atau melakukan keduanya.
5. Pengunjung membuka kartu proyek untuk membaca detail dan membuka tautan terkait jika tersedia.
6. Pengunjung dapat beralih ke sertifikat, tentang saya, pengalaman, atau kontak.
7. Jika URL tidak cocok dengan konten yang diterbitkan, website menampilkan halaman tidak ditemukan, bukan detail konten draft.

### 7.2 Alur admin

1. Admin membuka `/admin/login` dan memasukkan email/password.
2. Supabase Auth memvalidasi kredensial; pesan error tidak mengungkap informasi yang tidak perlu.
3. Bila berhasil dan akun adalah admin yang disetujui, admin masuk ke dashboard.
4. Admin membuka bagian proyek atau sertifikat, lalu membuat/mengedit konten.
5. Admin mengisi data dan mengunggah gambar/PDF bila diperlukan.
6. Admin memilih **Simpan sebagai draft** atau **Terbitkan**.
7. Sistem memvalidasi form, menyimpan data dan status, serta menampilkan hasil operasi.
8. Konten `published` tampil di halaman publik; konten `draft` tetap hanya untuk admin. Perubahan pada profil, pendidikan, pengalaman, dan sosial tampil setelah disimpan sesuai asumsi A-03.
9. Untuk menghapus item, admin diminta mengonfirmasi. Sistem menghapus referensi dan file terkait sesuai aturan, tanpa meninggalkan file yatim jika prosesnya berhasil.
10. Admin logout. Setelah logout, route admin tidak lagi dapat dibuka tanpa login ulang.

### 7.3 Alur gagal yang wajib ditangani

- Kredensial login salah atau sesi kedaluwarsa.
- Koneksi internet/database tidak tersedia.
- Judul atau kolom wajib kosong.
- Slug sudah digunakan oleh proyek lain.
- Tipe atau ukuran file tidak didukung.
- Upload, penyimpanan, atau penghapusan file gagal.
- Data atau file yang diminta tidak ada, draft, atau tidak dapat dibaca oleh pengguna saat ini.
- Admin menutup atau me-refresh halaman ketika upload/penyimpanan masih berlangsung.

Pesan error harus mudah dimengerti dan tidak menampilkan stack trace, secret, kredensial, atau detail internal database kepada pengunjung.

---

## 8. Kriteria Penerimaan

Kriteria berikut dapat digunakan sebagai checklist selesai. Pengujian keamanan harus dilakukan memakai sesi anonim dan sesi admin yang berbeda.

### 8.1 Halaman publik

**AC-PUB-01 — Beranda (F-01)**

- Beranda menampilkan nama/headline atau pengantar profil.
- Beranda menampilkan proyek terbaru berstatus `published` saja.
- Kartu proyek yang tampil dapat dibuka ke URL detail yang sesuai.
- Jika belum ada proyek terbit, beranda tetap rapi dan menampilkan kondisi kosong yang informatif.

**AC-PUB-02 — Tentang Saya (F-02)**

- Data profil berasal dari database, bukan teks yang harus diubah di source code.
- Pendidikan dan pengalaman yang disembunyikan oleh admin tidak ditampilkan.
- Kolom opsional yang kosong tidak menghasilkan teks `undefined`, tautan kosong, atau elemen rusak.

**AC-PUB-03 — Daftar portofolio (F-03, F-18)**

- Halaman menampilkan proyek `published` saja.
- Pengunjung dapat memilih kategori dan hasil berubah sesuai kategori.
- Pencarian mencocokkan minimal judul dan ringkasan/deskripsi secara tidak peka huruf besar/kecil.
- Kategori dan pencarian dapat dipakai bersamaan; tombol/reset filter mengembalikan seluruh hasil yang sesuai.
- Jika tidak ada hasil, tampil pesan yang mudah dipahami dan pilihan untuk menghapus filter/kata kunci.
- Draft tidak muncul walaupun pengunjung mencoba memanipulasi query dari browser.

**AC-PUB-04 — Detail proyek (F-04)**

- URL memakai slug unik dan memuat proyek yang benar.
- Informasi yang diisi admin ditampilkan dengan format yang mudah dibaca.
- Tautan opsional hanya tampil bila URL tersedia dan valid.
- URL proyek yang tidak ada atau belum diterbitkan menampilkan not-found tanpa membocorkan isi draft.

**AC-PUB-05 — Sertifikat (F-05)**

- Halaman menampilkan sertifikat `published` saja.
- Judul, penerbit, tanggal, serta tombol untuk melihat/mengunduh dokumen atau membuka kredensial ditampilkan bila tersedia.
- Sertifikat tanpa file/URL tetap dapat ditampilkan sebagai informasi tanpa tombol rusak.
- File draft tidak dapat diunduh pengunjung anonim.

**AC-PUB-06 — Pengalaman (F-06)**

- Entri yang terlihat ditampilkan menurut urutan yang konsisten, misalnya urutan admin atau yang terbaru.
- Organisasi, peran, rentang waktu, dan ringkasan ditampilkan bila ada.
- Entri yang disembunyikan admin tidak muncul di publik.

**AC-PUB-07 — Kontak (F-07)**

- Email menggunakan tautan `mailto:` yang benar.
- Tautan sosial menuju URL yang disimpan admin.
- Tautan eksternal dibedakan secara jelas; bila dibuka di tab baru, gunakan atribut keamanan yang sesuai.
- Tidak ada formulir kontak pada MVP.

**AC-PUB-08 — Navigasi dan 404**

- Setiap halaman publik utama dapat dijangkau dari navigasi tanpa harus mengetik URL manual.
- Route yang tidak dikenali menampilkan halaman 404 dan cara kembali.
- Membuka atau me-refresh URL detail proyek secara langsung tetap bekerja pada deployment Vercel (konfigurasi fallback SPA tersedia).

### 8.2 Login dan dashboard admin

**AC-ADM-01 — Login/logout (F-08)**

- Akun admin yang valid dapat login.
- Kredensial yang salah menghasilkan pesan umum dan tidak membuka dashboard.
- Tidak tersedia alur pendaftaran publik.
- Setelah logout, sesi berakhir; mencoba membuka route admin mengarahkan ke login.
- Jika sesi kedaluwarsa, admin diarahkan login kembali dengan pesan yang jelas.

**AC-ADM-02 — Proteksi route (F-20)**

- Pengunjung anonim yang membuka URL admin secara langsung tidak dapat melihat dashboard atau data admin.
- Setelah login, navigasi kembali ke area admin dapat dilakukan sesuai rancangan.
- Proteksi frontend bukan satu-satunya pengamanan; API/database/Storage tetap menolak operasi yang tidak diizinkan.

**AC-ADM-03 — Dashboard (F-09)**

- Dashboard memiliki navigasi yang jelas ke pengelolaan proyek, sertifikat, profil, pendidikan, pengalaman, dan sosial.
- Status loading, kosong, berhasil, dan gagal dapat dibedakan.
- Dashboard tidak menampilkan data sensitif yang tidak diperlukan.

### 8.3 CRUD proyek dan sertifikat

**AC-CONT-01 — Buat proyek (F-10)**

- Admin dapat membuat proyek dengan kolom wajib yang valid.
- Sistem membuat atau memvalidasi slug unik; slug duplikat ditolak dengan pesan yang dapat ditindaklanjuti.
- Admin dapat memilih kategori dan status.
- Data yang berhasil disimpan muncul pada daftar admin.

**AC-CONT-02 — Baca dan edit proyek (F-10)**

- Admin dapat membuka daftar dan detail/edit proyek yang ada, termasuk draft.
- Form edit terisi dengan data tersimpan.
- Perubahan tersimpan setelah validasi dan tampil pada halaman publik jika statusnya `published`.
- Jika penyimpanan gagal, admin melihat pesan error dan data form tidak hilang tanpa alasan.

**AC-CONT-03 — Hapus proyek (F-10)**

- Hapus menampilkan dialog konfirmasi.
- Setelah dikonfirmasi dan berhasil, proyek tidak lagi muncul pada daftar admin maupun publik.
- File yang hanya digunakan oleh proyek yang dihapus dibersihkan dengan aman; jangan menghapus file yang masih dipakai item lain.
- Jika penghapusan data berhasil tetapi penghapusan file gagal, sistem mencatat/menampilkan kondisi tersebut agar dapat dibereskan; jangan berpura-pura seluruh operasi sukses.

**AC-CONT-04 — CRUD sertifikat (F-11)**

- Admin dapat membuat, membaca, mengubah, dan menghapus sertifikat.
- Kolom wajib divalidasi dan kolom opsional boleh kosong.
- Sertifikat terbit muncul di halaman publik, sedangkan draft tidak.
- Menghapus sertifikat meminta konfirmasi dan menangani file terkait dengan aman.

### 8.4 Upload dan workflow publikasi

**AC-MEDIA-01 — Validasi upload (F-12)**

- Gambar hanya menerima tipe yang diizinkan, misalnya JPEG, PNG, dan WebP; PDF hanya untuk dokumen sertifikat.
- Batas awal aplikasi adalah 5 MB untuk gambar dan 10 MB untuk PDF.
- Format/ukuran salah ditolak sebelum atau pada proses upload dan pesan error menjelaskan batas yang berlaku.
- UI memberi indikator saat upload berlangsung serta pesan berhasil/gagal.
- Nama file asli tidak digunakan sebagai satu-satunya identitas penyimpanan; gunakan path unik untuk menghindari benturan nama.

**AC-MEDIA-02 — Akses file dan penghapusan (F-12, F-21)**

- Pengunjung dapat mengakses hanya berkas yang direferensikan oleh konten terbit.
- Berkas draft, atau berkas yang tidak terhubung dengan konten terbit, tidak dapat diambil oleh pengguna anonim hanya dengan URL/path.
- Admin yang sah dapat mengunggah, memperbarui, dan menghapus file.
- File dan metadata path tetap konsisten; jika upload atau penyimpanan metadata gagal, sistem memberi tahu admin dan menyediakan penanganan file yatim.

**AC-PUB-STATUS-01 — Draft/published (F-13)**

- Admin dapat menyimpan proyek/sertifikat tanpa menerbitkannya.
- Admin dapat menerbitkan draft dan menarik publikasi item yang telah terbit.
- Status `draft` tidak muncul pada daftar, pencarian, beranda, sitemap, atau detail publik.
- Saat status berubah menjadi draft/unpublished, akses publik ke data dan file terkait dicabut.
- Perubahan status tidak menghapus data kecuali admin memilih hapus.

### 8.5 Pengelolaan data profil

**AC-PROFILE-01 — Profil (F-14)**

- Admin dapat mengubah field profil yang disediakan dan menyimpan perubahan.
- Data baru tampil pada halaman publik setelah berhasil disimpan.
- Email/URL divalidasi dengan wajar; kolom opsional yang dikosongkan tidak menyebabkan halaman rusak.

**AC-PROFILE-02 — Pendidikan (F-15)**

- Admin dapat menambah, mengubah, menghapus, serta menyembunyikan/menampilkan item pendidikan.
- Perubahan urutan tersimpan bila fitur pengurutan disediakan.
- Item tersembunyi tidak muncul di area publik.

**AC-PROFILE-03 — Pengalaman (F-16)**

- Admin dapat menambah, mengubah, menghapus, serta menyembunyikan/menampilkan item pengalaman.
- Rentang tanggal ditampilkan secara konsisten; nilai tanggal kosong ditangani dengan baik.
- Item tersembunyi tidak muncul di area publik.

**AC-PROFILE-04 — Tautan sosial (F-17)**

- Admin dapat menambah, mengubah, menghapus, menyusun ulang, serta menyembunyikan/menampilkan tautan.
- URL yang bukan format URL yang valid ditolak.
- Tautan tersembunyi tidak muncul di halaman publik.

### 8.6 Keamanan database dan Storage

**AC-SEC-01 — Database RLS (F-21)**

- Row Level Security (RLS) aktif pada setiap tabel yang dapat diakses melalui API publik.
- Peran anonim hanya dapat membaca kolom/baris yang memang diperlukan untuk konten publik.
- Pengguna anonim tidak dapat `INSERT`, `UPDATE`, atau `DELETE` konten.
- Pengguna yang sudah login tetapi bukan akun admin tetap tidak dapat mengelola konten.
- Akun admin dapat melakukan operasi yang diperlukan.
- Status admin tidak dapat diubah oleh pengguna melalui form/browser.

**AC-SEC-02 — Storage RLS (F-21)**

- Bucket media menggunakan aturan akses yang konsisten dengan status publikasi konten.
- Pengunjung anonim tidak dapat upload, mengubah, atau menghapus file.
- Berkas yang terkait konten draft tidak dapat dibaca pengguna anonim.
- Pengujian dilakukan memakai URL file langsung, bukan hanya memeriksa apakah file disembunyikan dari UI.

**AC-SEC-03 — Secrets dan konfigurasi**

- Publishable/anon key Supabase boleh berada di frontend hanya dengan RLS dan grants yang benar.
- `service_role`/secret key dan kredensial administratif tidak pernah dimasukkan ke source code frontend, variabel berawalan `VITE_`, repository, maupun bundle build.
- File `.env.local` tidak di-commit; file contoh hanya berisi nama variabel dan nilai placeholder.

### 8.7 Responsivitas, aksesibilitas, performa, dan SEO

**AC-NFR-01 — Responsif (F-19)**

- Halaman utama lulus pemeriksaan visual pada lebar 360 px, 768 px, dan 1280 px.
- Tidak ada scroll horizontal yang tidak disengaja.
- Tombol, form, kartu, gambar, menu, dan dialog tetap dapat digunakan dengan layar sentuh.

**AC-NFR-02 — Aksesibilitas dasar (F-19)**

- Seluruh fungsi utama dapat dijangkau dengan keyboard; fokus keyboard terlihat.
- Form memiliki label; error terhubung dengan input terkait.
- Gambar yang menyampaikan informasi memiliki teks alternatif; gambar dekoratif tidak mengganggu pembaca layar.
- Warna teks dan latar memiliki kontras yang memadai; informasi tidak disampaikan hanya melalui warna.
- Judul halaman dan heading tersusun secara logis.

**AC-NFR-03 — Performa**

- Gambar dioptimalkan dan gambar di bawah lipatan halaman dimuat secara lazy-load jika sesuai.
- Video tidak autoplay dengan suara; gunakan thumbnail/link/embed seperlunya.
- Target awal saat diuji pada deployment: Largest Contentful Paint (LCP) sekitar ≤ 2,5 detik, Cumulative Layout Shift (CLS) ≤ 0,1, dan Interaction to Next Paint (INP) ≤ 200 ms pada kondisi uji yang layak. Hasil bisa berbeda bergantung jaringan, perangkat, serta ukuran media.
- Pembuatan build produksi dan route utama tidak menghasilkan error console yang menghalangi penggunaan.

**AC-NFR-04 — SEO teknis dasar (F-22, dengan batasan SPA)**

- Setiap halaman publik mempunyai title dan description yang relevan.
- Halaman publik yang layak diindeks tidak sengaja diberi `noindex`; halaman admin/login menggunakan `noindex`.
- Tersedia `robots.txt` dan sitemap dengan URL publik yang diterbitkan saja, jika dibuat pada MVP.
- Route detail dapat dibuka langsung dan memiliki metadata yang benar di sisi aplikasi.
- Tim menerima bahwa SPA Vite tanpa SSR/prerender dapat memberi hasil SEO/preview sosial yang kurang optimal dibanding halaman yang di-render di server. Peningkatan ke SSR/prerender perlu keputusan cakupan tersendiri.

---

## 9. Rancangan Data Awal (Konseptual)

Ini bukan SQL final; struktur dapat disesuaikan saat implementasi selama aturan akses dan kebutuhan fitur tetap terpenuhi.

| Entitas/tabel | Isi utama | Catatan akses |
|---|---|---|
| `site_profile` | Nama, headline, bio, email publik, path foto profil | Publik hanya membaca field publik; admin mengubah. Sebaiknya hanya satu record aktif. |
| `educations` | Institusi, program, rentang tahun, ringkasan, urutan, `is_visible` | Publik membaca entri yang terlihat; hanya admin mengelola. |
| `experiences` | Organisasi, peran, rentang waktu, ringkasan, urutan, `is_visible` | Publik membaca entri yang terlihat; hanya admin mengelola. |
| `social_links` | Platform, label, URL, urutan, `is_visible` | Publik membaca tautan terlihat; hanya admin mengelola. |
| `projects` | Judul, slug, kategori, ringkasan, deskripsi, status, path media, URL eksternal, waktu publikasi | Publik hanya membaca proyek `published`; admin mengelola semuanya. |
| `certificates` | Judul, penerbit, tanggal, status, file path/credential URL | Publik hanya membaca sertifikat `published`; admin mengelola semuanya. |
| `media_assets` | Bucket/path, tipe, ukuran, jenis pemilik konten, referensi konten, status akses publik | Dipakai untuk mencocokkan akses file dengan status publikasi. Penanganan file dan metadata harus konsisten. |
| `admin identity` / helper `is_admin()` | Identitas admin yang disetujui | Dikelola melalui konfigurasi/SQL atau mekanisme tepercaya, bukan lewat form publik. |

### Aturan data

- Gunakan UUID untuk ID record dan `slug` unik untuk URL proyek.
- Simpan timestamp waktu pembuatan/perubahan; catat waktu publikasi bila diperlukan.
- URL eksternal divalidasi sebelum digunakan.
- Hindari menyimpan salinan data yang sama di banyak tempat bila tidak diperlukan.
- Penghapusan record Storage harus dilakukan melalui API/SDK Storage, bukan dengan menghapus metadata internal Storage langsung.
- Semua skema dan perubahan database penting disimpan sebagai migration/script yang bisa dilacak di GitHub.

---

## 10. Kebutuhan Nonfungsional

### 10.1 Keamanan

- Gunakan Supabase Auth untuk login. Tidak ada endpoint atau form pendaftaran publik.
- Aktifkan RLS pada seluruh tabel yang terpapar ke Data API; selain policy, tinjau juga grants karena policy saja belum tentu mencabut izin yang sudah ada.
- Validasi akses dilakukan di database dan Storage, bukan hanya dengan menyembunyikan tombol atau memasang route guard React.
- Hak akses admin didasarkan pada identitas yang disetujui di sisi database. Jangan mempercayai role yang dikirim klien.
- Gunakan bucket private dan policy Storage yang mengizinkan pembacaan anonim hanya untuk file yang terhubung ke konten terbit; semua upload/perubahan/penghapusan hanya admin. Uji ini secara langsung dengan URL file.
- Jangan mengirim `service_role`/secret key ke browser. Prefix `VITE_` berarti variabel dapat masuk ke bundle frontend, sehingga hanya untuk nilai yang memang boleh diketahui publik (misalnya Supabase URL dan publishable key).
- File upload dibatasi menurut tipe dan ukuran. Validasi di UI bukan pengganti izin Storage; jangan percaya nama ekstensi saja.
- Gunakan dialog konfirmasi untuk penghapusan konten.
- Jangan memasukkan informasi pribadi yang tidak perlu. Email publik hanya ditampilkan bila pemilik menyetujuinya.

### 10.2 Responsivitas

- Pendekatan mobile-first dengan Tailwind CSS.
- Minimum pengujian: lebar 360 px (ponsel), 768 px (tablet), dan 1280 px (desktop).
- Galeri/kartu menggunakan grid yang menyesuaikan lebar; teks dan tombol tidak terpotong.

### 10.3 Aksesibilitas

- Ikuti prinsip WCAG 2.2 AA sebagai sasaran desain, tanpa mengklaim sertifikasi otomatis.
- Pastikan kontras, fokus keyboard, label, alt text, struktur heading, pesan error, dan area sentuh memadai.
- Video/gerak visual tidak autoplay dengan suara; sediakan tautan/alternatif teks untuk media yang penting.

### 10.4 Performa dan stabilitas

- Kompres gambar sebelum upload bila memungkinkan; utamakan WebP/JPEG/PNG yang sesuai.
- Terapkan lazy loading pada media yang tidak langsung tampak.
- Hindari mengunduh seluruh media asli beresolusi tinggi di daftar portofolio; daftar memakai thumbnail/sampul.
- Tangani loading, error, dan empty state untuk query Supabase.
- Gunakan tipe TypeScript untuk model data dan form guna mengurangi kesalahan sederhana.

### 10.5 SEO dan berbagi tautan

- Gunakan title, description, URL slug yang mudah dibaca, alt text, serta metadata sosial dasar.
- Pastikan halaman publik terindeks secara wajar dan halaman admin/login tidak.
- Karena stack yang dipilih adalah SPA Vite, SEO dan preview sosial dinamis mungkin tidak sekuat SSR/prerender. Jika pencarian organik menjadi tujuan utama, evaluasi prerender/SSR sebagai perubahan arsitektur, bukan fitur diam-diam.

### 10.6 Pemeliharaan

- Simpan source code dan migration di GitHub; jangan commit secret atau konten pribadi yang tidak perlu.
- Gunakan `.env.example` yang berisi placeholder dan `.gitignore` yang benar.
- Dokumentasikan cara menjalankan lokal, mengonfigurasi Supabase, menguji RLS, serta melakukan deployment.
- Lakukan backup manual berkala terhadap data penting dan file yang tidak dapat diganti dengan mudah.

---

## 11. Risiko Teknis dan Batas Layanan Gratis

**Catatan:** batas dan harga layanan dapat berubah. Kuota berikut merujuk pada halaman resmi yang diperiksa untuk draf tanggal 22 Oktober 2026; periksa kembali dashboard dan dokumentasi resmi tepat sebelum deployment.

### 11.1 Supabase Free

Menurut halaman harga resmi Supabase, paket Free saat ini mencantumkan batas penting seperti database 500 MB per project, file storage 1 GB, egress 5 GB, 50.000 pengguna aktif bulanan, serta project gratis dapat dijeda setelah satu minggu tidak aktif. Paket ini juga memiliki batas jumlah project aktif. Detail terkini ada di [Supabase Pricing](https://supabase.com/pricing) dan [About billing on Supabase](https://supabase.com/docs/guides/platform/billing-on-supabase).

**Risiko dan mitigasi:**

- **Storage cepat penuh:** batasi ukuran upload, optimalkan gambar, gunakan tautan video eksternal, hapus file tak terpakai, dan pantau dashboard.
- **Egress/bandwidth terlampaui:** gunakan thumbnail, lazy loading, dan hindari memuat video besar otomatis.
- **Project dijeda karena tidak aktif:** lakukan pemeriksaan berkala; jangan menganggap layanan gratis memiliki ketersediaan tanpa gangguan.
- **Backup terbatas:** jangan mengandalkan paket gratis sebagai satu-satunya salinan. Siapkan ekspor/backup data dan strategi backup file secara berkala.
- **Perubahan limit/harga:** cek halaman harga dan pemakaian aktual sebelum memutuskan upgrade.

### 11.2 Vercel Hobby

Paket Vercel Hobby berharga $0 untuk penggunaan personal non-komersial serta menyediakan deployment terhubung dengan Git dan CDN; namun kuota resource tetap berlaku dan dapat berubah. Vercel menjelaskan bahwa Hobby ditujukan untuk penggunaan pribadi non-komersial dan batas pemakaian tidak dapat ditambah dengan membeli kelebihan pemakaian pada paket itu. Referensi: [Vercel Pricing](https://vercel.com/pricing) dan [Vercel plan FAQ](https://vercel.com/docs/plans).

**Risiko dan mitigasi:**

- **Batas pemakaian tercapai:** pantau kuota deployment, bandwidth, dan fungsi di dashboard; desain MVP sebagai situs statis dengan permintaan backend seminimal mungkin.
- **Perubahan tujuan penggunaan:** bila situs menjadi bagian dari aktivitas komersial/freelance atau kebutuhan profesional berkembang, tinjau ketentuan paket Vercel dan kemungkinan perlu paket berbayar.
- **Domain khusus:** domain milik sendiri dapat memerlukan biaya registrar; domain bukan bagian yang harus ada untuk menguji MVP.
- **Route SPA:** pastikan route React Router tetap berfungsi saat URL detail dibuka atau di-refresh langsung setelah deployment.

### 11.3 Risiko aplikasi dan mitigasi

| Risiko | Dampak | Mitigasi / pengecekan |
|---|---|---|
| RLS salah konfigurasi | Data draft atau operasi admin terbuka ke publik | Buat matrix izin anonim/admin; uji setiap tabel dengan sesi berbeda dan uji URL file langsung sebelum rilis. |
| Secret key bocor | Orang lain dapat melewati kontrol keamanan | Jangan gunakan service/secret key di frontend; cek `.gitignore`, environment variables, dan repository sebelum push. |
| Status database dan file tidak sinkron | File draft dapat terbuka atau file terbit rusak | Jadikan publish/unpublish workflow eksplisit; update status/metadata secara konsisten dan uji transisi dua arah. |
| File besar/format aneh | Kuota boros, loading lambat, potensi penyalahgunaan | Batasi ukuran dan MIME type; kompres gambar; uji file terlalu besar/jenis tidak didukung. |
| Penghapusan file gagal sebagian | File yatim atau konten menunjuk file yang sudah hilang | Tangani error storage secara terpisah, tampilkan status, dan sediakan prosedur pembersihan manual. |
| SPA SEO terbatas | Halaman proyek mungkin kurang optimal untuk crawler/preview | Lakukan SEO teknis dasar dan evaluasi prerender/SSR hanya jika kebutuhan membenarkannya. |
| Ketergantungan paket gratis | Perubahan kebijakan, kuota, atau jeda layanan | Simpan source dan backup; pantau pemakaian; catat langkah migrasi dasar untuk data penting. |
| Vibe coding menghasilkan perubahan terlalu luas | Bug, dependency berlebih, desain/schema berubah tanpa sengaja | Berikan prompt kecil per fitur, minta ringkasan file yang diubah, tinjau diff, dan jalankan checklist/build setelah tiap tahap. |

### 11.4 Batasan MVP yang disengaja

- Tidak ada upload video besar langsung; gunakan tautan/embed eksternal.
- Tidak ada pendaftaran pengguna publik atau multi-admin.
- Tidak ada formulir kontak yang menyimpan pesan.
- Tidak ada CMS berfitur lengkap, rich text editor kompleks, workflow approval, atau version history konten.
- Tidak ada kompresi video, image CDN berbayar, SSR, atau analytics khusus pada tahap awal.

---

## 12. Rencana Implementasi Bertahap

Urutan ini dibuat untuk vibe coding: setiap tahap sebaiknya menghasilkan sesuatu yang bisa dijalankan dan diperiksa sebelum meminta AI mengerjakan tahap berikutnya.

### Tahap 0 — Konfirmasi cakupan dan persiapan

**Hasil:** PRD disetujui, GitHub repository dibuat, keputusan asumsi diperiksa.

- Tinjau A-01 sampai A-12, terutama bahasa, jenis upload, status publikasi, dan kontak.
- Buat repository GitHub dan commit awal untuk PRD.
- Siapkan akun Supabase dan Vercel, tanpa menaruh secret dalam repository.
- Catat variabel environment yang diperlukan di `.env.example`.

**Selesai bila:** keputusan penting terdokumentasi dan repository bersih dari secret.

### Tahap 1 — Kerangka frontend

**Hasil:** aplikasi React + Vite + TypeScript dapat berjalan lokal.

- Pasang dan konfigurasi Tailwind CSS serta React Router.
- Buat layout global, navigasi, footer, typography, warna, dan komponen dasar.
- Buat route semua halaman publik dan admin dalam bentuk kerangka, termasuk 404.
- Gunakan data mock sementara hanya untuk membantu membangun UI; tandai dengan jelas agar diganti pada tahap integrasi.
- Buat layout responsif utama.

**Selesai bila:** setiap route dapat dibuka, navigasi berfungsi, dan `npm run build` berhasil.

### Tahap 2 — Desain database dan kontrol akses

**Hasil:** skema Supabase dan kebijakan akses dasar dapat diuji.

- Rancang tabel sesuai bagian 9 dan buat migration SQL yang disimpan di GitHub.
- Buat akun admin tunggal melalui Supabase Auth; jangan aktifkan sign-up publik.
- Aktifkan RLS dan grants minimum untuk setiap tabel yang terpapar API.
- Buat helper/policy untuk memverifikasi admin.
- Buat bucket private dan policy agar hanya file terkait konten terbit yang dapat dibaca anonim, sementara operasi pengelolaan hanya admin.
- Masukkan data dummy dan uji akses anonim versus admin sebelum membuat semua UI CRUD.

**Selesai bila:** pengunjung anonim tidak dapat mengubah data; akun bukan-admin tidak dapat mengelola data; draft dan file draft tidak dapat dibaca secara publik.

### Tahap 3 — Integrasi data publik

**Hasil:** semua halaman publik membaca data Supabase.

- Hubungkan profil, pendidikan, pengalaman, tautan sosial, proyek terbit, dan sertifikat terbit.
- Implementasikan daftar/detail proyek, kategori, pencarian dasar, dan empty/error/loading states.
- Implementasikan detail berdasarkan `slug` dan penanganan 404.
- Tambahkan tautan eksternal dan penayangan file yang diizinkan.

**Selesai bila:** konten berasal dari database, filter/pencarian bekerja, dan draft tidak tampil.

### Tahap 4 — Login dan dashboard admin

**Hasil:** satu admin dapat masuk dan mengelola konten.

- Implementasikan login/logout melalui Supabase Auth.
- Implementasikan protected route untuk kenyamanan UI, sambil tetap mengandalkan RLS untuk keamanan.
- Bangun dashboard dan daftar admin proyek/sertifikat.
- Buat form CRUD dengan validasi dan konfirmasi penghapusan.
- Implementasikan edit profil, pendidikan, pengalaman, dan tautan sosial.

**Selesai bila:** alur admin dapat diuji lengkap dan akses anonim/non-admin ditolak oleh database.

### Tahap 5 — Upload dan publikasi

**Hasil:** media dan status publikasi berfungsi aman.

- Tambahkan upload gambar/PDF, validasi ukuran/tipe, indikator progres, dan pesan error.
- Pastikan file path tersimpan konsisten di database.
- Implementasikan simpan draft, terbitkan, dan tarik publikasi.
- Pastikan perubahan status juga mengubah izin baca berkas terkait.
- Uji file yatim dan kegagalan parsial.

**Selesai bila:** file terbit bisa dilihat publik, file draft tertutup, dan semua transisi status bekerja.

### Tahap 6 — Poles UI, aksesibilitas, performa, SEO

**Hasil:** website siap diuji lintas ukuran layar.

- Uji tampilan 360 px, 768 px, dan 1280 px.
- Perbaiki fokus keyboard, label, alt text, kontras, dan pesan validasi.
- Optimalkan gambar, thumbnail, lazy loading, dan metadata halaman.
- Tambahkan SEO teknis dasar sesuai batasan SPA.

**Selesai bila:** tidak ada masalah layout mayor, navigasi keyboard memadai, dan media tidak membebani halaman tanpa perlu.

### Tahap 7 — Pengujian, deployment, dan dokumentasi

**Hasil:** versi produksi live dan proses pembaruan dapat diulang.

- Jalankan type-check, lint bila dikonfigurasi, automated test yang tersedia, dan build produksi.
- Jalankan seluruh checklist pada bagian 13.
- Hubungkan GitHub ke Vercel dan atur environment variables melalui pengaturan proyek.
- Siapkan konfigurasi fallback SPA untuk React Router.
- Uji route publik, admin, upload, dan RLS di deployment produksi dengan data uji.
- Dokumentasikan deploy, rollback sederhana, backup, dan cara memperbaiki akun admin.

**Selesai bila:** build/deployment sukses, halaman dapat diakses, test keamanan lulus, dan pemilik tahu cara mengelola website.

---

## 13. Rencana Pengujian

### 13.1 Pengujian fungsional manual

| ID | Skenario | Hasil yang diharapkan |
|---|---|---|
| T-01 | Buka semua halaman publik dari navigasi | Halaman terbuka dan navigasi aktif dengan benar. |
| T-02 | Buka proyek published dari daftar dan URL langsung | Detail cocok dengan slug dan tetap bekerja setelah refresh. |
| T-03 | Buka URL proyek draft | Menampilkan not-found/akses tidak tersedia; detail tidak bocor. |
| T-04 | Filter kategori dan kata kunci sekaligus | Hanya proyek yang cocok ditampilkan. |
| T-05 | Login memakai kredensial salah | Login ditolak dengan pesan umum. |
| T-06 | Buka `/admin` tanpa login | Dialihkan ke login; data admin tidak bocor. |
| T-07 | Login sebagai admin dan logout | Admin bisa masuk; setelah logout route admin tidak terbuka. |
| T-08 | Buat dan edit proyek | Nilai tersimpan dan tampil sesuai status. |
| T-09 | Coba slug duplikat atau kolom wajib kosong | Penyimpanan ditolak dan error ditampilkan di field yang relevan. |
| T-10 | Upload file gambar valid | Upload berhasil dan gambar dapat digunakan. |
| T-11 | Upload file terlalu besar/tipe salah | Upload ditolak dengan pesan yang jelas. |
| T-12 | Terbitkan proyek/sertifikat draft | Konten tampil di publik dan file yang dibutuhkan dapat diakses. |
| T-13 | Tarik publikasi konten | Konten hilang dari publik dan file tidak bisa diambil anonim. |
| T-14 | Hapus item yang memiliki file | Ada konfirmasi; record dihapus; file tak terpakai dibersihkan dengan aman. |
| T-15 | Ubah profil, pendidikan, pengalaman, dan sosial | Perubahan tersimpan dan terlihat sesuai setelan tampil/sembunyi. |
| T-16 | Matikan jaringan atau simulasikan kegagalan request | UI memberikan pesan; tidak melaporkan sukses palsu; data form tidak hilang tanpa pemberitahuan. |
| T-17 | Buka halaman pada lebar 360/768/1280 px | Tidak ada layout pecah atau scroll horizontal tidak disengaja. |
| T-18 | Uji tab/keyboard dan label form | Fokus terlihat, kontrol utama bisa digunakan, field memiliki label. |

### 13.2 Pengujian keamanan wajib

Lakukan pengujian dengan tiga keadaan: (1) tanpa login, (2) login sebagai akun biasa/non-admin bila memungkinkan dalam lingkungan uji, dan (3) login sebagai admin.

- Pastikan `SELECT` anonim hanya mengembalikan baris/field publik yang memang dibutuhkan.
- Coba operasi `INSERT`, `UPDATE`, dan `DELETE` pada setiap tabel dari anon; semuanya harus ditolak.
- Pastikan login saja tidak otomatis berarti admin.
- Coba mengakses path file draft secara langsung tanpa sesi admin; permintaan harus ditolak.
- Pastikan pengguna anonim tidak dapat upload, overwrite, atau menghapus file.
- Cari string yang terlihat seperti secret key di repository dan hasil build; secret key tidak boleh ada.
- Uji transisi status draft → published dan published → draft serta akses file setelah tiap transisi.
- Pastikan penetapan role admin tidak bisa dilakukan lewat request klien.

### 13.3 Otomasi yang disarankan untuk MVP

- TypeScript type-check dan build produksi dijalankan sebelum merge/deploy.
- Tambahkan tes unit sederhana untuk fungsi filter/pencarian dan validasi data.
- Jika menggunakan fasilitas Supabase CLI, simpan migration dan tes RLS di repository agar aturan keamanan bisa diulang.
- Tes browser end-to-end lengkap boleh dilakukan manual pada MVP; otomatisasi E2E dapat dipertimbangkan setelah alur utama stabil.

### 13.4 Kriteria rilis

MVP siap dirilis bila:

- Semua kriteria penerimaan P0 yang relevan lulus.
- Tidak ada bug kritis pada login, CRUD, publikasi, atau akses file.
- RLS/Storage policy telah diuji memakai anon dan admin.
- Build produksi berhasil dan URL langsung untuk route React Router bekerja.
- Tidak ada secret di GitHub atau bundle frontend.
- Pemilik telah mencoba login, update konten, dan rollback/pemulihan dasar.
- Batas paket gratis dan rencana backup dipahami pemilik.

---

## 14. Pedoman Vibe Coding

Bagian ini bukan fitur produk; ini cara kerja yang disarankan agar AI coding assistant tidak mengubah terlalu banyak bagian sekaligus.

1. **Kerjakan satu tahap/satu fitur per prompt.** Berikan konteks dari PRD, tujuan, file yang boleh diubah, serta kriteria penerimaan yang harus dipenuhi.
2. **Minta AI membaca struktur proyek sebelum mengedit.** Jangan biarkan AI menebak nama file atau menulis ulang seluruh aplikasi tanpa alasan.
3. **Minta penjelasan keputusan teknis dengan bahasa pemula.** Misalnya: file apa yang dibuat, mengapa dibutuhkan, cara menjalankannya, dan cara memeriksa hasil.
4. **Jangan menerima klaim keamanan tanpa pengujian.** Minta AI menjelaskan tabel, grants, RLS policies, Storage policies, dan skenario anon/admin yang sudah diuji.
5. **Tinjau perubahan Git sebelum commit.** Periksa `git diff`, jalankan aplikasi, tes build, kemudian commit dalam bagian kecil.
6. **Jangan hardcode secret.** Gunakan environment variables; semua nilai `VITE_` dianggap dapat dilihat browser.
7. **Jangan menambahkan fitur baru secara diam-diam.** Jika AI menyarankan fitur di luar P0/P1, minta manfaat, tambahan kompleksitas, risiko, dan alternatif lebih sederhana sebelum menyetujuinya.
8. **Jaga catatan keputusan.** Jika asumsi pada dokumen berubah, perbarui PRD dan commit perubahan tersebut sebelum implementasi makin jauh.

Contoh prompt untuk tahap berikutnya:

> Baca `PRD.md` dan kerjakan Tahap 1 saja. Sebelum mengedit, ringkas rencana file yang akan dibuat/diubah. Gunakan React + Vite + TypeScript, Tailwind CSS, dan React Router. Buat kerangka route publik/admin dan tampilan responsif sederhana; jangan integrasikan Supabase dulu dan jangan menambah fitur di luar PRD. Setelah selesai, jelaskan perintah untuk menjalankan dan memeriksa aplikasi, lalu pastikan build produksi berhasil.

---

## 15. Referensi Teknis Resmi

Referensi diperiksa pada 22 Oktober 2026. Batas layanan dapat berubah sehingga harus ditinjau kembali sebelum rilis.

1. Supabase Pricing — https://supabase.com/pricing
2. About billing on Supabase — https://supabase.com/docs/guides/platform/billing-on-supabase
3. Supabase Row Level Security — https://supabase.com/docs/guides/database/postgres/row-level-security
4. Supabase Storage Access Control — https://supabase.com/docs/guides/storage/security/access-control
5. Vercel Pricing — https://vercel.com/pricing
6. Vercel Plans — https://vercel.com/docs/plans
7. Vite Environment Variables and Modes — https://vite.dev/guide/env-and-mode

---

## 16. Daftar Keputusan untuk Ditinjau Sebelum Coding

Centang setelah diputuskan:

- [ ] Apakah bahasa antarmuka Indonesia saja cukup untuk versi pertama? (A-01)
- [ ] Apakah video cukup ditampilkan lewat tautan/embed eksternal? (A-04)
- [ ] Apakah batas upload 5 MB gambar dan 10 MB PDF sesuai? (A-05)
- [ ] Apakah halaman kontak cukup dengan email dan tautan sosial, tanpa formulir pesan? (A-06)
- [ ] Apakah draft/published hanya diperlukan untuk proyek dan sertifikat? (A-03)
- [ ] Apakah domain bawaan Vercel cukup untuk peluncuran awal atau ingin membeli domain sendiri?
- [ ] Apakah batas paket gratis dapat diterima, dengan pemantauan kuota dan backup manual?

**Keputusan default bila belum ada jawaban:** gunakan asumsi pada bagian 3 agar MVP tetap kecil, aman, dan dapat diuji; revisi PRD sebelum menambahkan kebutuhan baru.
