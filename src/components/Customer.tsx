"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./Customer.module.css";

gsap.registerPlugin(ScrollTrigger);

const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

if (isTouchDevice) {
  ScrollTrigger.normalizeScroll(true);
}

type CustomerCardData = {
  headline: string;
  tags: string[];
  links: { label: string; href: string }[];
};

const cards: CustomerCardData[] = [
  {
    headline:
      "Your team doesn't have a design leader, but you're already making design decisions that you'll have to undo",
    tags: ["Lean team", "0 to 1", "Pre-Series B"],
    links: [{ label: "Fractional Head of Design", href: "#engagements" }],
  },
  {
    headline:
      "Design-to-development is slowing your team down, and there's no one experienced enough to fix it",
    tags: ["Inefficient process", "Handoff friction"],
    links: [{ label: "Fractional Head of Design", href: "#engagements" }],
  },
  {
    headline:
      "Your team is designing experiences beyond a screen and need a leader who can think across all of it",
    tags: ["Product/service expansion", "Multi-channel touchpoints"],
    links: [
      { label: "Fractional Head of Design", href: "#engagements" },
      { label: "Advisor", href: "#engagements" },
    ],
  },
  {
    headline:
      "Your design lead is out, and your team can't afford a gap at this stage",
    tags: ["Parental leave", "Interim coverage", "Sudden departure"],
    links: [{ label: "Interim Design Leader", href: "#engagements" }],
  },
];

const STICKY_BASE_PX = 96;
const STACK_OFFSET_PX = 22;

type CustomerCardProps = CustomerCardData & {
  index: number;
  cardRef: (element: HTMLElement | null) => void;
};

function CustomerCard({ headline, tags, links, index, cardRef }: CustomerCardProps) {
  return (
    <article
      ref={cardRef}
      className={styles.card}
      data-card
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <div className={styles.cardInner} data-card-inner>
        <div className={styles.cardTop}>
          <p className={styles.cardHeadline}>{headline}</p>
          <ul className={styles.tags} aria-label="Tags">
            {tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.divider} aria-hidden="true">
          <Image
            src="/customer-card-divider.png"
            alt=""
            width={664}
            height={2}
            className={styles.dividerImage}
          />
        </div>
        <div className={styles.cardBottom}>
          <p className={styles.needsLabel}>What you need</p>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>
                  <span>{link.label}</span>
                  <span className={styles.linkArrow} aria-hidden="true">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function Customer() {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useScrollReveal(sectionRef);

  useEffect(() => {
    const grid = cardGridRef.current;
    const content = contentRef.current;
    if (!grid || !content) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cardElements = cardRefs.current.filter(
      (element): element is HTMLElement => element !== null
    );
    if (cardElements.length === 0) return;

    const background = content.querySelector<HTMLElement>(
      "[data-sphere-background]"
    );
    const lastCard = cardElements[cardElements.length - 1];
    const stackScrollPad = grid.querySelector<HTMLElement>(
      "[data-stack-scroll-pad]"
    );
    const lastStickyTop =
      STICKY_BASE_PX + (cardElements.length - 1) * STACK_OFFSET_PX;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion && background) {
        ScrollTrigger.create({
          trigger: grid,
          start: "top top",
          endTrigger: stackScrollPad ?? lastCard,
          end: "bottom top",
          pin: background,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }

      if (prefersReducedMotion) return;

      cardElements.forEach((card, index) => {
        const nextCard = cardElements[index + 1];
        if (!nextCard) return;

        const inner = card.querySelector<HTMLElement>("[data-card-inner]");
        if (!inner) return;

        const nextStickyTop =
          STICKY_BASE_PX + (index + 1) * STACK_OFFSET_PX;

        gsap.fromTo(
          inner,
          { scale: 1 },
          {
            scale: 0.97,
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: `top ${nextStickyTop}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, grid);

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.customer}
      aria-labelledby="customer-title"
    >
      <div
        className={`mx-auto w-full max-w-site px-4 sm:px-6 ${styles.customerInner}`}
      >
        <h2 id="customer-title" className={styles.title} data-reveal>
          You&apos;re in the right place if...
        </h2>

        <div ref={contentRef} className={styles.content}>
          <div
            className={styles.background}
            data-sphere-background
            aria-hidden="true"
          >
            <div className={styles.sphereWrap}>
              <div className={styles.sphere} />
            </div>
          </div>

          <div ref={cardGridRef} className={styles.cardGrid}>
            {cards.map((card, index) => (
              <CustomerCard
                key={card.headline}
                {...card}
                index={index}
                cardRef={(element) => {
                  cardRefs.current[index] = element;
                }}
              />
            ))}
            <div
              className={styles.stackScrollPad}
              data-stack-scroll-pad
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
