-- The two RPCs the public site calls. Both SECURITY DEFINER so anon can compute
-- availability and create a booking without direct table access to PII.

-- Returns the bookable start times for a doctor + service on a date.
create or replace function get_available_slots(
  p_doctor_id uuid,
  p_service_id uuid,
  p_date date
)
returns table (slot_start time, slot_end time)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration int;
  v_buffer int;
  v_granularity int;
  v_now timestamptz := now();
begin
  select duration_minutes, buffer_minutes
    into v_duration, v_buffer
  from services where id = p_service_id;
  if v_duration is null then
    return;
  end if;

  select coalesce(slot_granularity_minutes, 15) into v_granularity
  from clinic_settings where id = 1;
  v_granularity := coalesce(v_granularity, 15);

  return query
  with windows as (
    -- a date override (if present) wins over the weekly schedule
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
  where (p_date + c.c_start) > v_now + interval '30 minutes'   -- no past/too-soon slots
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
end;
$$;

-- Creates a booking. Re-validates the slot, sets status from the approval flag,
-- and relies on the exclusion constraint as the final anti-double-book guard.
create or replace function create_booking(
  p_doctor_id uuid,
  p_service_id uuid,
  p_patient_name text,
  p_patient_phone text,
  p_date date,
  p_start time,
  p_comment text default null
)
returns table (appointment_id uuid, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration int;
  v_end time;
  v_requires_approval boolean;
  v_status text;
  v_id uuid;
begin
  select duration_minutes into v_duration from services where id = p_service_id;
  if v_duration is null then
    raise exception 'Invalid service';
  end if;

  v_end := (p_date + p_start + make_interval(mins => v_duration))::time;

  if not exists (
    select 1 from get_available_slots(p_doctor_id, p_service_id, p_date) s
    where s.slot_start = p_start
  ) then
    raise exception 'Slot no longer available';
  end if;

  select coalesce(booking_requires_approval, false) into v_requires_approval
  from clinic_settings where id = 1;
  v_status := case when v_requires_approval then 'pending' else 'confirmed' end;

  begin
    insert into appointments(
      doctor_id, service_id, patient_name, patient_phone,
      appointment_date, start_time, end_time, status, source, comment
    ) values (
      p_doctor_id, p_service_id, p_patient_name, p_patient_phone,
      p_date, p_start, v_end, v_status, 'online', p_comment
    ) returning id into v_id;
  exception when exclusion_violation then
    raise exception 'Slot was just taken, please pick another';
  end;

  return query select v_id, v_status;
end;
$$;

-- Let the public form call ONLY these two functions
grant execute on function get_available_slots(uuid, uuid, date) to anon, authenticated;
grant execute on function create_booking(uuid, uuid, text, text, date, time, text) to anon, authenticated;
