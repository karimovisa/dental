-- Seed the current site content so the live site stays populated once it reads
-- from these tables. Each block only runs when its table is still empty, so the
-- migration is safe to re-run and never clobbers content the dentist has edited.
-- Services + doctors are already seeded from earlier migrations; certificates are
-- intentionally left empty for the dentist to upload real ones.

-- FAQS
insert into faqs (question, answer, is_published, display_order)
select * from (values
  ('Do you accept new patients?', 'Yes — we welcome new patients every week. You can request an appointment through the booking form or by phone, and our team will confirm a time that suits you.', true, 1),
  ('Does the treatment hurt?', 'Patient comfort is our priority. We use modern anesthesia and gentle techniques so that most procedures — including implants and root canals — are virtually painless.', true, 2),
  ('How much do dental implants cost?', 'Implant treatment starts from $900 per implant and depends on your specific case. We provide a clear, itemized plan after a consultation, with no hidden fees.', true, 3),
  ('Do you offer payment plans?', 'Yes. For larger treatments such as veneers or full-arch implants we offer flexible installment options. Ask our reception team for details.', true, 4),
  ('How long does teeth whitening take?', 'In-office whitening takes about one hour and brightens your smile by several shades in a single visit. We also offer take-home kits for gradual results.', true, 5),
  ('Is the clinic suitable for children?', 'Absolutely. Our pediatric specialist creates a calm, playful environment so children feel safe and actually enjoy their visits.', true, 6)
) as v(question, answer, is_published, display_order)
where not exists (select 1 from faqs);

-- REVIEWS
insert into reviews (patient_name, rating, text, photo_url, source, is_published, display_order)
select * from (values
  ('Gulnora M.', 5, 'The most comfortable dental experience I''ve ever had. My veneers look completely natural and the team explained every step.', 'https://i.pravatar.cc/120?img=25', 'google', true, 1),
  ('Timur A.', 5, 'I was terrified of implants, but the team made it painless. Six months later everything feels like my own teeth.', 'https://i.pravatar.cc/120?img=13', 'google', true, 2),
  ('Sevara I.', 5, 'Took my son here and he actually asked when he can come back. The pediatric care is wonderful and gentle.', 'https://i.pravatar.cc/120?img=41', 'instagram', true, 3),
  ('Rustam K.', 4, 'Great whitening results and a beautiful, modern clinic. Booking was easy and there was almost no wait.', 'https://i.pravatar.cc/120?img=8', 'facebook', true, 4),
  ('Dilafruz N.', 5, 'My aligners are almost invisible and my teeth have moved so much in just a few months. Highly recommend.', 'https://i.pravatar.cc/120?img=30', 'google', true, 5),
  ('Aziz B.', 5, 'Clean, calm, and truly premium. You can tell they care about every detail. Best clinic in the city.', 'https://i.pravatar.cc/120?img=68', 'telegram', true, 6)
) as v(patient_name, rating, text, photo_url, source, is_published, display_order)
where not exists (select 1 from reviews);

-- BEFORE / AFTER
insert into before_after_cases (caption, before_image_url, after_image_url, is_published, display_order)
select * from (values
  ('Smile Makeover — a complete transformation with our cosmetic treatment.', '/images/before-after/ba-veneers-before.png', '/images/before-after/ba-veneers-after.png', true, 1)
) as v(caption, before_image_url, after_image_url, is_published, display_order)
where not exists (select 1 from before_after_cases);

-- GALLERY: intentionally not seeded — the mock gallery images were never added
-- to the repo (public/images/gallery/*), so seeding them would show broken
-- images. The gallery section hides itself while empty; the dentist uploads
-- real clinic photos from the dashboard.

-- CLINIC SETTINGS: branding, contact + socials + structured hours.
update clinic_settings set
  tagline       = coalesce(tagline, 'Dental Clinic'),
  email         = coalesce(email, 'hello@smilecare.uz'),
  map_embed_url = coalesce(map_embed_url, 'https://www.google.com/maps?q=Tashkent&output=embed'),
  telegram_url  = coalesce(telegram_url, 'https://t.me/smilecare'),
  instagram_url = coalesce(instagram_url, 'https://instagram.com/smilecare'),
  facebook_url  = coalesce(facebook_url, 'https://facebook.com/smilecare'),
  working_hours = coalesce(working_hours, '[
    {"day":"mon","opens":"09:00","closes":"19:00","is_closed":false},
    {"day":"tue","opens":"09:00","closes":"19:00","is_closed":false},
    {"day":"wed","opens":"09:00","closes":"19:00","is_closed":false},
    {"day":"thu","opens":"09:00","closes":"19:00","is_closed":false},
    {"day":"fri","opens":"09:00","closes":"19:00","is_closed":false},
    {"day":"sat","opens":"09:00","closes":"14:00","is_closed":false},
    {"day":"sun","opens":null,"closes":null,"is_closed":true}
  ]'::jsonb)
where id = 1;
