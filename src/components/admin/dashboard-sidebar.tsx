"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  Users,
  Settings,
  LayoutTemplate,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { DentalIcon } from "@/components/shared";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ userEmail }: { userEmail?: string }) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { label: t("overview"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("appointments"), href: "/dashboard/appointments", icon: CalendarCheck },
    { label: t("patients"), href: "/dashboard/patients", icon: Users },
    { label: t("content"), href: "/dashboard/content", icon: LayoutTemplate },
    { label: t("availability"), href: "/dashboard/availability", icon: CalendarRange },
    { label: t("settings"), href: "/dashboard/settings", icon: Settings },
  ];

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(item.href)
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <item.icon className="size-4.5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const brand = (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-1 py-1">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <DentalIcon name="tooth" className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-sidebar-foreground">
          SmileCare
        </span>
        <span className="text-[10px] font-medium tracking-widest text-sidebar-foreground/50 uppercase">
          {t("admin")}
        </span>
      </span>
    </Link>
  );

  const footer = (
    <div className="flex flex-col gap-2 border-t border-sidebar-border pt-4">
      {userEmail && (
        <span className="truncate px-3 text-xs text-sidebar-foreground/50">
          {userEmail}
        </span>
      )}
      <button
        type="button"
        onClick={signOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <LogOut className="size-4.5" />
        {t("signOut")}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-muted"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col gap-6 bg-sidebar p-5">
            <div className="flex items-center justify-between">
              {brand}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-sidebar-accent"
              >
                <X className="size-5" />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        {brand}
        {nav}
        {footer}
      </aside>
    </>
  );
}
