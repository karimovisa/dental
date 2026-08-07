-- Normalize an Uzbek mobile number to +998XXXXXXXXX, or NULL if invalid.
-- +998901234567 / 901234567 / 998901234567 / "+998 90 123 45 67" -> +998901234567
create or replace function normalize_uz_phone(p_phone text)
returns text language plpgsql immutable as $$
declare v text;
begin
  v := regexp_replace(coalesce(p_phone,''), '\D', '', 'g');  -- digits only
  if length(v) = 12 and left(v,3) = '998' then v := '+' || v;
  elsif length(v) = 9 then v := '+998' || v;
  elsif length(v) = 12 and left(v,3) <> '998' then return null;
  else return null;
  end if;
  if v ~ '^\+998\d{9}$' then return v; else return null; end if;
end;
$$;

-- Patient self-cancel/reschedule cutoff (hours before start). Dentist-adjustable.
alter table clinic_settings
  add column cancellation_cutoff_hours int not null default 5;
