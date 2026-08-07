import {
  SiteHeader,
  Hero,
  WhyChooseUs,
  StatsBar,
  ServicesSection,
  BeforeAfter,
  DoctorsSection,
  CertificatesSection,
  ReviewsSection,
  FaqSection,
  AppointmentSection,
  SiteFooter,
} from "@/components/public";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <Hero />
        <WhyChooseUs />
        <StatsBar />
        <ServicesSection />
        <BeforeAfter />
        <DoctorsSection />
        <CertificatesSection />
        <ReviewsSection />
        <FaqSection />
        <AppointmentSection />
      </main>
      <SiteFooter />
    </>
  );
}
