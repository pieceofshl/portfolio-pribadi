# AGENTS.md — Portfolio Pribadi

## 1. Peran dan cara berkomunikasi

- Bantu mengembangkan website portofolio pribadi secara bertahap dan berkualitas.
- Pengguna masih pemula. Gunakan bahasa Indonesia yang jelas dan mudah dipahami.
- Sebelum perubahan yang cukup besar, jelaskan tujuan, rencana, dan file yang kemungkinan berubah.
- Untuk pekerjaan bertahap, berikan satu langkah yang jelas terlebih dahulu dan tunggu hasilnya jika hasil itu menentukan langkah berikutnya.
- Jangan membuat perubahan besar yang tidak diminta.
- Jangan menebak penyebab error. Periksa bukti, cari akar masalah, lalu uji solusi.
- Bedakan fakta yang sudah diverifikasi dengan dugaan atau hal yang belum diuji.

## 2. Teknologi proyek

- Frontend: React 19, Vite, TypeScript, Tailwind CSS.
- Backend dan layanan data: Supabase.
- Repository: Git, branch utama `main`.
- Periksa package.json, struktur folder, dan pola kode yang sudah ada sebelum menambah dependensi atau mengubah arsitektur.
- Gunakan pola kode dan versi dependensi yang kompatibel dengan proyek ini.
- Jangan mengasumsikan perintah build, lint, atau test tersedia. Periksa scripts pada package.json terlebih dahulu.

## 3. Aturan keamanan Supabase

- Project Supabase pengujian:
  glzkuricpulqushjvick
- Project Supabase produksi:
  ytzlxehhmlkksasvtuyu
- Untuk pengembangan, migrasi, fixture, dan pengujian keamanan, gunakan project pengujian saja.
- Jangan menjalankan SQL yang mengubah atau menghapus data, migrasi, fixture, atau operasi Storage yang merusak pada project produksi tanpa persetujuan eksplisit pengguna dan verifikasi target.
- Sebelum operasi database yang berisiko, pastikan project ID dan jelaskan dampaknya.
- Jangan menonaktifkan RLS atau melonggarkan policy hanya agar fitur terlihat bekerja.
- Jangan menghapus, mengganti, atau melewati policy keamanan tanpa menjelaskan alasan dan mendapatkan persetujuan pengguna.
- Frontend hanya boleh menggunakan Project URL dan publishable key yang sesuai.
- Jangan pernah memasukkan service_role key, sb_secret key, access token, atau kredensial rahasia ke dalam kode frontend.
- Jangan membuat variabel VITE_ untuk menyimpan kredensial rahasia.
- File .env lokal tidak boleh di-commit. File .env.example hanya boleh berisi nama variabel dan nilai contoh yang tidak rahasia.
- Kebijakan RLS tetap menjadi pengaman utama di database. Pemeriksaan admin di frontend bukan pengganti RLS.
- Sebelum mengerjakan tugas apa pun yang melibatkan Supabase, baca `.agents/skills/supabase/SKILL.md` terlebih dahulu.
- Jika skill merujuk ke file pendukung di folder `references/`, baca referensi yang relevan sebelum mengambil keputusan teknis.
- Jika perintah slash skill tidak tersedia, baca file `SKILL.md` secara langsung. Jangan menganggap skill otomatis aktif hanya karena file sudah terpasang.
- Otorisasi admin proyek saat ini menggunakan `public.admin_users` dan fungsi `private.is_admin()`. Jangan mengganti model ini dengan `app_metadata` atau mekanisme lain tanpa meninjau dampaknya terhadap skema, policy, dan pengujian serta mendapatkan persetujuan pengguna.

## 4. Database dan migrasi

- Periksa migrasi dan skema yang ada sebelum mengubah database.
- Jangan mengedit migrasi yang sudah diterapkan untuk mengubah sejarahnya; buat migrasi baru bila diperlukan.
- Pertahankan konsistensi antara skema, TypeScript, query, dan kebijakan akses.
- Jangan membuat atau menghapus data fixture secara otomatis tanpa rencana dan pemeriksaan target.
- Setelah pengujian, verifikasi pembersihan fixture secara terarah tanpa menghapus data asli.
- Operasi file Storage harus menggunakan mekanisme Storage yang sesuai, bukan menghapus baris storage.objects secara langsung.

## 5. Standar implementasi frontend

- Gunakan TypeScript dengan tipe data yang jelas. Hindari any jika tipe yang sesuai dapat dibuat.
- Utamakan komponen yang kecil, dapat digunakan kembali, dan mudah dirawat.
- Pertahankan gaya visual dan struktur proyek yang sudah ada kecuali perubahan desain memang diminta.
- Pastikan halaman responsif untuk ponsel, tablet, dan desktop.
- Gunakan elemen HTML semantik, navigasi keyboard, label formulir, dan kontras yang memadai.
- Tangani keadaan loading, error, data kosong, dan data berhasil.
- Jangan menampilkan konten draft kepada pengunjung publik.
- Jangan menyimpan password atau menyalin token autentikasi secara manual ke penyimpanan browser atau log. Untuk sesi autentikasi, gunakan mekanisme bawaan Supabase client kecuali ada alasan keamanan yang jelas untuk konfigurasi berbeda.

## 6. Cara mengerjakan perubahan

1. Periksa file dan implementasi yang terkait sebelum mengedit.
2. Jelaskan rencana singkat untuk perubahan yang berisiko atau mencakup banyak file.
3. Ubah bagian sekecil mungkin untuk memenuhi kebutuhan.
4. Jangan mengganti seluruh file jika perbaikan lokal sudah cukup.
5. Jangan menambahkan dependensi tanpa menjelaskan manfaatnya.
6. Jangan menghapus fitur yang sudah ada tanpa alasan dan persetujuan pengguna.
7. Setelah mengedit, tinjau diff untuk menemukan perubahan yang tidak disengaja.

## 7. Pengujian dan verifikasi

- Pilih pengujian berdasarkan perubahan yang dibuat.
- Jalankan perintah yang tersedia di package.json dan alat yang memang terpasang.
- Baca output pengujian; jangan menyimpulkan berhasil hanya karena perintah selesai.
- Untuk SQL test, periksa ringkasan assertion dan pastikan jumlah tes sesuai harapan.
- Untuk masalah API, periksa status HTTP serta body respons, bukan hanya pesan error luarnya.
- Jangan mengklaim telah menjalankan tes, build, browser, atau perintah jika belum benar-benar dijalankan.
- Jika tes tidak dapat dijalankan, jelaskan alasannya dan nyatakan verifikasi yang belum dilakukan.
- Sebutkan file yang berubah, pemeriksaan yang dijalankan, hasilnya, serta risiko atau pekerjaan tersisa.

## 8. Git dan checkpoint

- Sebelum mengubah kode, periksa git status dan perubahan yang sudah ada.
- Jangan menimpa perubahan lokal pengguna yang belum di-commit.
- Jangan menggunakan reset, restore, atau penghapusan file untuk membuang perubahan tanpa persetujuan.
- Sebelum commit, periksa git diff dan git diff --check.
- Jangan commit atau push kecuali diminta atau sudah menjadi langkah yang disepakati dengan pengguna.
- Setelah pekerjaan selesai, jelaskan ringkasan perubahan dan status Git.

## 9. Batasan kerja

- Jangan mengubah konfigurasi produksi hanya untuk menyelesaikan pengujian lokal.
- Jangan menyimpulkan bahwa keamanan telah dijamin hanya dari satu tes.
- Jangan menyembunyikan error atau menghapus pengujian yang gagal agar hasil terlihat lulus.
- Jika persyaratan tidak jelas, tanyakan satu pertanyaan yang paling penting sebelum melakukan perubahan berisiko.

## 10. Pemakaian skill pihak ketiga

- Perlakukan skill dan semua contoh kodenya sebagai panduan yang harus ditinjau, bukan sebagai kode yang otomatis aman.
- Sebelum menjalankan skrip helper dari folder skill, periksa isi skrip, perintah yang dijalankannya, efek samping, akses file, serta kemungkinan akses jaringan.
- Jangan jalankan `.agents/skills/systematic-debugging/find-polluter.sh` dalam proyek ini. Skrip tersebut menyembunyikan output dan mengabaikan kegagalan tes, sehingga hasilnya tidak cukup untuk membuktikan tes berhasil.
- Jangan menyalin pemeriksaan jalur direktori berbasis `normalized.startsWith(tmpDir)` dari contoh `defense-in-depth.md`. Gunakan pemeriksaan jalur berbasis `relative()` dan batas segmen direktori yang benar.
- Jangan menganggap adanya file SKILL.md berarti skill sudah dimuat atau perintah pemanggilannya didukung Freebuff.
- Jika contoh skill bertentangan dengan keamanan proyek atau hasil pengujian nyata, jelaskan konflik tersebut dan utamakan bukti serta keamanan.
- Sesuaikan contoh diagnostik dengan OS dan stack proyek; jangan menjalankan perintah khusus macOS di Windows tanpa kebutuhan dan alternatif yang jelas.
- Jangan mencetak nilai environment variable, token, API key, password, atau credential ke terminal maupun log. Untuk pemeriksaan keberadaan, cukup tampilkan SET atau UNSET.
- Saat menggunakan stack trace atau diagnostik, hindari merekam payload sensitif, kredensial, atau data pribadi. Jangan mengirim log ke layanan eksternal tanpa persetujuan pengguna.
- Jangan menganggap hasil "tidak ditemukan" berarti tes lulus jika tidak ada tes yang berjalan, pencarian gagal, atau kondisi awal belum diperiksa.
- Gunakan helper pihak ketiga hanya jika benar-benar diperlukan, sudah ditinjau, dan memiliki hasil yang dapat diverifikasi.
