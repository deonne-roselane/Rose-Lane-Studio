"use client";

import { type RefObject, useEffect } from "react";
import gsap from "gsap";

const REVEAL_OFFSET_Y = 24;
const REVEAL_DURATION = 0.6;
const REVEAL_EASE = "power2.out";
const DEFAULT_STAGGER = 0.1;
const FALLBACK_MS = 2500;

function markRevealed(targets: HTMLElement[]) {
  targets.forEach((el) => {
    el.setAttribute("data-revealed", "true");
  });
}

function revealInstant(targets: HTMLElement[]) {
  gsap.set(targets, { y: 0, opacity: 1, clearProps: "transform,opacity" });
  markRevealed(targets);
}

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
  const playOnMount = options?.playOnMount ?? false;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = gsap.utils.toArray<HTMLElement>(
      container.querySelectorAll("[data-reveal]:not([data-revealed])")
    );
    if (targets.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      revealInstant(targets);
      return;
    }

    let cancelled = false;
    let fallbackTimer: number | undefined;

    const finishReveal = () => {
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
    };

    const animateReveal = () => {
      if (cancelled) return;

      gsap.fromTo(
        targets,
        { y: REVEAL_OFFSET_Y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE,
          stagger,
          onComplete: () => {
            gsap.set(targets, { clearProps: "transform,opacity" });
            markRevealed(targets);
            finishReveal();
          },
        }
      );
    };

    fallbackTimer = window.setTimeout(() => {
      if (cancelled) return;
      revealInstant(targets);
      finishReveal();
    }, FALLBACK_MS);

    const runReveal = () => {
      // Double rAF helps iOS Safari finish layout before animating.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animateReveal();
        });
      });
    };

    if (playOnMount) {
      runReveal();
      return () => {
        cancelled = true;
        finishReveal();
        gsap.killTweensOf(targets);
      };
    }

    let revealed = false;

    const triggerReveal = () => {
      if (revealed || cancelled) return;
      revealed = true;
      observer.disconnect();
      runReveal();
    };

    const isInViewport = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh && rect.bottom > 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        triggerReveal();
      },
      {
        root: null,
        // No negative bottom inset — that prevented footer CTAs from ever intersecting
        // when scrolled to the end of the page (production / mobile).
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(container);

    if (isInViewport()) {
      triggerReveal();
    }

    const onResize = () => {
      if (!revealed && isInViewport()) {
        triggerReveal();
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);

    return () => {
      cancelled = true;
      finishReveal();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      gsap.killTweensOf(targets);
    };
  }, [containerRef, stagger, playOnMount]);
}
