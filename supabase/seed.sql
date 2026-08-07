-- Seed data for the SmileCare booking backend.
-- One active doctor (multi-doctor schema, single-doctor UI for now), the
-- published services with service-driven durations, a weekly schedule with
-- multiple windows, and clinic settings. Idempotent via fixed UUIDs.

-- Doctor -------------------------------------------------------------------
insert into doctors (id, name, specialization, experience_years, bio, image_url, is_active, display_order)
values (
  'd0c70000-0000-4000-a000-000000000001',
  'Dr. Dilnoza Karimova',
  'Cosmetic & Restorative Dentistry',
  14,
  'Founder and lead dentist. Dilnoza has crafted thousands of smiles and lectures internationally on minimally invasive dentistry.',
  '/images/doctors/doc-dilnoza.jpg',
  true,
  1
)
on conflict (id) do update set
  name = excluded.name,
  specialization = excluded.specialization,
  experience_years = excluded.experience_years,
  bio = excluded.bio,
  image_url = excluded.image_url,
  is_active = excluded.is_active,
  display_order = excluded.display_order;

-- Services -----------------------------------------------------------------
insert into services (id, title, description, icon, duration_minutes, buffer_minutes, booking_type, price, is_published, display_order)
values
  ('5e100000-0000-4000-a000-000000000001', 'Teeth Cleaning',     'Professional cleaning for a healthier smile.',      'tooth',     45, 10, 'direct',        60, true, 1),
  ('5e100000-0000-4000-a000-000000000002', 'Tooth Filling',      'Tooth-colored fillings for cavity treatment.',      'filling',   50, 10, 'direct',        90, true, 2),
  ('5e100000-0000-4000-a000-000000000003', 'Braces & Aligners',  'Straighten your teeth with modern solutions.',      'braces',    45, 10, 'direct',      1200, true, 3),
  ('5e100000-0000-4000-a000-000000000004', 'Dental Implant',     'Permanent solution for missing teeth.',             'implant',   90, 15, 'direct',       900, true, 4),
  ('5e100000-0000-4000-a000-000000000005', 'Teeth Whitening',    'Brighter smile with safe whitening treatment.',     'whitening', 60, 10, 'direct',       180, true, 5),
  ('5e100000-0000-4000-a000-000000000006', 'Consultation',       'A short visit to assess your needs and plan care.', 'tooth',     20, 10, 'consultation',   0, true, 6)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  duration_minutes = excluded.duration_minutes,
  buffer_minutes = excluded.buffer_minutes,
  booking_type = excluded.booking_type,
  price = excluded.price,
  is_published = excluded.is_published,
  display_order = excluded.display_order;

-- Weekly schedule (0=Sun … 6=Sat). Mon–Thu two windows, Fri morning, Sat morning.
delete from doctor_weekly_schedule where doctor_id = 'd0c70000-0000-4000-a000-000000000001';
insert into doctor_weekly_schedule (doctor_id, weekday, start_time, end_time)
values
  ('d0c70000-0000-4000-a000-000000000001', 1, '09:00', '13:00'),
  ('d0c70000-0000-4000-a000-000000000001', 1, '15:00', '19:00'),
  ('d0c70000-0000-4000-a000-000000000001', 2, '09:00', '13:00'),
  ('d0c70000-0000-4000-a000-000000000001', 2, '15:00', '19:00'),
  ('d0c70000-0000-4000-a000-000000000001', 3, '09:00', '13:00'),
  ('d0c70000-0000-4000-a000-000000000001', 3, '15:00', '19:00'),
  ('d0c70000-0000-4000-a000-000000000001', 4, '09:00', '13:00'),
  ('d0c70000-0000-4000-a000-000000000001', 4, '15:00', '19:00'),
  ('d0c70000-0000-4000-a000-000000000001', 5, '09:00', '13:00'),
  ('d0c70000-0000-4000-a000-000000000001', 6, '09:00', '14:00');

-- Clinic settings (single row) --------------------------------------------
update clinic_settings set
  booking_requires_approval = false,
  slot_granularity_minutes = 15,
  clinic_name = 'SmileCare',
  phone = '+998 90 123 45 67',
  address = 'Amir Temur Avenue 123, Tashkent, Uzbekistan',
  working_hours_note = 'Mon–Fri 09:00–19:00, Sat 09:00–14:00, Sun closed'
where id = 1;
