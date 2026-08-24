-- ============================================================
-- BD birthday site — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================

create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ip text,
  country text,
  country_code text,
  region text,
  region_code text,
  city text,
  postal text,
  latitude double precision,
  longitude double precision,
  latitude_precise double precision,
  longitude_precise double precision,
  accuracy double precision,
  timezone text,
  utc_offset text,
  isp text,
  org text,
  asn text,
  connection_type text,
  currency text,
  languages text,
  user_agent text,
  browser text,
  browser_version text,
  os text,
  os_version text,
  device_type text,
  device_vendor text,
  device_model text,
  platform text,
  screen_width int,
  screen_height int,
  viewport_width int,
  viewport_height int,
  device_pixel_ratio double precision,
  color_depth int,
  language text,
  languages_arr text[],
  touch_points int,
  hardware_concurrency int,
  device_memory double precision,
  network_type text,
  network_downlink double precision,
  network_rtt int,
  network_save_data boolean,
  cookie_enabled boolean,
  do_not_track text,
  referrer text,
  online boolean,
  webdriver boolean,
  orientation text,
  ua_brands text,
  ua_mobile boolean,
  ua_platform text,
  ua_model text,
  ua_full_version text,
  ua_platform_version text,
  ua_arch text,
  ua_bitness text,
  client_hints jsonb,
  raw_client jsonb,
  geo_raw jsonb,
  created_at timestamptz default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references visits(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

create table if not exists feelings (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references visits(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

alter table visits enable row level security;
alter table answers enable row level security;
alter table feelings enable row level security;

create policy "anon insert visits" on visits for insert to anon with check (true);
create policy "anon insert answers" on answers for insert to anon with check (true);
create policy "anon insert feelings" on feelings for insert to anon with check (true);
