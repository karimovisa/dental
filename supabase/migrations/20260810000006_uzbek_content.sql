-- Third content language. The base text columns hold English (the original
-- seed); *_ru holds Russian; these *_uz columns hold Uzbek. The public site
-- picks the active locale and falls back to the English base when a translation
-- is empty (never blank). reviews.text stays untranslated.

alter table services            add column if not exists title_uz text,
                                add column if not exists description_uz text;
alter table doctors             add column if not exists specialization_uz text,
                                add column if not exists bio_uz text;
alter table certificates        add column if not exists title_uz text;
alter table faqs                add column if not exists question_uz text,
                                add column if not exists answer_uz text;
alter table before_after_cases  add column if not exists caption_uz text;
alter table gallery_images      add column if not exists caption_uz text;
alter table clinic_settings     add column if not exists working_hours_note_uz text;
