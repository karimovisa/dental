-- Patients CRM: phone is the identity key. On booking, match/create by phone
-- and link every appointment, giving the dentist full visit history.
create table patients (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,            -- normalized +998XXXXXXXXX
  full_name text not null,
  first_seen timestamptz not null default now(),
  notes text                             -- dentist's private notes
);

alter table appointments add column patient_id uuid references patients(id);
create index on appointments (patient_id);

-- PII: patients is staff-only (like appointments). RPCs (security definer) upsert it.
alter table patients enable row level security;
create policy "staff all patients" on patients
  for all to authenticated using (true) with check (true);
