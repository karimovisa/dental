import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Custom dental icon set — Lucide has no tooth glyph, so these are hand-drawn
 * line icons in the same visual language (24px grid, currentColor, rounded
 * strokes). Referenced by `Service.icon` values.
 */

export type DentalIconName =
  | "tooth"
  | "filling"
  | "braces"
  | "implant"
  | "whitening"
  | "veneer";

const TOOTH_PATH =
  "M7 3.2C5.2 3.2 3.7 4.7 3.7 6.9c0 1.4.4 2.3.8 3.9.3 1.2.4 2.4.6 3.9.2 1.5.3 3.6 1.5 3.6 1 0 1.2-1.4 1.4-2.7.2-1.2.4-2.4 1.5-2.4s1.3 1.2 1.5 2.4c.2 1.3.4 2.7 1.4 2.7 1.2 0 1.3-2.1 1.5-3.6.2-1.5.3-2.7.6-3.9.4-1.6.8-2.5.8-3.9 0-2.2-1.5-3.7-3.3-3.7-1.6 0-2.3.8-3.5.8s-1.9-.8-3.5-.8Z";

type IconProps = React.SVGProps<SVGSVGElement>;

function Svg({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

function Tooth(props: IconProps) {
  return (
    <Svg {...props}>
      <path d={TOOTH_PATH} />
    </Svg>
  );
}

function Filling(props: IconProps) {
  return (
    <Svg {...props}>
      <path d={TOOTH_PATH} />
      <path d="M12 6.4l1.4 1.9L12 10.2 10.6 8.3 12 6.4Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

function Braces(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M8 8v8M12 8v8M16 8v8" />
    </Svg>
  );
}

function Implant(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3c2.8 0 4.7 1.9 4.7 4.6 0 1.4-.7 2.4-1.5 3H8.8c-.8-.6-1.5-1.6-1.5-3C7.3 4.9 9.2 3 12 3Z" />
      <path d="M12 10.6V21" />
      <path d="M9.6 13h4.8M9.9 16h4.2M10.6 19h2.8" />
    </Svg>
  );
}

function Whitening(props: IconProps) {
  return (
    <Svg {...props}>
      <path d={TOOTH_PATH} />
      <path
        d="M18.5 2.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6Z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

function Veneer(props: IconProps) {
  return (
    <Svg {...props}>
      <path d={TOOTH_PATH} />
      <path d="M9.3 7c1-.9 2.4-1.2 3.6-.7" strokeWidth={1.3} />
    </Svg>
  );
}

const iconMap: Record<DentalIconName, React.FC<IconProps>> = {
  tooth: Tooth,
  filling: Filling,
  braces: Braces,
  implant: Implant,
  whitening: Whitening,
  veneer: Veneer,
};

export interface DentalIconProps extends IconProps {
  name: string;
}

/** Renders a dental icon by name, falling back to a generic tooth. */
export function DentalIcon({ name, ...props }: DentalIconProps) {
  const Icon = iconMap[name as DentalIconName] ?? Tooth;
  return <Icon {...props} />;
}
