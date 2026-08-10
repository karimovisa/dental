import {
  Container,
  SectionHeading,
  LightboxImage,
  RevealGroup,
  RevealItem,
} from "@/components/shared";
import type { CertificateRow } from "@/types";

/** Accreditations gallery — each certificate opens in a lightbox. */
export function CertificatesSection({
  certificates,
}: {
  certificates: CertificateRow[];
}) {
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Trust & Credentials"
          title="Certifications & Awards"
          description="Recognized standards of care, backed by internationally accredited expertise."
          underline
        />

        <RevealGroup className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {certificates.map((certificate) => (
            <RevealItem key={certificate.id}>
              <LightboxImage
                src={certificate.image_url}
                alt={certificate.title ?? "Certificate"}
                caption={certificate.title ?? undefined}
                aspect="aspect-[3/4]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
