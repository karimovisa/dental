"use client";

import * as React from "react";
import {
  Accordion as AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface AccordionEntry {
  id?: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionEntry[];
  /** When true (default) only one panel is open at a time. */
  single?: boolean;
  className?: string;
}

/** Data-driven accordion with animated panels. Used for FAQ and detail lists. */
export function Accordion({ items, single = true, className }: AccordionProps) {
  return (
    <AccordionRoot
      multiple={!single}
      className={cn("w-full divide-y divide-border", className)}
    >
      {items.map((item, index) => {
        const value = item.id ?? String(index);
        return (
          <AccordionItem key={value} value={value} className="px-1">
            <AccordionTrigger className="text-left text-base font-medium">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </AccordionRoot>
  );
}
