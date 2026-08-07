/** Barrel export for the shared design-system components. Import via
 * `@/components/shared`. These are presentational, typed, token-themed, and
 * reused across both the public site and the admin dashboard. */
export { Button, type ButtonProps } from "./button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
export { Input, type InputProps } from "./input";
export { Textarea, type TextareaProps } from "./textarea";
export { Select, type SelectOption, type SelectProps } from "./select";
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export { StatusPill, type StatusPillProps } from "./status-pill";
export { Modal, type ModalProps } from "./modal";
export {
  Accordion,
  type AccordionEntry,
  type AccordionProps,
} from "./accordion";
export { Avatar, type AvatarProps } from "./avatar";
export { SectionHeading, type SectionHeadingProps } from "./section-heading";
export { Container } from "./container";
export {
  DentalIcon,
  type DentalIconName,
  type DentalIconProps,
} from "./dental-icons";
export {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
} from "./social-icons";
export { LightboxImage, type LightboxImageProps } from "./image-lightbox";
export {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
} from "./data-table";
export { Reveal, RevealGroup, RevealItem, easeOutExpo } from "./motion";
