import {
  Container,
  SectionHeading,
  LightboxImage,
  RevealGroup,
  RevealItem,
} from "@/components/shared";
import type { GalleryImageRow } from "@/types";

/** Clinic & team photo gallery — each image opens in a lightbox. */
export function GallerySection({ images }: { images: GalleryImageRow[] }) {
  if (images.length === 0) return null;

  return (
    <section id="gallery" className="scroll-mt-24 bg-secondary/40 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Our Space"
          title="Clinic Gallery"
          description="A look inside our modern, welcoming practice."
        />

        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <RevealItem key={image.id}>
              <LightboxImage
                src={image.image_url}
                alt={image.caption ?? "Clinic photo"}
                caption={image.caption ?? undefined}
                aspect="aspect-[4/3]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
