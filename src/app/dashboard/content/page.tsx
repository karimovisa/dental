import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ContentTabs, type ContentData } from "@/components/admin/content/content-tabs";
import type { ContentRow } from "@/components/admin/content/entity-manager";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const t = await getTranslations("dashboard");
  const supabase = await createClient();

  // Signed-in dentist: RLS returns ALL rows (including unpublished/hidden).
  const [doctors, services, certificates, reviews, beforeAfter, gallery, faqs] =
    await Promise.all([
      supabase.from("doctors").select("*").order("display_order"),
      supabase.from("services").select("*").order("display_order"),
      supabase.from("certificates").select("*").order("display_order"),
      supabase.from("reviews").select("*").order("display_order"),
      supabase.from("before_after_cases").select("*").order("display_order"),
      supabase.from("gallery_images").select("*").order("display_order"),
      supabase.from("faqs").select("*").order("display_order"),
    ]);

  const data: ContentData = {
    doctors: (doctors.data ?? []) as ContentRow[],
    services: (services.data ?? []) as ContentRow[],
    certificates: (certificates.data ?? []) as ContentRow[],
    reviews: (reviews.data ?? []) as ContentRow[],
    before_after_cases: (beforeAfter.data ?? []) as ContentRow[],
    gallery_images: (gallery.data ?? []) as ContentRow[],
    faqs: (faqs.data ?? []) as ContentRow[],
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("contentTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("contentSubtitle")}</p>
      </div>
      <ContentTabs data={data} />
    </div>
  );
}
