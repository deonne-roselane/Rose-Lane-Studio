"use client";

import { useRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type ScrollRevealGroupProps<T extends ElementType = "div"> = {
  as?: T;
  stagger?: number;
  start?: string;
  playOnMount?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export default function ScrollRevealGroup<T extends ElementType = "div">({
  as,
  stagger,
  start,
  playOnMount,
  children,
  ...rest
}: ScrollRevealGroupProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { stagger, start, playOnMount });

  return (
    <Component ref={ref} {...rest}>
      {children}
    </Component>
  );
}
