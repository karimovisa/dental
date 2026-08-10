import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("clinic_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Clinic details and booking behavior.
        </p>
      </div>
      {settings ? (
        <SettingsForm settings={settings} />
      ) : (
        <p className="text-sm text-muted-foreground">Settings not found.</p>
      )}
    </div>
  );
}
