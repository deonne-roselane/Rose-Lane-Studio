"use client";

import { useId, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Image from "next/image";
import styles from "./Engagements.module.css";

type EngagementDetails = {
  intro: string;
  listHeading: string;
  items: string[];
};

type Engagement = {
  id: string;
  title: string;
  schedule: string;
  description: string;
  details?: EngagementDetails;
};

const engagements: Engagement[] = [
  {
    id: "fractional",
    title: "Fractional Head of Design",
    schedule: "2–4 days/week · Ongoing",
    description:
      "Experienced design leadership that's both strategic and hands-on. You get a design executive and senior IC all-in-one at a fraction of the cost, as well as a partner in finding your full-time design leader when the time comes.",
    details: {
      intro:
        "The right fit when experienced design judgment matters more than full-time design volume.",
      listHeading: "You'll get someone who can:",
      items: [
        "Set design direction and execute on what matters most",
        "Represent design where decisions get made, whether that's async or in the room",
        "Build the design systems and processes your team relies on",
        "Guide any other designers and/or help you make your first design leadership hire",
      ],
    },
  },
  {
    id: "interim",
    title: "Interim Design Leader",
    schedule: "3 days/week · Fixed term",
    description:
      "Design lead or management coverage for a defined period — parental leave, sudden departure, or a leadership gap between hires. You get someone who steps in quickly, keeps the team moving, and sets up what comes next.",
    details: {
      intro:
        "The right fit for when the pace can't change, even if the leader does.",
      listHeading: "You'll get someone who can:",
      items: [
        "Step into the design leadership role quickly",
        "Keep active projects moving without losing quality or momentum",
        "Make the design decisions that would normally fall to your lead",
        "Manage and support your design team through the transition",
      ],
    },
  },
  {
    id: "advisor",
    title: "Advisor",
    schedule: "Defined hours/month",
    description:
      "Design expertise applied to specific challenges and/or structured support for the designers on your team. Scoped to what you need.",
    details: {
      intro:
        "The right fit when you don't need embedded leadership, just focused design expertise.",
      listHeading:
        "You'll get strategic input on specific challenges — for example:",
      items: [
        "Design process and systems — making design faster, more consistent, and scalable",
        "Accessibility — ensuring your product works for everyone",
        "Privacy by design — building user trust into the design from the start",
        "Multi-channel — designing cohesive experiences across digital and physical touchpoints",
      ],
    },
  },
];

type EngagementRowProps = {
  engagement: Engagement;
  isExpanded: boolean;
  isDimmed: boolean;
  onToggle: () => void;
  panelId: string;
  buttonId: string;
};

function EngagementRow({
  engagement,
  isExpanded,
  isDimmed,
  onToggle,
  panelId,
  buttonId,
}: EngagementRowProps) {
  const { title, schedule, description, details } = engagement;
  const canExpand = Boolean(details);

  return (
    <article
      className={[
        styles.row,
        isExpanded && styles.rowExpanded,
        isDimmed && styles.rowDimmed,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.rowMain} data-reveal>
        <div className={styles.rowTitleCol}>
          <h3 className={styles.rowTitle}>{title}</h3>
          <p className={styles.rowSchedule}>{schedule}</p>
        </div>
        <div className={styles.rowBodyCol}>
          <p className={styles.rowDescription}>{description}</p>
          <div className={styles.rowToggleSpacer} aria-hidden="true" />
          {canExpand ? (
            <button
              type="button"
              id={buttonId}
              className={styles.toggle}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={onToggle}
            >
              <span className={styles.toggleText}>What this includes</span>
              <span
                className={[
                  styles.toggleIcon,
                  isExpanded && styles.toggleIconOpen,
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              >
                +
              </span>
            </button>
          ) : (
            <p className={styles.toggleStatic}>
              <span>What this includes</span>
              <span className={styles.toggleIcon} aria-hidden="true">
                +
              </span>
            </p>
          )}
        </div>
      </div>

      {canExpand && details && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          aria-hidden={!isExpanded}
          className={[
            styles.expandPanel,
            isExpanded && styles.expandPanelOpen,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className={styles.expandPanelInner}>
            <div className={styles.divider} aria-hidden="true">
              <Image
                src="/engagement-row-divider.png"
                alt=""
                width={955}
                height={2}
                className={styles.dividerImage}
              />
            </div>
            <div className={styles.detailsContent}>
              <p className={styles.detailsIntro}>{details.intro}</p>
              <p className={styles.detailsHeading}>{details.listHeading}</p>
              <ul className={styles.detailsList}>
                {details.items.map((item) => (
                  <li key={item} className={styles.detailsItem}>
                    <span className={styles.bullet} aria-hidden="true">
                      ✱
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Engagements() {
  const sectionId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  useScrollReveal(contentRef, { stagger: 0.12 });

  const handleToggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const hasExpandedRow = expandedIds.size > 0;

  return (
    <section
      id="engagements"
      className={styles.engagements}
      aria-labelledby={`${sectionId}-eyebrow`}
    >
      <div className={`mx-auto w-full max-w-site px-4 sm:px-6 ${styles.inner}`}>
        <div ref={contentRef} className={styles.content}>
          <p
            id={`${sectionId}-eyebrow`}
            className={styles.eyebrow}
            data-reveal
          >
            Types of engagements
          </p>

          <div className={styles.list}>
            {engagements.map((engagement) => {
              const isExpanded = expandedIds.has(engagement.id);
              const isDimmed = hasExpandedRow && !isExpanded;
              const panelId = `${sectionId}-panel-${engagement.id}`;
              const buttonId = `${sectionId}-toggle-${engagement.id}`;

              return (
                <EngagementRow
                  key={engagement.id}
                  engagement={engagement}
                  isExpanded={isExpanded}
                  isDimmed={isDimmed}
                  onToggle={() => handleToggle(engagement.id)}
                  panelId={panelId}
                  buttonId={buttonId}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
