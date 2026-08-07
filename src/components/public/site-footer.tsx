import { Phone, Mail, MapPin } from "lucide-react";
import {
  Container,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/shared";
import { clinicSettings, services } from "@/data";
import { Logo } from "./logo";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#why" },
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#appointment" },
];

const socials = [
  { icon: FacebookIcon, href: clinicSettings.facebook_url, label: "Facebook" },
  { icon: InstagramIcon, href: clinicSettings.instagram_url, label: "Instagram" },
  { icon: TelegramIcon, href: clinicSettings.telegram_url, label: "Telegram" },
];

const contactRows = [
  { icon: Phone, value: clinicSettings.phone },
  { icon: Mail, value: clinicSettings.email },
  { icon: MapPin, value: clinicSettings.address },
];

/** Site footer: brand, quick links, services, contact, socials. */
export function SiteFooter() {
  return (
    <footer className="bg-neutral-950 text-white/70">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo onDark />
          <p className="max-w-xs text-sm text-white/60">
            Premium dental care with modern technology in a comfortable,
            welcoming environment.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href ?? "#"}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Quick Links</h3>
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
          <h3 className="text-sm font-semibold text-white">Services</h3>
          {services
            .filter((service) => service.is_featured)
            .map((service) => (
              <a
                key={service.id}
                href="#services"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {service.title}
              </a>
            ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Contact</h3>
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
            © {new Date().getFullYear()} {clinicSettings.name}. All rights
            reserved.
          </span>
          <span>Crafted with care in Tashkent.</span>
        </Container>
      </div>
    </footer>
  );
}
