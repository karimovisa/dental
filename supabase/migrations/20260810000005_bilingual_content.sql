-- Bilingual content: existing text columns hold Uzbek (default locale); the
-- new *_ru columns hold Russian. Public site picks the column by active locale
-- and falls back to Uzbek when the Russian value is empty (never blank).
-- reviews.text is intentionally NOT translated — real patient quotes stay as written.

alter table services            add column if not exists title_ru text,
                                add column if not exists description_ru text;
alter table doctors             add column if not exists specialization_ru text,
                                add column if not exists bio_ru text;
alter table certificates        add column if not exists title_ru text;
alter table faqs                add column if not exists question_ru text,
                                add column if not exists answer_ru text;
alter table before_after_cases  add column if not exists caption_ru text;
alter table gallery_images      add column if not exists caption_ru text;
alter table clinic_settings     add column if not exists working_hours_note_ru text;
