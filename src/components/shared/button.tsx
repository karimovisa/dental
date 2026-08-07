"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        destructive: "bg-destructive text-white shadow-soft hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-12 px-7 text-base [&_svg]:size-5",
        icon: "size-11 [&_svg]:size-5",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", fullWidth: false },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** When set, the button renders as an anchor (for CTAs / navigation). */
  href?: string;
  children?: React.ReactNode;
};

export type ButtonProps = ButtonBaseProps &
  Omit<React.ComponentProps<"button">, keyof ButtonBaseProps>;

/**
 * Primary interactive control. Presentational + reusable across the whole app.
 * V1 has no submit logic — wire `onClick`/form handling when the backend lands.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      href,
      children,
      disabled,
      type,
      ...props
    },
    ref
  ) {
    const classes = cn(buttonVariants({ variant, size, fullWidth }), className);
    const content = (
      <>
        {isLoading && <Loader2 className="animate-spin" aria-hidden />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </>
    );

    const Comp = (href ? motion.a : motion.button) as React.ElementType;
    const specificProps = href
      ? { href }
      : { type: type ?? "button", disabled: disabled || isLoading };

    return (
      <Comp
        ref={ref}
        className={classes}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...specificProps}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
