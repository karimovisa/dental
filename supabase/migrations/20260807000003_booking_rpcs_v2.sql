-- Booking RPCs v2 — Asia/Tashkent time everywhere, phone-aware bookings, and
-- patient-facing view/cancel/reschedule. Replaces the v1 slot + booking RPCs.

-- Availability — TIMEZONE FIX: compare against Asia/Tashkent wall-clock, not UTC.
create or replace function get_available_slots(
  p_doctor_id uuid, p_service_id uuid, p_date date
)
returns table (slot_start time, slot_end time)
language plpgsql security definer set search_path = public as $$
declare
  v_duration int; v_buffer int; v_granularity int;
  v_now timestamp := now() at time zone 'Asia/Tashkent';   -- Tashkent wall clock
begin
  select duration_minutes, buffer_minutes into v_duration, v_buffer
  from services where id = p_service_id;
  if v_duration is null then return; end if;

  select coalesce(slot_granularity_minutes, 15) into v_granularity
  from clinic_settings where id = 1;
  v_granularity := coalesce(v_granularity, 15);

  return query
  with windows as (
    select o.start_time, o.end_time
    from doctor_availability_override o
    where o.doctor_id = p_doctor_id and o.date = p_date
      and o.is_day_off = false and o.start_time is not null
    union all
    select w.start_time, w.end_time
    from doctor_weekly_schedule w
    where w.doctor_id = p_doctor_id
      and w.weekday = extract(dow from p_date)::int
      and not exists (
        select 1 from doctor_availability_override o2
        where o2.doctor_id = p_doctor_id and o2.date = p_date
      )
  ),
  candidates as (
    select gs::time as c_start,
           (gs + make_interval(mins => v_duration))::time as c_end
    from windows win,
    lateral generate_series(
      (p_date + win.start_time),
      (p_date + win.end_time) - make_interval(mins => v_duration),
      make_interval(mins => v_granularity)
    ) gs
  )
  select c.c_start, c.c_end
  from candidates c
  where (p_date + c.c_start) > v_now + interval '30 minutes'
    and not exists (
      select 1 from appointments a
      where a.doctor_id = p_doctor_id
        and a.appointment_date = p_date
        and a.status in ('pending','confirmed')
        and tsrange(p_date + c.c_start, p_date + c.c_end) &&
            tsrange((p_date + a.start_time) - make_interval(mins => v_buffer),
                    (p_date + a.end_time)   + make_interval(mins => v_buffer))
    )
  order by c.c_start;
end; $$;

-- Booking — validate/normalize phone, upsert patient, link appointment.
create or replace function create_booking(
  p_doctor_id uuid, p_service_id uuid, p_patient_name text, p_patient_phone text,
  p_date date, p_start time, p_comment text default null
)
returns table (appointment_id uuid, status text)
language plpgsql security definer set search_path = public as $$
declare
  v_duration int; v_end time; v_requires_approval boolean; v_status text;
  v_id uuid; v_phone text; v_patient_id uuid;
begin
  v_phone := normalize_uz_phone(p_patient_phone);
  if v_phone is null then
    raise exception 'Please enter a valid Uzbek phone number (+998 XX XXX XX XX)';
  end if;

  select duration_minutes into v_duration from services where id = p_service_id;
  if v_duration is null then raise exception 'Invalid service'; end if;

  v_end := (p_date + p_start + make_interval(mins => v_duration))::time;

  if not exists (
    select 1 from get_available_slots(p_doctor_id, p_service_id, p_date) s
    where s.slot_start = p_start
  ) then
    raise exception 'Slot no longer available';
  end if;

  insert into patients (phone, full_name) values (v_phone, p_patient_name)
    on conflict (phone) do update set full_name = excluded.full_name
    returning id into v_patient_id;

  select coalesce(booking_requires_approval, false) into v_requires_approval
  from clinic_settings where id = 1;
  v_status := case when v_requires_approval then 'pending' else 'confirmed' end;

  begin
    insert into appointments(
      doctor_id, service_id, patient_id, patient_name, patient_phone,
      appointment_date, start_time, end_time, status, source, comment
    ) values (
      p_doctor_id, p_service_id, v_patient_id, p_patient_name, v_phone,
      p_date, p_start, v_end, v_status, 'online', p_comment
    ) returning id into v_id;
  exception when exclusion_violation then
    raise exception 'Slot was just taken, please pick another';
  end;

  return query select v_id, v_status;
end; $$;

-- Patient-facing: view a booking by reference + phone.
create or replace function get_booking(p_appointment_id uuid, p_phone text)
returns table (
  id uuid, doctor_id uuid, service_id uuid, service_title text,
  appointment_date date, start_time time, status text, can_modify boolean
)
language plpgsql security definer set search_path = public as $$
declare
  v_phone text := normalize_uz_phone(p_phone);
  v_cutoff int;
begin
  select cs.cancellation_cutoff_hours into v_cutoff
  from clinic_settings cs where cs.id = 1;
  return query
  select a.id, a.doctor_id, a.service_id, s.title, a.appointment_date, a.start_time, a.status,
         (a.status in ('pending','confirmed')
          and (a.appointment_date + a.start_time)
              > (now() at time zone 'Asia/Tashkent') + make_interval(hours => v_cutoff)) as can_modify
  from appointments a
  left join services s on s.id = a.service_id
  where a.id = p_appointment_id and a.patient_phone = v_phone;
end; $$;

-- Patient-facing cancel, enforcing the cutoff in Tashkent time.
create or replace function cancel_booking(p_appointment_id uuid, p_phone text)
returns void language plpgsql security definer set search_path = public as $$
declare v_cutoff int; v_start timestamp; v_phone text; v_appt_phone text;
begin
  v_phone := normalize_uz_phone(p_phone);
  select (appointment_date + start_time), patient_phone into v_start, v_appt_phone
  from appointments where id = p_appointment_id and status in ('pending','confirmed');
  if v_start is null then raise exception 'Booking not found'; end if;
  if v_phone is null or v_phone <> v_appt_phone then raise exception 'Phone does not match'; end if;

  select cancellation_cutoff_hours into v_cutoff from clinic_settings where id = 1;
  if v_start <= (now() at time zone 'Asia/Tashkent') + make_interval(hours => v_cutoff) then
    raise exception 'Too close to the appointment to cancel online';
  end if;

  update appointments set status = 'cancelled' where id = p_appointment_id;
end; $$;

-- Patient-facing reschedule = atomic cancel-old + book-new (frees the old slot).
create or replace function reschedule_booking(
  p_appointment_id uuid, p_phone text, p_new_date date, p_new_start time, p_reason text default null
)
returns table (appointment_id uuid, status text)
language plpgsql security definer set search_path = public as $$
declare
  v_cutoff int; v_start_old timestamp; v_phone text; v_appt_phone text;
  v_doctor uuid; v_service uuid; v_patient uuid; v_name text;
  v_duration int; v_end time; v_status text; v_requires boolean; v_id uuid;
begin
  v_phone := normalize_uz_phone(p_phone);
  select (appointment_date + start_time), patient_phone, doctor_id, service_id, patient_id, patient_name
    into v_start_old, v_appt_phone, v_doctor, v_service, v_patient, v_name
  from appointments where id = p_appointment_id and status in ('pending','confirmed');
  if v_start_old is null then raise exception 'Booking not found'; end if;
  if v_phone is null or v_phone <> v_appt_phone then raise exception 'Phone does not match'; end if;

  select cancellation_cutoff_hours into v_cutoff from clinic_settings where id = 1;
  if v_start_old <= (now() at time zone 'Asia/Tashkent') + make_interval(hours => v_cutoff) then
    raise exception 'Too close to the appointment to change online';
  end if;

  update appointments set status = 'cancelled', comment = coalesce(p_reason, comment)
  where id = p_appointment_id;

  select duration_minutes into v_duration from services where id = v_service;
  if not exists (
    select 1 from get_available_slots(v_doctor, v_service, p_new_date) s
    where s.slot_start = p_new_start
  ) then
    raise exception 'New slot not available';
  end if;

  v_end := (p_new_date + p_new_start + make_interval(mins => v_duration))::time;
  select coalesce(booking_requires_approval, false) into v_requires from clinic_settings where id = 1;
  v_status := case when v_requires then 'pending' else 'confirmed' end;

  begin
    insert into appointments(
      doctor_id, service_id, patient_id, patient_name, patient_phone,
      appointment_date, start_time, end_time, status, source, comment
    ) values (
      v_doctor, v_service, v_patient, v_name, v_phone,
      p_new_date, p_new_start, v_end, v_status, 'online', p_reason
    ) returning id into v_id;
  exception when exclusion_violation then
    raise exception 'New slot was just taken, please pick another';
  end;

  return query select v_id, v_status;
end; $$;

grant execute on function get_available_slots(uuid, uuid, date) to anon, authenticated;
grant execute on function create_booking(uuid, uuid, text, text, date, time, text) to anon, authenticated;
grant execute on function get_booking(uuid, text) to anon, authenticated;
grant execute on function cancel_booking(uuid, text) to anon, authenticated;
grant execute on function reschedule_booking(uuid, text, date, time, text) to anon, authenticated;
