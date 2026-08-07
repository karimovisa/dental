import type { ClinicSettings } from "@/types";

/** Single clinic configuration record — edited in the Settings dashboard. */
export const clinicSettings: ClinicSettings = {
  id: "clinic-1",
  name: "SmileCare",
  tagline: "Dental Clinic",
  logo_url: null,
  phone: "+998 90 123 45 67",
  email: "hello@smilecare.uz",
  address: "Amir Temur Avenue 123, Tashkent, Uzbekistan",
  map_embed_url: "https://www.google.com/maps?q=Tashkent&output=embed",
  telegram_url: "https://t.me/smilecare",
  instagram_url: "https://instagram.com/smilecare",
  facebook_url: "https://facebook.com/smilecare",
  working_hours: [
    { day: "mon", opens: "09:00", closes: "19:00", is_closed: false },
    { day: "tue", opens: "09:00", closes: "19:00", is_closed: false },
    { day: "wed", opens: "09:00", closes: "19:00", is_closed: false },
    { day: "thu", opens: "09:00", closes: "19:00", is_closed: false },
    { day: "fri", opens: "09:00", closes: "19:00", is_closed: false },
    { day: "sat", opens: "09:00", closes: "16:00", is_closed: false },
    { day: "sun", opens: null, closes: null, is_closed: true },
  ],
};
