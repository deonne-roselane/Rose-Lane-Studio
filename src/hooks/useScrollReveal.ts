"use client";

import { type RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_OFFSET_Y = 24;
const REVEAL_DURATION = 0.6;
const REVEAL_EASE = "power2.out";
const DEFAULT_STAGGER = 0.1;
const DEFAULT_START = "top 82%";

export function useScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  options?: {
    stagger?: number;
    start?: string;
    /** Play immediately on mount (e.g. hero above the fold). */
    playOnMount?: boolean;
  }
) {
  const stagger = options?.stagger ?? DEFAULT_STAGGER;
  const start = options?.start ?? DEFAULT_START;
  const playOnMount = options?.playOnMount ?? false;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = gsap.utils.toArray<HTMLElement>(
      container.querySelectorAll("[data-reveal]")
    );
    if (targets.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(targets, { y: 0, opacity: 1, clearProps: "transform,opacity" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { y: REVEAL_OFFSET_Y, opacity: 0 });

      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        stagger,
        ...(playOnMount
          ? {}
          : {
              scrollTrigger: {
                trigger: container,
                start,
                once: true,
                invalidateOnRefresh: true,
              },
            }),
      });
    }, container);

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [containerRef, stagger, start, playOnMount]);
}
