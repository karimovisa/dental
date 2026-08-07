/** Barrel export for all typed mock data. Import via `@/data`.
 *
 * In V1 these are static arrays. When the backend lands, each export is
 * replaced by a Supabase query returning the same snake_case shape — the
 * components consuming this data do not change. */
export { services } from "./services";
export { certificates } from "./certificates";
export { doctors } from "./doctors";
export { patients } from "./patients";
export { appointments } from "./appointments";
export { reviews } from "./reviews";
export { stats } from "./stats";
export { faqs } from "./faqs";
export { beforeAfterCases } from "./before-after";
export { galleryImages } from "./gallery";
export { clinicSettings } from "./clinic-settings";
