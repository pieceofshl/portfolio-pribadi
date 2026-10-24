-- =============================================================================
-- TAHAP 2 — GRANTS, IDENTITAS ADMIN, DAN RLS POLICY
-- =============================================================================
-- File ini adalah RANCANGAN yang belum pernah dijalankan pada database mana pun.
--
-- Urutan kerja:
--   1. Schema `private` untuk fungsi bantu (tidak diekspos sebagai API).
--   2. private.is_admin()  -> satu-satunya penentu "apakah user ini admin".
--   3. private.is_public_media() -> dipakai policy Storage.
--   4. GRANTS eksplisit per tabel dan per operasi.
--   5. RLS POLICY baca publik + tulis admin.
--
-- Prinsip:
--   - Login saja TIDAK memberi hak admin.
--   - Status admin hanya dibaca dari tabel public.admin_users di database,
--     tidak pernah dari nilai yang dikirim browser.
--   - anon hanya punya SELECT (dan hanya pada baris/kolom publik).
--   - authenticated non-admin mendapat tampilan yang sama dengan anon.
--   - Semua operasi tulis mensyaratkan private.is_admin().
--
-- Penting: pemilik tabel (role yang menjalankan migration, biasanya `postgres`)
-- selalu melewati RLS. Jadi hasil query di SQL Editor bukan bukti policy bekerja.
-- Gunakan `set role anon;` / `set role authenticated;` saat menguji.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. Schema `private` untuk fungsi internal
-- ---------------------------------------------------------------------------
-- Fungsi bantu TIDAK diletakkan di schema `public` karena semua yang ada di
-- `public` bisa dipanggil lewat API (/rest/v1/rpc/...). Cukup beri hak pakai
-- schema (USAGE) + hak eksekusi fungsi, tanpa memberi akses ke tabel mana pun.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;


-- ---------------------------------------------------------------------------
-- 2. private.is_admin() — penentu identitas admin
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER membuat fungsi ini membaca admin_users sebagai pemilik
-- fungsi, sehingga RLS pada admin_users tidak menghalangi pengecekan.
-- `set search_path = ''` + nama tabel yang selalu disertai schema mencegah
-- penyerang mengarahkan fungsi ke tabel lain.
--
-- JANGAN menjalankan `alter table public.admin_users force row level security`.
-- Dengan FORCE, pemilik tabel pun tunduk pada RLS dan fungsi ini akan selalu
-- mengembalikan false.

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$function$;

comment on function private.is_admin() is
  'True hanya jika auth.uid() terdaftar di public.admin_users. Dipakai semua policy tulis.';

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;
-- anon sengaja TIDAK diberi EXECUTE: pengunjung tidak perlu dan tidak boleh
-- memanggil fungsi ini, bahkan hanya untuk melihat hasilnya.


-- ---------------------------------------------------------------------------
-- 3. private.is_public_media(bucket, path) — penentu file boleh dibaca publik
-- ---------------------------------------------------------------------------
-- File boleh dibaca publik jika:
--   - terdaftar di media_assets, DAN
--   - konten pemiliknya berstatus published (proyek/sertifikat), ATAU
--   - file itu foto profil (profil selalu publik).
--
-- Karena definer, fungsi ini bisa membaca media_assets tanpa terpengaruh RLS.
-- Fungsi hanya mengembalikan boolean, bukan isi baris, sehingga tidak membocorkan
-- data draft.

create or replace function private.is_public_media(p_bucket text, p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.media_assets ma
    left join public.projects p on p.id = ma.project_id
    left join public.certificates c on c.id = ma.certificate_id
    where ma.bucket_id = p_bucket
      and ma.object_path = p_name
      and (
        (ma.project_id is not null and p.status = 'published')
        or (ma.certificate_id is not null and c.status = 'published')
        or ma.media_role = 'profile_photo'
      )
  );
$function$;

comment on function private.is_public_media(text, text) is
  'True jika file terdaftar dan konten pemiliknya terbit (atau foto profil).';

revoke all on function private.is_public_media(text, text) from public;
grant execute on function private.is_public_media(text, text) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- 4. GRANTS
-- ---------------------------------------------------------------------------
-- RLS menentukan BARIS mana yang boleh disentuh; GRANT menentukan OPERASI dan
-- KOLOM mana yang boleh dipanggil sama sekali. Keduanya harus benar.
--
-- Migration 01 sudah mencabut semua hak anon/authenticated. Di sini hak
-- diberikan ulang seminimal mungkin. Grant diberikan per pernyataan (bukan
-- `grant all`) agar mudah ditinjau.

-- 4.1 site_profile: publik membaca, admin mengubah (tidak ada insert/delete).
grant select on table public.site_profile to anon;
grant select, update on table public.site_profile to authenticated;

-- 4.2 projects
grant select on table public.projects to anon;
grant select, insert, update, delete on table public.projects to authenticated;

-- 4.3 certificates
grant select on table public.certificates to anon;
grant select, insert, update, delete on table public.certificates to authenticated;

-- 4.4 educations
grant select on table public.educations to anon;
grant select, insert, update, delete on table public.educations to authenticated;

-- 4.5 experiences
grant select on table public.experiences to anon;
grant select, insert, update, delete on table public.experiences to authenticated;

-- 4.6 social_links
grant select on table public.social_links to anon;
grant select, insert, update, delete on table public.social_links to authenticated;

-- 4.7 media_assets: metadata file ikut dibaca publik agar path/alt/urutan
--     galeri bisa dirender. Baris yang terlihat tetap dibatasi policy di bawah.
grant select on table public.media_assets to anon;
grant select, insert, update, delete on table public.media_assets to authenticated;

-- 4.8 admin_users: hanya user yang login, dan hanya barisnya sendiri.
--     Tidak ada grant INSERT/UPDATE/DELETE untuk siapa pun lewat API.
grant select on table public.admin_users to authenticated;


-- ---------------------------------------------------------------------------
-- 5. RLS POLICY — BACA PUBLIK
-- ---------------------------------------------------------------------------
-- Policy ini berlaku untuk anon DAN authenticated. Artinya user login yang
-- bukan admin hanya melihat apa yang dilihat pengunjung biasa.

create policy site_profile_public_read
  on public.site_profile
  for select
  to anon, authenticated
  using (true);

create policy projects_public_read
  on public.projects
  for select
  to anon, authenticated
  using (status = 'published');

create policy certificates_public_read
  on public.certificates
  for select
  to anon, authenticated
  using (status = 'published');

create policy educations_public_read
  on public.educations
  for select
  to anon, authenticated
  using (is_visible);

create policy experiences_public_read
  on public.experiences
  for select
  to anon, authenticated
  using (is_visible);

create policy social_links_public_read
  on public.social_links
  for select
  to anon, authenticated
  using (is_visible);

-- Metadata media hanya terlihat bila konten pemiliknya publik. Ini juga yang
-- mencegah pengunjung menemukan path file draft lewat API tabel.
create policy media_assets_public_read
  on public.media_assets
  for select
  to anon, authenticated
  using (
    (media_role = 'profile_photo')
    or (
      project_id is not null
      and exists (
        select 1
        from public.projects p
        where p.id = media_assets.project_id
          and p.status = 'published'
      )
    )
    or (
      certificate_id is not null
      and exists (
        select 1
        from public.certificates c
        where c.id = media_assets.certificate_id
          and c.status = 'published'
      )
    )
  );


-- ---------------------------------------------------------------------------
-- 6. RLS POLICY — ADMIN
-- ---------------------------------------------------------------------------
-- `for all` mencakup SELECT, INSERT, UPDATE, DELETE.
--   USING      -> baris mana yang boleh dibaca/diubah/dihapus
--   WITH CHECK -> baris hasil INSERT/UPDATE harus lolos pemeriksaan ini
-- Tanpa policy ini, user login non-admin tidak punya policy tulis sama sekali,
-- sehingga INSERT/UPDATE/DELETE ditolak walaupun grant-nya ada.

create policy site_profile_admin_update
  on public.site_profile
  for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy projects_admin_all
  on public.projects
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy certificates_admin_all
  on public.certificates
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy educations_admin_all
  on public.educations
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy experiences_admin_all
  on public.experiences
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy social_links_admin_all
  on public.social_links
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy media_assets_admin_all
  on public.media_assets
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Admin boleh membaca barisnya sendiri (dipakai UI untuk menampilkan menu admin).
-- Tidak ada policy tulis: daftar admin hanya berubah lewat SQL Editor.
create policy admin_users_read_self
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));
