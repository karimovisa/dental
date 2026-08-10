"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

/** Premium easing curve reused across entrance animations. */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds to delay the animation (useful for manual staggering). */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** Animate only the first time it enters the viewport. */
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">;

/**
 * Fade-and-rise wrapper that plays when the element scrolls into view.
 * The core entrance animation for both the public site and dashboard.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  once = true,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: easeOutExpo }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers the entrance of its `Reveal`-like children. */
export function RevealGroup({
  children,
  stagger = 0.08,
  once = true,
  ...props
}: {
  children: ReactNode;
  stagger?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
        hidden: {},
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A single item inside `RevealGroup`. */
export function RevealItem({
  children,
  y = 16,
  ...props
}: { children: ReactNode; y?: number } & Omit<
  HTMLMotionProps<"div">,
  "children"
>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
