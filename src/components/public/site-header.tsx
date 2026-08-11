"use client";

import * as React from "react";
import { Menu, X, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, Container } from "@/components/shared";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import type { ClinicSettingsRow } from "@/types";

/** Sticky site header: brand, centered nav, CTA. Collapses to a menu on mobile. */
export function SiteHeader({ settings }: { settings: ClinicSettingsRow | null }) {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const navLinks = [
    { label: t("home"), href: "#home" },
    { label: t("about"), href: "#why" },
    { label: t("services"), href: "#services" },
    { label: t("doctors"), href: "#doctors" },
    { label: t("reviews"), href: "#reviews" },
    { label: t("contact"), href: "#appointment" },
  ];
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-background/0"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <a
          href="#home"
          aria-label={`${settings?.clinic_name ?? "SmileCare"} home`}
          className="lg:hidden"
        >
          <Logo
            name={settings?.clinic_name}
            tagline={settings?.tagline}
            logoUrl={settings?.logo_url}
          />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            href="#appointment"
            size="md"
            leftIcon={<CalendarDays />}
            className="hidden rounded-full sm:inline-flex"
          >
            {tHeader("book")}
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-border bg-background transition-[max-height] duration-300 lg:hidden",
          menuOpen ? "max-h-96 border-b" : "max-h-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
          <Button
            href="#appointment"
            fullWidth
            leftIcon={<CalendarDays />}
            className="mt-2 rounded-full"
            onClick={() => setMenuOpen(false)}
          >
            {tHeader("book")}
          </Button>
        </Container>
      </div>
    </header>
  );
}
