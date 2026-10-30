-- The Soul Nation: independent database for the production website.
-- Run once in YOUR OWN Supabase project: SQL Editor -> New query -> Run.
-- Security model: public read-only tables; writes only through service_role
-- and password-protected server functions in Cloudflare Workers.
-- Do not share your service_role/secret key.
create extension if not exists pgcrypto;

create table if not exists public.roster_members (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  category text not null check (category in ('crew','legends','killers')),
  sort_order integer not null default 0
);
create index if not exists roster_members_category_order_idx on public.roster_members(category,sort_order);

create table if not exists public.waves_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  redes text not null default '',
  bio text not null default '',
  photo_url text not null default '',
  social_label text,
  social_href text,
  sort_order integer not null default 0
);
create index if not exists waves_members_sort_idx on public.waves_members(sort_order);

create table if not exists public.waves_socials (
  name text primary key,
  tiktok_url text,
  twitch_url text,
  youtube_url text,
  x_url text,
  facebook_url text,
  photo_url text,
  bio text,
  redes text,
  updated_at timestamptz default now()
);

create table if not exists public.waves_hidden (
  name text primary key
);

alter table public.roster_members enable row level security;
alter table public.waves_members enable row level security;
alter table public.waves_socials enable row level security;
alter table public.waves_hidden enable row level security;

-- Public pages need roster and profile metadata, but visitors cannot write.
drop policy if exists "Public read roster" on public.roster_members;
create policy "Public read roster" on public.roster_members for select to anon, authenticated using (true);
drop policy if exists "Public read wave members" on public.waves_members;
create policy "Public read wave members" on public.waves_members for select to anon, authenticated using (true);
drop policy if exists "Public read wave profiles" on public.waves_socials;
create policy "Public read wave profiles" on public.waves_socials for select to anon, authenticated using (true);
drop policy if exists "Public read hidden status" on public.waves_hidden;
create policy "Public read hidden status" on public.waves_hidden for select to anon, authenticated using (true);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('wave-photos','wave-photos',true,5242880,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
set public=excluded.public, file_size_limit=excluded.file_size_limit,
    allowed_mime_types=excluded.allowed_mime_types;

-- Stored portraits must be publicly readable. No public upload/delete policy.
drop policy if exists "Public read Wave photos" on storage.objects;
create policy "Public read Wave photos" on storage.objects
for select to anon, authenticated using (bucket_id='wave-photos');
