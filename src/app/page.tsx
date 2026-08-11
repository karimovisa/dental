import {
  SiteHeader,
  Hero,
  WhyChooseUs,
  StatsBar,
  ServicesSection,
  BeforeAfter,
  DoctorsSection,
  CertificatesSection,
  GallerySection,
  ReviewsSection,
  FaqSection,
  AppointmentSection,
  SiteFooter,
} from "@/components/public";
import { IntroSplash } from "@/components/public/intro-splash";
import { getSiteContent } from "@/lib/site-content";

// Always render from the live database so dashboard edits appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <IntroSplash />
      <SiteHeader settings={content.settings} />
      <main className="flex flex-col">
        <Hero />
        <WhyChooseUs />
        <StatsBar />
        <ServicesSection services={content.services} />
        <BeforeAfter cases={content.beforeAfter} />
        <DoctorsSection doctors={content.doctors} />
        <CertificatesSection certificates={content.certificates} />
        <GallerySection images={content.gallery} />
        <ReviewsSection reviews={content.reviews} />
        <FaqSection faqs={content.faqs} />
        <AppointmentSection settings={content.settings} />
      </main>
      <SiteFooter settings={content.settings} services={content.services} />
    </>
  );
}
