import { useTranslations, useLocale } from "next-intl";
import {
  Container,
  SectionHeading,
  LightboxImage,
  RevealGroup,
  RevealItem,
} from "@/components/shared";
import { localized } from "@/lib/i18n-content";
import type { GalleryImageRow } from "@/types";

/** Clinic & team photo gallery — each image opens in a lightbox. */
export function GallerySection({ images }: { images: GalleryImageRow[] }) {
  const t = useTranslations("gallery");
  const locale = useLocale();
  if (images.length === 0) return null;

  return (
    <section id="gallery" className="scroll-mt-24 bg-secondary/40 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => {
            const caption = localized(locale, image.caption, image.caption_ru, image.caption_uz);
            return (
            <RevealItem key={image.id}>
              <LightboxImage
                src={image.image_url}
                alt={caption || "Clinic photo"}
                caption={caption || undefined}
                aspect="aspect-[4/3]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
