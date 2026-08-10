import { useTranslations, useLocale } from "next-intl";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  Container,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared";
import { localized } from "@/lib/i18n-content";
import type { ClinicSettingsRow, ServiceRow } from "@/types";
import { Logo } from "./logo";

/** Site footer: brand, quick links, services, contact, socials — all from the
 *  live clinic settings + services. */
export function SiteFooter({
  settings,
  services,
}: {
  settings: ClinicSettingsRow | null;
  services: ServiceRow[];
}) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const quickLinks = [
    { label: tNav("home"), href: "#home" },
    { label: tNav("about"), href: "#why" },
    { label: tNav("services"), href: "#services" },
    { label: tNav("doctors"), href: "#doctors" },
    { label: tNav("reviews"), href: "#reviews" },
    { label: tNav("contact"), href: "#appointment" },
  ];
  const socials = [
    { icon: FacebookIcon, href: settings?.facebook_url, label: "Facebook" },
    { icon: InstagramIcon, href: settings?.instagram_url, label: "Instagram" },
    { icon: TelegramIcon, href: settings?.telegram_url, label: "Telegram" },
  ].filter((s) => s.href);

  const contactRows = [
    { icon: Phone, value: settings?.phone },
    { icon: Mail, value: settings?.email },
    { icon: MapPin, value: settings?.address },
  ];

  const footerServices = services.slice(0, 5);

  return (
    <footer className="bg-neutral-950 text-white/70">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo
            onDark
            name={settings?.clinic_name}
            tagline={settings?.tagline}
            logoUrl={settings?.logo_url}
          />
          <p className="max-w-xs text-sm text-white/60">{t("blurb")}</p>
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">{t("quickLinks")}</h3>
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">{t("services")}</h3>
          {footerServices.map((service) => (
            <a
              key={service.id}
              href="#services"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {localized(locale, service.title, service.title_ru, service.title_uz)}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">{t("contact")}</h3>
          {contactRows.map(
            (row) =>
              row.value && (
                <div key={row.value} className="flex items-start gap-2.5 text-sm text-white/60">
                  <row.icon className="mt-0.5 size-4 shrink-0" />
                  <span>{row.value}</span>
                </div>
              )
          )}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {settings?.clinic_name ?? "SmileCare"}.{" "}
            {t("rights")}
          </span>
          <span>{t("crafted")}</span>
        </Container>
      </div>
    </footer>
  );
}
