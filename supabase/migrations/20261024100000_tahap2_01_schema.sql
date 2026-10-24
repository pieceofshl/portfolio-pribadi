-- =============================================================================
-- TAHAP 2 — SKEMA INTI DATABASE PORTOFOLIO
-- =============================================================================
-- File ini adalah RANCANGAN yang belum pernah dijalankan pada database mana pun.
--
-- Isi file:
--   1. Tabel, foreign key, constraint, indeks, dan trigger.
--   2. Row Level Security (RLS) diaktifkan pada setiap tabel yang dibuat.
--      Pada tahap file ini, BELUM ada policy -> semua akses lewat API ditolak.
--      Policy dan grants ditambahkan di file 20261024100100_tahap2_02_access_control.sql.
--   3. Semua hak akses anon/authenticated dicabut lebih dulu. Ini penting karena
--      pada beberapa project Supabase, tabel baru masih mendapat grant otomatis.
--
-- File ini TIDAK memakai BEGIN/COMMIT karena Supabase CLI sudah menjalankan
-- setiap migration di dalam satu transaksi. Jangan mengubah file migration yang
-- sudah pernah diterapkan; buat migration baru bila perlu perbaikan.
--
-- Catatan: tabel otomatis dimiliki oleh role yang menjalankan migration
-- (biasanya `postgres`). Pemilik tabel melewati RLS, jadi query di Supabase SQL
-- Editor TIDAK membuktikan policy bekerja. Uji dengan `set role anon`.
--
-- File ini mengandaikan project Supabase, karena memakai role `anon` dan
-- `authenticated` yang disediakan Supabase. Pada PostgreSQL biasa, role
-- tersebut belum ada sehingga migration akan gagal (dan itu disengaja).
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 0. Fungsi bantu: perbarui kolom updated_at pada setiap UPDATE
-- ---------------------------------------------------------------------------
-- Mengapa perlu: kalau mengandalkan frontend, pasti ada satu jalur update yang
-- lupa mengisi updated_at. Trigger membuat nilai ini konsisten.
-- `set search_path = ''` mencegah serangan search_path pada fungsi.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := now();
  return new;
end;
$function$;

comment on function public.set_updated_at() is
  'Trigger helper: mengisi updated_at dengan waktu sekarang pada setiap UPDATE.';


-- ---------------------------------------------------------------------------
-- 1. site_profile — satu profil pemilik website
-- ---------------------------------------------------------------------------
-- Tujuan: sumber data nama, headline, bio, email publik, dan keahlian.
-- Hanya boleh ada SATU baris. Caranya: kolom `is_primary` hanya boleh bernilai
-- true dan diberi UNIQUE, sehingga baris kedua pasti ditolak database.

create table public.site_profile (
  id           uuid primary key default gen_random_uuid(),
  is_primary   boolean not null default true,
  name         text not null,
  initials     text,
  headline     text not null,
  bio          text not null,
  location     text,
  email        text not null,
  availability text,
  skills       text[] not null default '{}'::text[],
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint site_profile_single_row
    unique (is_primary),
  constraint site_profile_is_primary_true
    check (is_primary),
  constraint site_profile_name_not_blank
    check (char_length(btrim(name)) between 1 and 120),
  constraint site_profile_initials_length
    check (initials is null or char_length(btrim(initials)) between 1 and 4),
  constraint site_profile_headline_not_blank
    check (char_length(btrim(headline)) between 1 and 160),
  constraint site_profile_bio_not_blank
    check (char_length(btrim(bio)) between 1 and 2000),
  constraint site_profile_location_length
    check (location is null or char_length(btrim(location)) between 1 and 120),
  constraint site_profile_email_format
    check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint site_profile_availability_length
    check (availability is null or char_length(btrim(availability)) between 1 and 160),
  constraint site_profile_skills_count
    check (cardinality(skills) <= 30)
);

comment on table public.site_profile is
  'Profil tunggal pemilik website. Dibatasi satu baris lewat unique(is_primary).';
comment on column public.site_profile.skills is
  'Daftar keahlian sederhana (array teks), urutan mengikuti isi array.';

alter table public.site_profile enable row level security;
revoke all on table public.site_profile from anon, authenticated;

create trigger site_profile_set_updated_at
  before update on public.site_profile
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 2. projects — karya/konten portofolio
-- ---------------------------------------------------------------------------
-- `description` disimpan sebagai satu teks. Paragraf dipisahkan baris kosong
-- (dua newline). Model dummy frontend memakai string[], jadi Tahap 3 cukup
-- memecah teks ini saat render.
-- `published_at` dipakai untuk urutan "proyek terbaru" (F-01).

create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  title        text not null,
  category     text not null,
  year         smallint,
  summary      text not null,
  description  text not null,
  demo_url     text,
  repo_url     text,
  video_url    text,
  status       text not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint projects_slug_unique
    unique (slug),
  constraint projects_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 1 and 80),
  constraint projects_title_not_blank
    check (char_length(btrim(title)) between 1 and 200),
  constraint projects_category_valid
    check (category in (
      'coding', 'ilustrasi', 'motion', 'desain-grafis',
      'fotografi', 'videografi', 'lainnya'
    )),
  constraint projects_year_valid
    check (year is null or year between 1950 and 2100),
  constraint projects_summary_not_blank
    check (char_length(btrim(summary)) between 1 and 600),
  constraint projects_description_not_blank
    check (char_length(btrim(description)) between 1 and 20000),
  constraint projects_demo_url_format
    check (demo_url is null or demo_url ~* '^https?://[^[:space:]]+$'),
  constraint projects_repo_url_format
    check (repo_url is null or repo_url ~* '^https?://[^[:space:]]+$'),
  constraint projects_video_url_format
    check (video_url is null or video_url ~* '^https?://[^[:space:]]+$'),
  constraint projects_status_valid
    check (status in ('draft', 'published'))
);

comment on table public.projects is
  'Proyek portofolio. Hanya baris status=published yang boleh dibaca publik.';
comment on column public.projects.slug is
  'Bagian URL publik /portofolio/:slug. Unik dan hanya huruf kecil, angka, tanda hubung.';
comment on column public.projects.published_at is
  'Diisi trigger saat status berubah menjadi published. Tetap disimpan ketika ditarik ke draft.';

alter table public.projects enable row level security;
revoke all on table public.projects from anon, authenticated;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Mengisi published_at hanya pada saat transisi ke published.
-- Dipisah per TG_OP agar tidak menyentuh OLD pada INSERT.
create or replace function public.set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if tg_op = 'INSERT' then
    if new.status = 'published' then
      new.published_at := coalesce(new.published_at, now());
    end if;
  elsif tg_op = 'UPDATE' then
    if new.status = 'published' and old.status is distinct from 'published' then
      new.published_at := now();
    end if;
  end if;

  return new;
end;
$function$;

comment on function public.set_published_at() is
  'Mengisi published_at saat konten pertama kali diterbitkan, tanpa menimpanya saat disimpan ulang.';

create trigger projects_set_published_at
  before insert or update on public.projects
  for each row execute function public.set_published_at();


-- ---------------------------------------------------------------------------
-- 3. certificates — sertifikat
-- ---------------------------------------------------------------------------
-- Tanggal boleh kosong karena PRD menyebut "tanggal/tahun bila diketahui".
-- PDF dokumen disimpan di media_assets, bukan kolom terpisah.

create table public.certificates (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null,
  issued_on      date,
  credential_url text,
  status         text not null default 'draft',
  published_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint certificates_title_not_blank
    check (char_length(btrim(title)) between 1 and 200),
  constraint certificates_issuer_not_blank
    check (char_length(btrim(issuer)) between 1 and 200),
  constraint certificates_credential_url_format
    check (credential_url is null or credential_url ~* '^https?://[^[:space:]]+$'),
  constraint certificates_status_valid
    check (status in ('draft', 'published'))
);

comment on table public.certificates is
  'Sertifikat. Hanya baris status=published yang boleh dibaca publik.';

alter table public.certificates enable row level security;
revoke all on table public.certificates from anon, authenticated;

create trigger certificates_set_updated_at
  before update on public.certificates
  for each row execute function public.set_updated_at();

create trigger certificates_set_published_at
  before insert or update on public.certificates
  for each row execute function public.set_published_at();


-- ---------------------------------------------------------------------------
-- 4. educations — riwayat pendidikan
-- ---------------------------------------------------------------------------
-- Tahun (bukan tanggal) karena pendidikan lazim ditulis dalam rentang tahun.
-- end_year NULL berarti "masih berjalan" dan ditampilkan sebagai "Sekarang".

create table public.educations (
  id          uuid primary key default gen_random_uuid(),
  institution text not null,
  program     text not null,
  start_year  smallint not null,
  end_year    smallint,
  summary     text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint educations_institution_not_blank
    check (char_length(btrim(institution)) between 1 and 200),
  constraint educations_program_not_blank
    check (char_length(btrim(program)) between 1 and 160),
  constraint educations_start_year_valid
    check (start_year between 1950 and 2100),
  constraint educations_end_year_valid
    check (end_year is null or end_year between start_year and 2100),
  constraint educations_summary_length
    check (summary is null or char_length(btrim(summary)) between 1 and 1000)
);

comment on table public.educations is
  'Riwayat pendidikan. is_visible=false menyembunyikan entri dari publik.';
comment on column public.educations.sort_order is
  'Urutan tampil naik (kecil lebih dulu). Nilai sama diurutkan berdasarkan start_year terbaru.';

alter table public.educations enable row level security;
revoke all on table public.educations from anon, authenticated;

create trigger educations_set_updated_at
  before update on public.educations
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 5. experiences — pengalaman kerja/organisasi
-- ---------------------------------------------------------------------------
-- Tanggal (bukan tahun) karena pengalaman sering berbulan-bulan dan PRD meminta
-- urutan waktu yang konsisten. end_date NULL berarti "masih berjalan".

create table public.experiences (
  id           uuid primary key default gen_random_uuid(),
  organization text not null,
  role         text not null,
  start_date   date not null,
  end_date     date,
  summary      text,
  sort_order   integer not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint experiences_organization_not_blank
    check (char_length(btrim(organization)) between 1 and 200),
  constraint experiences_role_not_blank
    check (char_length(btrim(role)) between 1 and 160),
  constraint experiences_start_date_valid
    check (start_date >= date '1950-01-01'),
  constraint experiences_end_date_valid
    check (end_date is null or end_date >= start_date),
  constraint experiences_summary_length
    check (summary is null or char_length(btrim(summary)) between 1 and 1000)
);

comment on table public.experiences is
  'Pengalaman kerja/organisasi. end_date NULL berarti masih berjalan.';

alter table public.experiences enable row level security;
revoke all on table public.experiences from anon, authenticated;

create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 6. social_links — tautan sosial di halaman kontak/footer
-- ---------------------------------------------------------------------------
-- label boleh kosong; UI memakai nama platform sebagai cadangan.

create table public.social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,
  label      text,
  url        text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint social_links_platform_not_blank
    check (char_length(btrim(platform)) between 1 and 60),
  constraint social_links_label_length
    check (label is null or char_length(btrim(label)) between 1 and 120),
  constraint social_links_url_format
    check (url ~* '^https?://[^[:space:]]+$' and char_length(url) <= 2048)
);

comment on table public.social_links is
  'Tautan sosial. is_visible=false dan sort_order mengatur tampilan publik.';

alter table public.social_links enable row level security;
revoke all on table public.social_links from anon, authenticated;

create trigger social_links_set_updated_at
  before update on public.social_links
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 7. media_assets — daftar resmi file di Storage
-- ---------------------------------------------------------------------------
-- Ini "buku catatan" yang menghubungkan file Storage dengan konten pemiliknya.
-- Tanpa tabel ini, aturan akses file hanya bisa menebak dari nama folder dan
-- tidak tahu apakah file milik konten draft atau terbit.
--
-- Satu baris = satu file, dimiliki TEPAT SATU konten (dijaga constraint
-- num_nonnulls = 1). Karena itu file tidak pernah dipakai bersama dua konten,
-- sehingga penghapusan file saat konten dihapus tidak berisiko menghapus file
-- milik konten lain.

create table public.media_assets (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid references public.projects (id) on delete cascade,
  certificate_id uuid references public.certificates (id) on delete cascade,
  site_profile_id uuid references public.site_profile (id) on delete cascade,
  bucket_id      text not null default 'media',
  object_path    text not null,
  media_role     text not null,
  mime_type      text not null,
  size_bytes     bigint,
  alt_text       text,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint media_assets_object_unique
    unique (bucket_id, object_path),
  constraint media_assets_one_owner
    check (num_nonnulls(project_id, certificate_id, site_profile_id) = 1),
  constraint media_assets_role_valid
    check (media_role in ('profile_photo', 'cover', 'gallery', 'certificate_document')),
  constraint media_assets_role_matches_owner
    check (
      (media_role = 'profile_photo' and site_profile_id is not null)
      or (media_role = 'cover' and project_id is not null)
      or (media_role = 'gallery' and project_id is not null)
      or (media_role = 'certificate_document' and certificate_id is not null)
    ),
  constraint media_assets_mime_valid
    check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf')),
  constraint media_assets_mime_matches_role
    check (
      (media_role = 'certificate_document' and mime_type = 'application/pdf')
      or (
        media_role <> 'certificate_document'
        and mime_type in ('image/jpeg', 'image/png', 'image/webp')
      )
    ),
  constraint media_assets_path_not_blank
    check (char_length(btrim(object_path)) between 1 and 400),
  constraint media_assets_path_relative
    check (object_path !~ '^/'),
  constraint media_assets_size_positive
    check (size_bytes is null or size_bytes > 0),
  constraint media_assets_alt_text_length
    check (alt_text is null or char_length(btrim(alt_text)) between 1 and 300)
);

comment on table public.media_assets is
  'Registry file Storage. Menentukan file mana yang publik berdasarkan status konten pemiliknya.';
comment on column public.media_assets.object_path is
  'Path lengkap di dalam bucket, tanpa garis miring di awal. Contoh: projects/<uuid>/cover.webp';

alter table public.media_assets enable row level security;
revoke all on table public.media_assets from anon, authenticated;

create trigger media_assets_set_updated_at
  before update on public.media_assets
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 8. admin_users — daftar admin yang disetujui
-- ---------------------------------------------------------------------------
-- Satu-satunya sumber kebenaran "siapa admin". user_id menunjuk ke akun
-- Supabase Auth, bukan email yang bisa diubah dari browser.
-- Tidak ada policy INSERT/UPDATE/DELETE: daftar admin hanya diubah lewat SQL
-- Editor/dashboard oleh pemilik project, bukan lewat aplikasi.

create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allowlist admin. Hanya berisi user_id dari auth.users; tidak dapat diubah lewat API.';

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;


-- ---------------------------------------------------------------------------
-- 9. Indeks
-- ---------------------------------------------------------------------------
-- Indeks dibuat sesuai pola query yang dipakai halaman publik dan admin.
-- Jangan menambah indeks sebelum ada query yang benar-benar membutuhkannya.

-- Daftar & beranda: proyek terbit, terbaru dulu.
create index projects_public_feed_idx
  on public.projects (published_at desc nulls last)
  where status = 'published';

-- Filter kategori di /portofolio.
create index projects_public_category_idx
  on public.projects (category, published_at desc nulls last)
  where status = 'published';

-- Daftar admin: campuran draft & terbit, terbaru diubah.
create index projects_admin_list_idx
  on public.projects (status, updated_at desc);

create index certificates_public_feed_idx
  on public.certificates (issued_on desc nulls last)
  where status = 'published';

create index certificates_admin_list_idx
  on public.certificates (status, updated_at desc);

create index educations_public_order_idx
  on public.educations (sort_order, start_year desc)
  where is_visible;

create index experiences_public_order_idx
  on public.experiences (sort_order, start_date desc)
  where is_visible;

create index social_links_public_order_idx
  on public.social_links (sort_order, platform)
  where is_visible;

create index media_assets_project_idx
  on public.media_assets (project_id);
create index media_assets_certificate_idx
  on public.media_assets (certificate_id);
create index media_assets_site_profile_idx
  on public.media_assets (site_profile_id);

-- Satu sampul per proyek, satu foto profil, satu dokumen per sertifikat.
create unique index media_assets_one_cover_idx
  on public.media_assets (project_id)
  where media_role = 'cover';
create unique index media_assets_one_profile_photo_idx
  on public.media_assets (site_profile_id)
  where media_role = 'profile_photo';
create unique index media_assets_one_certificate_document_idx
  on public.media_assets (certificate_id)
  where media_role = 'certificate_document';
