/**
 * Certificate — an award, license, or accreditation shown in the gallery and
 * linked from doctors. Rendered in a lightbox on the public site.
 */
export interface Certificate {
  id: string; // uuid
  title: string;
  image_url: string;
  issuer: string | null; // issuing body
  issued_year: number | null;
  display_order: number;
}
