-- =============================================================================
-- TAHAP 2 — BUCKET MEDIA DAN STORAGE POLICY
-- =============================================================================
-- File ini adalah RANCANGAN yang belum pernah dijalankan pada database mana pun.
--
-- Keputusan utama: bucket `media` bersifat PRIVATE (public = false).
-- Alasannya: pada bucket publik, siapa pun yang memiliki URL file bisa membuka
-- file itu selamanya, termasuk file milik konten draft. Pada bucket private,
-- setiap pembacaan harus lolos policy storage.objects.
--
-- Isi file:
--   1. Membuat/menyelaraskan bucket `media` (private, batas 10 MB, tipe tertentu).
--   2. Policy baca publik: hanya file yang terhubung ke konten terbit.
--   3. Policy kelola admin: upload, ubah, hapus hanya untuk admin.
--
-- Catatan: tabel storage.objects sudah memiliki RLS dari Supabase. JANGAN
-- mematikan RLS di schema storage. Yang kita tambahkan hanya policy.
-- Grant pada storage.objects sudah disediakan Supabase; jangan dicabut.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. Bucket
-- ---------------------------------------------------------------------------
-- Batas 10 MB dipakai di level bucket karena batas bucket tidak bisa berbeda
-- per folder/tipe. Batas gambar 5 MB tetap harus divalidasi di aplikasi
-- (dan sebaiknya juga dicatat di media_assets.size_bytes untuk audit).
--
-- allowed_mime_types menolak tipe lain di level Storage, jadi file .exe atau
-- .svg tidak bisa diunggah meskipun aplikasi dimanipulasi.
--
-- Bila role migration tidak diizinkan menulis ke storage.buckets, buat bucket
-- yang sama lewat Dashboard > Storage dengan setelan identik.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
  set public             = false,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;


-- ---------------------------------------------------------------------------
-- 2. Policy baca publik
-- ---------------------------------------------------------------------------
-- Policy SELECT pada storage.objects dipakai untuk dua hal:
--   a. membuat signed URL (createSignedUrl) sebagai anon/authenticated, dan
--   b. membaca file lewat method download dengan JWT pengguna.
-- File yang tidak lolos policy tidak bisa menghasilkan signed URL.
--
-- PENTING: signed URL yang sudah dibuat tetap berlaku sampai masa berlakunya
-- habis, walaupun kontennya kemudian ditarik ke draft. Karena itu gunakan masa
-- berlaku pendek (disarankan 60 detik) dan minta signed URL baru setiap kali
-- halaman dimuat. Ini dibahas di dokumen rancangan bagian Storage.

create policy media_read_published_files
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'media'
    and (select private.is_public_media(bucket_id, name))
  );


-- ---------------------------------------------------------------------------
-- 3. Policy kelola admin
-- ---------------------------------------------------------------------------
-- Mencakup INSERT (upload), UPDATE (timpa/upsert), DELETE, dan SELECT (daftar
-- file untuk admin). Anon tidak memiliki policy INSERT/UPDATE/DELETE sama
-- sekali, sehingga upload/penimpaan/penghapusan ditolak di level Storage.

create policy media_admin_manage_files
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'media'
    and (select private.is_admin())
  )
  with check (
    bucket_id = 'media'
    and (select private.is_admin())
  );
