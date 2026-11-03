-- Independent project: reusable media, editorial writes only through server functions.
create table if not exists public.gears_media (
  id text primary key check (id in ('intro','background','outro')),
  path text not null unique,
  bytes bigint not null check (bytes > 0),
  updated_at timestamptz not null default now()
);
create table if not exists public.gears_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 3 and 250),
  description text not null default '',
  audio_path text not null unique,
  audio_bytes bigint not null check (audio_bytes > 0),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.gears_media enable row level security;
alter table public.gears_episodes enable row level security;
grant select on public.gears_media, public.gears_episodes to anon, authenticated;
grant all on public.gears_media, public.gears_episodes to service_role;
create policy "Read shared Gears media" on public.gears_media for select to anon, authenticated using (true);
create policy "Read published Gears episodes" on public.gears_episodes for select to anon, authenticated using (status = 'published' and published_at <= now());
create index gears_episodes_published on public.gears_episodes (published_at desc) where status='published';
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('gears-media','gears-media',true,52428800,array['video/mp4','audio/mpeg'])
on conflict (id) do nothing;
-- Public delivery uses bucket URLs. No client INSERT/UPDATE/DELETE policies:
-- admin server issues short-lived signed uploads after checking the editorial password.
