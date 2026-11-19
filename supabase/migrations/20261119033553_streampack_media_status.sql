create table public.streampack_media_status (
  asset_id text primary key,
  status text not null check (status in ('visible','hidden','deleted')),
  updated_at timestamptz not null default now()
);
alter table public.streampack_media_status enable row level security;
revoke all on table public.streampack_media_status from public, anon, authenticated, service_role;
grant select, insert, update on table public.streampack_media_status to service_role;
