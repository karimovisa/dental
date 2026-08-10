-- One public bucket for all site images (doctor photos, certificates,
-- before/after, gallery, logo). Public read (they're shown on the site);
-- only the signed-in dentist can upload, replace, or delete.

insert into storage.buckets (id, name, public)
values ('clinic-media', 'clinic-media', true)
on conflict (id) do nothing;

create policy "public read clinic-media"
  on storage.objects for select using (bucket_id = 'clinic-media');

create policy "staff upload clinic-media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'clinic-media');

create policy "staff update clinic-media"
  on storage.objects for update to authenticated
  using (bucket_id = 'clinic-media');

create policy "staff delete clinic-media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'clinic-media');
