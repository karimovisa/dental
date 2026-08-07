import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: middleware already guards this, but never render the
  // dashboard shell for an unauthenticated request.
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-secondary/30">
      <DashboardSidebar userEmail={user.email} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
