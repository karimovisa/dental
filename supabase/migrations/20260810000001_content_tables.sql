-- Content management: every remaining public-site content type becomes an
-- editable table. Public (anon) reads only PUBLISHED rows; the signed-in dentist
-- manages everything. Mirrors the pattern already used for doctors/services.

-- CERTIFICATES (accreditations gallery — lightbox images)
create table certificates (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- REVIEWS (patient testimonials)
create table reviews (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  rating int check (rating between 1 and 5),
  text text,
  photo_url text,
  source text,                       -- 'google' | 'instagram' | 'manual' | ...
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- BEFORE / AFTER CASES (treatment result comparisons)
create table before_after_cases (
  id uuid primary key default gen_random_uuid(),
  caption text,
  before_image_url text not null,
  after_image_url text not null,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- GALLERY IMAGES (clinic / team photos)
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  caption text,
  image_url text not null,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- FAQS (accordion)
create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  display_order int not null default 0
);

-- CLINIC SETTINGS: branding, contact + socials so the header/footer, contact
-- block and map are all editable — nothing about the chrome stays hardcoded.
alter table clinic_settings
  add column if not exists tagline text,
  add column if not exists email text,
  add column if not exists map_embed_url text,
  add column if not exists working_hours jsonb,
  add column if not exists logo_url text,
  add column if not exists telegram_url text,
  add column if not exists instagram_url text,
  add column if not exists facebook_url text;

-- RLS: public reads published content; signed-in dentist manages all.
alter table certificates        enable row level security;
alter table reviews             enable row level security;
alter table before_after_cases  enable row level security;
alter table gallery_images      enable row level security;
alter table faqs                enable row level security;

create policy "public read certificates"  on certificates       for select using (is_published = true);
create policy "public read reviews"        on reviews            for select using (is_published = true);
create policy "public read beforeafter"    on before_after_cases for select using (is_published = true);
create policy "public read gallery"        on gallery_images     for select using (is_published = true);
create policy "public read faqs"           on faqs               for select using (is_published = true);

create policy "staff all certificates" on certificates       for all to authenticated using (true) with check (true);
create policy "staff all reviews"      on reviews            for all to authenticated using (true) with check (true);
create policy "staff all beforeafter"  on before_after_cases for all to authenticated using (true) with check (true);
create policy "staff all gallery"      on gallery_images     for all to authenticated using (true) with check (true);
create policy "staff all faqs"         on faqs               for all to authenticated using (true) with check (true);
