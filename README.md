# Website Portofolio Pribadi

Portofolio dinamis (React + Vite + TypeScript) berdasarkan `PRD.md`.

**Status saat ini: Tahap 1 — Kerangka Frontend.**
Seluruh halaman masih memakai data dummy di `src/data/mockData.ts`. Belum ada
Supabase, autentikasi, CRUD, atau upload. Halaman admin adalah kerangka tampilan.

## Menjalankan secara lokal

```bash
npm install      # cukup sekali
npm run dev      # buka http://localhost:5173
```

Perintah lain:

```bash
npm run build      # cek tipe TypeScript + build produksi ke folder dist/
npm run typecheck  # hanya pemeriksaan tipe
npm run lint       # pemeriksaan lint (oxlint)
npm run preview    # menjalankan hasil build secara lokal
```

## Struktur folder

```text
src/
├── App.tsx                 # daftar route (publik + admin)
├── main.tsx                # titik masuk React
├── index.css               # token warna, font, gaya dasar Tailwind
├── config/navigation.ts    # menu navbar, footer, dan sidebar admin
├── data/mockData.ts        # DATA DUMMY (diganti pada Tahap 3)
├── hooks/                  # hook kecil (judul halaman)
├── lib/                    # utilitas (cn, warna sampul proyek)
├── layouts/                # kerangka halaman publik & admin
├── components/
│   ├── layout/             # navbar, footer, scroll-to-top
│   ├── ui/                 # tombol, badge, kartu status, input, ikon
│   ├── admin/              # header & banner khusus admin
│   ├── ProjectCard.tsx
│   ├── CertificateCard.tsx
│   └── SocialLinks.tsx
└── pages/
    ├── ...                 # halaman publik + 404
    └── admin/              # halaman admin (kerangka)
```

## Route

Publik: `/`, `/tentang`, `/portofolio`, `/portofolio/:slug`, `/sertifikat`,
`/pengalaman`, `/kontak`, dan halaman 404.

Admin (belum diproteksi): `/admin/login`, `/admin`, `/admin/proyek`,
`/admin/sertifikat`, `/admin/profil`, `/admin/pendidikan`,
`/admin/pengalaman`, `/admin/sosial`.

## Catatan penting

- Data di `src/data/mockData.ts` hanya untuk membangun UI. Tidak ada data yang
  dikirim atau disimpan ke mana pun.
- Form login sengaja dinonaktifkan; tidak ada login atau sesi palsu.
- Tombol tambah/edit/hapus di admin dinonaktifkan sampai Tahap 4.
- Pada deployment Vercel, route React Router perlu fallback SPA ke
  `index.html` (dikonfigurasi pada Tahap 7).
