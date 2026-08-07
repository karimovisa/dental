-- Row Level Security.
-- Public (anon) may read ONLY the published catalog and reach appointments/
-- schedule/settings solely through the SECURITY DEFINER RPCs. The signed-in
-- dentist gets full access.

alter table doctors                      enable row level security;
alter table services                     enable row level security;
alter table doctor_weekly_schedule       enable row level security;
alter table doctor_availability_override enable row level security;
alter table appointments                 enable row level security;
alter table clinic_settings              enable row level security;

-- Public may read only the published catalog
create policy "public read active doctors" on doctors
  for select using (is_active = true);
create policy "public read published services" on services
  for select using (is_published = true);

-- Schedule, overrides, appointments, settings: NO public policies.
-- The public site reaches them only through the SECURITY DEFINER RPCs below.

-- Dentist (signed in) gets full access to everything
create policy "staff all doctors"   on doctors                      for all to authenticated using (true) with check (true);
create policy "staff all services"  on services                     for all to authenticated using (true) with check (true);
create policy "staff all weekly"    on doctor_weekly_schedule       for all to authenticated using (true) with check (true);
create policy "staff all override"  on doctor_availability_override for all to authenticated using (true) with check (true);
create policy "staff all appts"     on appointments                 for all to authenticated using (true) with check (true);
create policy "staff all settings"  on clinic_settings              for all to authenticated using (true) with check (true);
