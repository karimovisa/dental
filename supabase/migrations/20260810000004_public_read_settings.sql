-- The public site now renders clinic name, logo, contact details, socials and
-- opening hours from clinic_settings, so anon needs to read this single row.
-- It holds no PII or secrets (patient data lives in `appointments`, which stays
-- locked down) — only public marketing/contact fields plus operational booking
-- flags — so a straight public read policy is safe.
create policy "public read clinic settings" on clinic_settings
  for select using (true);
