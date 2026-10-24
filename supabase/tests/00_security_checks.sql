-- =============================================================================
-- TAHAP 2 — SKENARIO UJI KEAMANAN (RANCANGAN, BELUM DIJALANKAN)
-- =============================================================================
-- File ini BUKAN otomasi CI dan belum pernah dieksekusi. Isinya skenario manual
-- yang bisa dijalankan di Supabase SQL Editor atau psql SETELAH migration
-- Tahap 2 diterapkan pada project uji (bukan project produksi).
--
-- Cara kerja:
--   - Fixture DATABASE dibuat di dalam satu transaksi dan diakhiri ROLLBACK.
--   - File uji Storage diunggah TERPISAH lewat Storage API/Dashboard. Skrip ini
--     tidak memakai INSERT ke storage.objects untuk fixture. Satu-satunya
--     percobaan INSERT adalah probe T11 (anon) yang harus ditolak dan
--     di-rollback.
--   - `set local role anon` / `set local role authenticated` meniru request API.
--   - `request.jwt.claims`, `request.jwt.claim.sub`, dan `request.jwt.claim.role`
--     meniru isi token user yang login. Ketiganya SELALU di-set bersamaan
--     (set_config(..., ..., true)) di setiap titik pergantian identitas, agar
--     identitas satu bagian tidak terbawa ke bagian berikutnya.
--   - Hasil setiap cek berupa kolom `lulus` (true/false) atau pesan NOTICE.
--
-- Prasyarat:
--   1. Migration 01–03 sudah diterapkan.
--   2. Ada satu user uji di Authentication > Users. Ganti email di bawah.
--      Skrip mengambil user_id dari auth.users; bila tidak ditemukan, skrip
--      berhenti dengan pesan jelas. User hanya didaftarkan ke allowlist admin
--      bila belum terdaftar; catatan admin yang sudah ada tidak diubah.
--   3. Lima file uji sudah diunggah ke bucket `media` (lihat bagian 2).
--   4. Jalankan seluruh file sekaligus. Jika ada error di tengah jalan,
--      transaksi otomatis dibatalkan; jalankan `rollback;` bila sesi masih terbuka.
--
-- Batas: skrip ini menguji metadata dan policy database. Akses file nyata
-- (signed URL, unduh, upload) TIDAK dibuktikan di sini; uji lewat HTTP sesuai
-- dokumen bagian 8.3.
--
-- PENTING — SELESAI TANPA ERROR != SEMUA TES LULUS:
--   Sebagian pemeriksaan hanya mengembalikan kolom `lulus`. Baris dengan
--   lulus = false adalah KEGAGALAN yang tidak menghentikan skrip. Periksa
--   setiap baris hasil; jangan menyimpulkan apa pun dari pesan "Success".
--   Hanya pemeriksaan berbentuk DO yang berhenti dengan exception saat gagal.
--   Skrip ini belum memakai tabel hasil/pgTAP; lihat dokumen 8.1 untuk opsi.
--
-- Catatan: query sebagai `postgres` (pemilik tabel) MELEWATI RLS. Karena itu
-- setiap cek akses selalu didahului `set local role ...`.
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 0. Konfigurasi fixture
-- ---------------------------------------------------------------------------
select set_config('test.admin_email', 'admin-uji@example.com', true);

-- ---------------------------------------------------------------------------
-- 1. Fixture konten (dijalankan sebagai pemilik tabel)
-- ---------------------------------------------------------------------------

insert into public.site_profile (id, name, initials, headline, bio, email)
values (
  '00000000-0000-4000-8000-000000000001',
  'Pemilik Uji', 'PU', 'Headline uji', 'Bio uji untuk pengujian keamanan.',
  'uji@example.com'
)
on conflict (is_primary) do nothing;

select set_config(
  'test.profile_id',
  (select id::text from public.site_profile order by created_at limit 1),
  true
);

insert into public.projects (id, slug, title, category, summary, description, status)
values
  ('00000000-0000-4000-8000-000000000002', 'uji-terbit', 'Proyek Uji Terbit',
   'coding', 'Ringkasan uji', 'Deskripsi uji', 'published'),
  ('00000000-0000-4000-8000-000000000003', 'uji-draft', 'Proyek Uji Draft',
   'coding', 'Ringkasan uji', 'Deskripsi uji', 'draft')
on conflict (id) do nothing;

insert into public.certificates (id, title, issuer, issued_on, status)
values
  ('00000000-0000-4000-8000-000000000004', 'Sertifikat Uji Terbit', 'Lembaga Uji',
   date '2026-01-15', 'published'),
  ('00000000-0000-4000-8000-000000000005', 'Sertifikat Uji Draft', 'Lembaga Uji',
   date '2026-02-15', 'draft')
on conflict (id) do nothing;

insert into public.educations (id, institution, program, start_year, end_year, is_visible)
values
  ('00000000-0000-4000-8000-000000000011', 'Institusi Uji Tampil', 'Program Uji',
   2020, 2024, true),
  ('00000000-0000-4000-8000-000000000012', 'Institusi Uji Sembunyi', 'Program Uji',
   2015, 2019, false)
on conflict (id) do nothing;

insert into public.experiences (id, organization, role, start_date, end_date, is_visible)
values
  ('00000000-0000-4000-8000-000000000013', 'Organisasi Uji Tampil', 'Peran Uji',
   date '2024-01-01', null, true),
  ('00000000-0000-4000-8000-000000000014', 'Organisasi Uji Sembunyi', 'Peran Uji',
   date '2022-01-01', date '2023-12-31', false)
on conflict (id) do nothing;

insert into public.social_links (id, platform, label, url, is_visible)
values
  ('00000000-0000-4000-8000-000000000015', 'GitHub', 'Uji', 'https://example.com/uji', true),
  ('00000000-0000-4000-8000-000000000016', 'Dribbble', 'Uji', 'https://example.com/uji2', false)
on conflict (id) do nothing;

insert into public.media_assets
  (id, project_id, certificate_id, site_profile_id, object_path, media_role, mime_type, alt_text)
values
  ('00000000-0000-4000-8000-000000000006',
   '00000000-0000-4000-8000-000000000002', null, null,
   'projects/uji-terbit/cover.webp', 'cover', 'image/webp', 'Sampul proyek terbit'),
  ('00000000-0000-4000-8000-000000000007',
   '00000000-0000-4000-8000-000000000003', null, null,
   'projects/uji-draft/galeri.webp', 'gallery', 'image/webp', 'Galeri proyek draft'),
  ('00000000-0000-4000-8000-000000000008',
   null, '00000000-0000-4000-8000-000000000004', null,
   'certificates/uji-terbit/dokumen.pdf', 'certificate_document', 'application/pdf', null),
  ('00000000-0000-4000-8000-000000000009',
   null, '00000000-0000-4000-8000-000000000005', null,
   'certificates/uji-draft/dokumen.pdf', 'certificate_document', 'application/pdf', null),
  ('00000000-0000-4000-8000-000000000010',
   null, null, current_setting('test.profile_id')::uuid,
   'profile/foto-uji.webp', 'profile_photo', 'image/webp', 'Foto profil')
on conflict (id) do nothing;

-- Daftarkan user uji sebagai admin.
-- 1) Ambil user_id dari auth.users berdasarkan email yang dikonfigurasi.
--    (Jangan mencari lewat note admin_users: note bebas diubah dan tidak unik.)
select set_config(
  'test.admin_id',
  coalesce(
    (select id::text from auth.users
      where email = current_setting('test.admin_email')),
    ''
  ),
  true
);

-- 2) Berhenti dengan pesan jelas bila akun Auth tidak ditemukan.
do $$
begin
  if coalesce(current_setting('test.admin_id', true), '') = '' then
    raise exception
      'Akun Auth dengan email % tidak ditemukan. Buat user tersebut di Authentication > Users (email terkonfirmasi), lalu jalankan ulang skrip ini.',
      current_setting('test.admin_email', true);
  end if;
end;
$$;

-- 3) Tambahkan ke allowlist hanya bila belum terdaftar. Untuk admin yang sudah
--    ada, ON CONFLICT DO NOTHING memastikan catatan/barisnya tidak berubah.
insert into public.admin_users (user_id)
values (current_setting('test.admin_id')::uuid)
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Prasyarat objek Storage (diunggah lewat Storage API / Dashboard)
-- ---------------------------------------------------------------------------
-- Skrip ini TIDAK membuat fixture lewat INSERT ke storage.objects. Baris di
-- tabel itu adalah metadata internal; menambahkannya langsung tidak membuat file
-- dan tidak membuktikan apa pun tentang isi bucket. (Satu-satunya percobaan
-- INSERT adalah probe T11 yang harus ditolak.)
--
-- Sebelum menjalankan skrip, unggah lima file berikut ke bucket `media` sebagai
-- admin (Dashboard > Storage, atau Storage API). Isinya boleh gambar/PDF kecil
-- apa pun yang valid; yang diuji adalah path dan status kontennya.
--
--   projects/uji-terbit/cover.webp        image/webp
--   projects/uji-draft/galeri.webp        image/webp
--   certificates/uji-terbit/dokumen.pdf   application/pdf
--   certificates/uji-draft/dokumen.pdf    application/pdf
--   profile/foto-uji.webp                 image/webp
--
-- Setelah pengujian, hapus kelima file lewat Dashboard/Storage API, misalnya
-- supabase.storage.from('media').remove([...path...]). Jangan menghapus baris
-- storage.objects dengan SQL.
--
-- Verifikasi prasyarat dijalankan sebagai admin agar file draft ikut terlihat.

select set_config(
  'request.jwt.claims',
  json_build_object('sub', current_setting('test.admin_id'), 'role', 'authenticated')::text,
  true
);
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

do $$
declare
  missing text;
begin
  missing := (
    select string_agg(e.object_name, ', ' order by e.object_name)
    from (values
      ('projects/uji-terbit/cover.webp'),
      ('projects/uji-draft/galeri.webp'),
      ('certificates/uji-terbit/dokumen.pdf'),
      ('certificates/uji-draft/dokumen.pdf'),
      ('profile/foto-uji.webp')
    ) as e (object_name)
    where not exists (
      select 1
      from storage.objects o
      where o.bucket_id = 'media'
        and o.name = e.object_name
    )
  );

  if missing is not null then
    raise exception
      'File uji tidak terlihat di bucket media: %. Unggah lewat Dashboard/Storage API (sebagai admin), lalu jalankan ulang skrip ini. Jika file sudah ada, periksa policy media_admin_manage_files.',
      missing;
  end if;
end;
$$;

reset role;

-- ===========================================================================
-- 3. PENGUNJUNG ANONIM
-- ===========================================================================

select set_config('request.jwt.claims', '', true);
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);
set local role anon;

select 'T1' as tes,
       'anon hanya melihat 1 proyek uji berstatus published' as harapan,
       count(*) = 1 as lulus,
       count(*) as hasil
from public.projects
where slug like 'uji-%';

select 'T2' as tes,
       'anon tidak melihat proyek draft' as harapan,
       count(*) = 0 as lulus,
       count(*) as hasil
from public.projects
where slug = 'uji-draft';

select 'T3' as tes,
       'anon melihat 1 sertifikat terbit dan 0 draft' as harapan,
       count(*) filter (where status = 'published') = 1
         and count(*) filter (where status = 'draft') = 0 as lulus,
       count(*) as hasil
from public.certificates
where title like 'Sertifikat Uji%';

select 'T4' as tes,
       'anon hanya melihat entri pendidikan/pengalaman/tautan yang is_visible' as harapan,
       (select count(*) from public.educations where institution like 'Institusi Uji%') = 1
       and (select count(*) from public.experiences where organization like 'Organisasi Uji%') = 1
       and (select count(*) from public.social_links where platform in ('GitHub', 'Dribbble')
              and label = 'Uji') = 1 as lulus;

select 'T5' as tes,
       'anon melihat 3 metadata media (sampul terbit, dokumen terbit, foto profil) dan tidak melihat 2 file draft' as harapan,
       count(*) = 3 as lulus,
       count(*) as hasil
from public.media_assets
where object_path like any (array[
  'projects/uji-terbit/%', 'projects/uji-draft/%',
  'certificates/uji-terbit/%', 'certificates/uji-draft/%',
  'profile/%'
]);

select 'T6' as tes,
       'anon hanya melihat 3 metadata objek yang diunggah untuk konten terbit' as harapan,
       count(*) = 3 as lulus,
       count(*) as hasil
from storage.objects
where bucket_id = 'media'
  and name in (
    'projects/uji-terbit/cover.webp',
    'projects/uji-draft/galeri.webp',
    'certificates/uji-terbit/dokumen.pdf',
    'certificates/uji-draft/dokumen.pdf',
    'profile/foto-uji.webp'
  );

select 'T7' as tes,
       'fungsi is_public_media: file terbit true, file draft false' as harapan,
       private.is_public_media('media', 'projects/uji-terbit/cover.webp') = true
       and private.is_public_media('media', 'projects/uji-draft/galeri.webp') = false
       and private.is_public_media('media', 'certificates/uji-draft/dokumen.pdf') = false as lulus;

-- T8: anon tidak boleh Insert.
do $$
begin
  insert into public.projects (slug, title, category, summary, description)
  values ('uji-anon-insert', 'Anon', 'coding', 'x', 'y');
  raise exception 'T8 GAGAL: anon berhasil INSERT proyek';
exception
  when insufficient_privilege then
    raise notice 'T8 LULUS: anon ditolak saat INSERT proyek';
end;
$$;

-- T9: anon tidak boleh Update.
do $$
begin
  update public.projects set title = 'Diubah anon' where slug = 'uji-terbit';
  raise exception 'T9 GAGAL: anon berhasil UPDATE proyek';
exception
  when insufficient_privilege then
    raise notice 'T9 LULUS: anon ditolak saat UPDATE proyek';
end;
$$;

-- T10: anon tidak boleh Delete.
do $$
begin
  delete from public.projects where slug = 'uji-terbit';
  raise exception 'T10 GAGAL: anon berhasil DELETE proyek';
exception
  when insufficient_privilege then
    raise notice 'T10 LULUS: anon ditolak saat DELETE proyek';
end;
$$;

-- T11: anon tidak boleh upload ke Storage.
-- Ini probe yang DIHARAPKAN GAGAL, bukan fixture: tidak ada file yang dibuat.
-- Jika ternyata berhasil, skrip sengaja berhenti dan seluruh transaksi
-- di-rollback, sehingga tidak meninggalkan metadata. Uji upload nyata tetap
-- dilakukan lewat Storage API (HTTP), lihat dokumen bagian 8.3.
do $$
begin
  insert into storage.objects (id, bucket_id, name)
  values ('00000000-0000-4000-8000-000000000199', 'media', 'projects/uji-anon/coba.webp');
  raise exception 'T11 GAGAL: anon berhasil INSERT objek Storage';
exception
  when insufficient_privilege then
    raise notice 'T11 LULUS: anon ditolak saat upload objek Storage';
end;
$$;

-- T12: anon tidak boleh membaca tabel admin_users sama sekali.
do $$
begin
  perform count(*) from public.admin_users;
  raise exception 'T12 GAGAL: anon bisa membaca admin_users';
exception
  when insufficient_privilege then
    raise notice 'T12 LULUS: anon ditolak saat membaca admin_users';
end;
$$;

reset role;

-- ===========================================================================
-- 4. USER LOGIN YANG BUKAN ADMIN
-- ===========================================================================
-- Subjek palsu ini tidak ada di admin_users, jadi statusnya non-admin.
-- Tidak perlu akun nyata karena tidak ada foreign key yang terlibat.

select set_config(
  'request.jwt.claims',
  '{"sub":"99999999-9999-4999-8999-999999999999","role":"authenticated"}',
  true
);
select set_config('request.jwt.claim.sub', '99999999-9999-4999-8999-999999999999', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select 'T13' as tes,
       'non-admin hanya melihat 1 proyek terbit (sama seperti anon)' as harapan,
       count(*) = 1 as lulus,
       count(*) as hasil
from public.projects
where slug like 'uji-%';

select 'T14' as tes,
       'non-admin tidak melihat baris admin_users selain miliknya' as harapan,
       count(*) = 0 as lulus,
       count(*) as hasil
from public.admin_users;

do $$
begin
  insert into public.projects (slug, title, category, summary, description)
  values ('uji-nonadmin-insert', 'Non-admin', 'coding', 'x', 'y');
  raise exception 'T15 GAGAL: user login non-admin berhasil INSERT proyek';
exception
  when insufficient_privilege then
    raise notice 'T15 LULUS: user login non-admin ditolak oleh RLS saat INSERT proyek';
end;
$$;

-- CATATAN PENTING: berbeda dari INSERT, UPDATE/DELETE yang ditolak RLS tidak
-- selalu menghasilkan error. PostgreSQL hanya menyaring baris sehingga 0 baris
-- terpengaruh (silent). Karena itu T16/T17 memeriksa jumlah baris terpengaruh,
-- bukan mengharapkan exception.

do $$
declare
  affected integer;
begin
  update public.projects set title = 'Diubah non-admin' where slug = 'uji-terbit';
  get diagnostics affected = row_count;

  if affected <> 0 then
    raise exception 'T16 GAGAL: user login non-admin berhasil UPDATE % baris', affected;
  end if;

  raise notice 'T16 LULUS: UPDATE oleh non-admin memengaruhi 0 baris';
end;
$$;

do $$
declare
  affected integer;
begin
  delete from public.projects where slug = 'uji-terbit';
  get diagnostics affected = row_count;

  if affected <> 0 then
    raise exception 'T17 GAGAL: user login non-admin berhasil DELETE % baris', affected;
  end if;

  raise notice 'T17 LULUS: DELETE oleh non-admin memengaruhi 0 baris';
end;
$$;

reset role;

-- ===========================================================================
-- 5. ADMIN YANG DISETUJUI
-- ===========================================================================

select set_config(
  'request.jwt.claims',
  json_build_object('sub', current_setting('test.admin_id'), 'role', 'authenticated')::text,
  true
);
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select 'T18' as tes,
       'admin melihat proyek terbit dan draft (2 proyek uji)' as harapan,
       count(*) = 2 as lulus,
       count(*) as hasil
from public.projects
where slug like 'uji-%';

select 'T19' as tes,
       'admin melihat baris admin_users miliknya sendiri' as harapan,
       count(*) = 1 as lulus,
       count(*) as hasil
from public.admin_users;

-- T20: insert sah oleh admin.
insert into public.projects (id, slug, title, category, summary, description, status)
values (
  '00000000-0000-4000-8000-000000000020',
  'uji-admin-baru', 'Proyek Baru Admin', 'desain-grafis',
  'Ringkasan uji', 'Deskripsi uji', 'published'
);

select 'T20' as tes,
       'admin dapat INSERT proyek dan published_at terisi otomatis' as harapan,
       count(*) = 1 and bool_and(published_at is not null) as lulus,
       count(*) as hasil
from public.projects
where slug = 'uji-admin-baru';

-- T21: update sah oleh admin.
update public.projects
set title = 'Proyek Baru Admin (diubah)'
where slug = 'uji-admin-baru';

select 'T21' as tes,
       'admin dapat UPDATE proyek' as harapan,
       count(*) = 1 as lulus,
       count(*) as hasil
from public.projects
where slug = 'uji-admin-baru' and title = 'Proyek Baru Admin (diubah)';

-- T22: slug duplikat ditolak.
do $$
begin
  insert into public.projects (slug, title, category, summary, description)
  values ('uji-terbit', 'Duplikat', 'coding', 'x', 'y');
  raise exception 'T22 GAGAL: slug duplikat diterima';
exception
  when unique_violation then
    raise notice 'T22 LULUS: slug duplikat ditolak (unique_violation)';
end;
$$;

-- T23: kolom wajib kosong ditolak.
do $$
begin
  insert into public.projects (slug, title, category, summary, description)
  values ('uji-judul-kosong', '   ', 'coding', 'x', 'y');
  raise exception 'T23 GAGAL: judul kosong diterima';
exception
  when check_violation then
    raise notice 'T23 LULUS: judul kosong ditolak (check_violation)';
end;
$$;

-- T24: kategori di luar daftar ditolak.
do $$
begin
  insert into public.projects (slug, title, category, summary, description)
  values ('uji-kategori-salah', 'Kategori Salah', 'memasak', 'x', 'y');
  raise exception 'T24 GAGAL: kategori tidak valid diterima';
exception
  when check_violation then
    raise notice 'T24 LULUS: kategori tidak valid ditolak (check_violation)';
end;
$$;

-- T25: format slug tidak valid ditolak.
do $$
begin
  insert into public.projects (slug, title, category, summary, description)
  values ('Slug Dengan Spasi', 'Slug Salah', 'coding', 'x', 'y');
  raise exception 'T25 GAGAL: slug tidak valid diterima';
exception
  when check_violation then
    raise notice 'T25 LULUS: slug tidak valid ditolak (check_violation)';
end;
$$;

-- T26: admin dapat menghapus.
delete from public.projects where slug = 'uji-admin-baru';
select 'T26' as tes,
       'admin dapat DELETE proyek' as harapan,
       count(*) = 0 as lulus,
       count(*) as hasil
from public.projects
where slug = 'uji-admin-baru';

reset role;

-- ===========================================================================
-- 6. TRANSISI DRAFT <-> PUBLISHED DAN VISIBILITAS METADATA FILE
-- ===========================================================================

-- T27: tarik publikasi proyek uji -> file sampul harus tertutup untuk anon.
update public.projects set status = 'draft' where slug = 'uji-terbit';
do $$
begin
  if (select published_at from public.projects where slug = 'uji-terbit') is null then
    raise exception 'T27 GAGAL: published_at hilang saat ditarik ke draft';
  end if;
end;
$$;

select set_config('request.jwt.claims', '', true);
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);
set local role anon;

select 'T28' as tes,
       'setelah proyek ditarik ke draft, metadata objek Storage sampul tidak terlihat anon' as harapan,
       count(*) = 0 as lulus,
       count(*) as hasil
from storage.objects
where bucket_id = 'media'
  and name = 'projects/uji-terbit/cover.webp';

select 'T29' as tes,
       'is_public_media(sampul) menjadi false setelah ditarik ke draft' as harapan,
       private.is_public_media('media', 'projects/uji-terbit/cover.webp') = false as lulus;

reset role;

-- T30: terbitkan kembali -> akses pulih.
update public.projects set status = 'published' where slug = 'uji-terbit';

select set_config('request.jwt.claims', '', true);
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);
set local role anon;

select 'T30' as tes,
       'setelah diterbitkan kembali, metadata objek Storage sampul terlihat anon lagi' as harapan,
       count(*) = 1 as lulus,
       count(*) as hasil
from storage.objects
where bucket_id = 'media'
  and name = 'projects/uji-terbit/cover.webp';

reset role;

-- T31: draft -> published mengisi published_at.
update public.projects set status = 'published' where slug = 'uji-draft';
select 'T31' as tes,
       'menerbitkan draft mengisi published_at' as harapan,
       published_at is not null as lulus
from public.projects
where slug = 'uji-draft';

-- ===========================================================================
-- 7. AUDIT GRANTS DAN STATUS RLS (sebagai pemilik tabel)
-- ===========================================================================

select 'T32' as tes,
       'grant minimum: anon SELECT saja, tanpa akses admin_users' as harapan,
       has_table_privilege('anon', 'public.projects', 'SELECT') = true
       and has_table_privilege('anon', 'public.projects', 'INSERT') = false
       and has_table_privilege('anon', 'public.projects', 'UPDATE') = false
       and has_table_privilege('anon', 'public.projects', 'DELETE') = false
       and has_table_privilege('anon', 'public.admin_users', 'SELECT') = false as lulus;

select 'T33' as tes,
       'authenticated punya grant tulis, tetapi tetap dibatasi RLS' as harapan,
       has_table_privilege('authenticated', 'public.projects', 'INSERT') = true
       and has_function_privilege('anon', 'private.is_admin()', 'EXECUTE') = false
       and has_function_privilege('anon', 'private.is_public_media(text,text)', 'EXECUTE') = true as lulus;

select 'T34' as tes,
       'RLS aktif pada semua tabel aplikasi' as harapan,
       (select count(*) = 8
          from pg_class c
          join pg_namespace n on n.oid = c.relnamespace
         where n.nspname = 'public'
           and c.relkind = 'r'
           and c.relrowsecurity
           and c.relname in (
             'site_profile', 'projects', 'certificates', 'educations',
             'experiences', 'social_links', 'media_assets', 'admin_users'
           )) as lulus;

-- ===========================================================================
-- 8. KONSISTENSI METADATA <-> OBJEK STORAGE (sebagai admin)
-- ===========================================================================
-- Dijalankan sebagai admin agar file draft ikut terlihat. Query yang sama juga
-- dipakai untuk membersihkan file yatim di Tahap 5.
-- Hanya MEMBACA metadata; tidak membuat atau mengubah objek Storage.

select set_config(
  'request.jwt.claims',
  json_build_object('sub', current_setting('test.admin_id'), 'role', 'authenticated')::text,
  true
);
select set_config('request.jwt.claim.sub', current_setting('test.admin_id'), true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select 'T35' as tes,
       'setiap metadata media uji punya objek Storage pasangannya' as harapan,
       count(*) = 0 as lulus,
       count(*) as jumlah_tanpa_file
from public.media_assets ma
left join storage.objects o
  on o.bucket_id = ma.bucket_id and o.name = ma.object_path
where ma.bucket_id = 'media'
  and ma.object_path in (
    'projects/uji-terbit/cover.webp',
    'projects/uji-draft/galeri.webp',
    'certificates/uji-terbit/dokumen.pdf',
    'certificates/uji-draft/dokumen.pdf',
    'profile/foto-uji.webp'
  )
  and o.id is null;

select 'T36' as tes,
       'setiap objek Storage uji punya baris media_assets (tidak ada file yatim)' as harapan,
       count(*) = 0 as lulus,
       count(*) as jumlah_yatim
from storage.objects o
left join public.media_assets ma
  on ma.bucket_id = o.bucket_id and ma.object_path = o.name
where o.bucket_id = 'media'
  and (
    o.name like 'projects/uji-%'
    or o.name like 'certificates/uji-%'
    or o.name = 'profile/foto-uji.webp'
  )
  and ma.id is null;

reset role;

rollback;

-- =============================================================================
-- CATATAN HASIL
-- =============================================================================
-- T1–T7   : visibilitas baca publik (baris dan file draft harus 0).
-- T8–T12  : operasi tulis anon dan akses admin_users.
-- T13–T17 : user login non-admin (uji utama: login != admin).
-- T18–T26 : operasi sah admin dan validasi constraint.
-- T27–T31 : transisi status dan dampaknya pada visibilitas metadata file.
--           Akses file nyata (signed URL/unduh) diuji lewat HTTP, bukan di sini.
-- T32–T34 : grants dan status RLS (bukan policy).
-- T35–T36 : konsistensi metadata media_assets dengan objek Storage.
--
-- Cara membaca:
--   - Selesai tanpa error SQL hanya berarti skrip berhasil dijalankan.
--   - Baris dengan lulus=false adalah kegagalan; periksa semuanya.
--   - NOTICE ... LULUS = lulus; raise exception ... GAGAL = skrip berhenti.
--
-- Yang TIDAK diuji skrip ini:
--   - Bahwa file benar-benar dapat/tidak dapat diunduh. T6/T28/T30/T35/T36
--     hanya membaca metadata; gunakan uji HTTP (dokumen 8.3) untuk signed URL,
--     unduhan, dan upload nyata.
--   - H9 (signed URL lama masih berlaku sampai kedaluwarsa) dan H10 (permintaan
--     signed URL BARU setelah draft harus ditolak) — keduanya uji HTTP.
--   - Apakah schema private terekspos ke Data API (O1–O3 di dokumen 8.4).
--   - Policy lama yang permisif pada storage.objects (audit di dokumen 7.3).
--   - Upload lewat SDK dengan validasi tipe/ukuran dan metadata storage.
--   - Penghapusan file yatim setelah konten dihapus (perlu Storage API).
-- =============================================================================
