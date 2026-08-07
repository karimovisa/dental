-- Booking backend — core schema.
-- Multi-doctor from day one (UI shows one for now); service-driven durations;
-- weekly schedule + date overrides; hard anti-double-book guard.

create extension if not exists btree_gist;

-- DOCTORS (multi-doctor from day one; UI shows just one for now)
create table doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialization text,
  experience_years int,
  bio text,
  image_url text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- SERVICES (service drives the duration; patient never types a duration)
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  duration_minutes int not null,               -- include a little safety padding
  buffer_minutes int not null default 10,      -- cleanup/turnaround after each appt
  booking_type text not null default 'direct'
    check (booking_type in ('direct','consultation')),
  price numeric(10,2),
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- RECURRING WEEKLY AVAILABILITY (set once; may have >1 window per weekday)
create table doctor_weekly_schedule (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references doctors(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),  -- 0=Sunday
  start_time time not null,
  end_time time not null,
  check (start_time < end_time)
);

-- DATE-SPECIFIC OVERRIDES (exceptions: different hours, or day off)
create table doctor_availability_override (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references doctors(id) on delete cascade,
  date date not null,
  start_time time,
  end_time time,
  is_day_off boolean not null default false
);

-- APPOINTMENTS
create table appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references doctors(id),
  service_id uuid references services(id),
  patient_name text not null,
  patient_phone text not null,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'confirmed'
    check (status in ('pending','confirmed','completed','cancelled','no_show')),
  source text not null default 'online' check (source in ('online','staff')),
  parent_appointment_id uuid references appointments(id) on delete set null, -- links a treatment to its consultation
  comment text,
  created_at timestamptz not null default now()
);
create index on appointments (doctor_id, appointment_date);

-- HARD GUARD against double-booking: no two active appts for the same doctor overlap.
-- Two people booking the same slot at once => one insert fails cleanly.
alter table appointments
  add constraint appointments_no_overlap
  exclude using gist (
    doctor_id with =,
    tsrange((appointment_date + start_time), (appointment_date + end_time)) with &&
  ) where (status in ('pending','confirmed'));

-- CLINIC SETTINGS (single row, id=1)
create table clinic_settings (
  id int primary key default 1 check (id = 1),
  booking_requires_approval boolean not null default false,  -- flip to true later
  slot_granularity_minutes int not null default 15,
  clinic_name text,
  phone text,
  address text,
  working_hours_note text
);
insert into clinic_settings (id) values (1) on conflict do nothing;
