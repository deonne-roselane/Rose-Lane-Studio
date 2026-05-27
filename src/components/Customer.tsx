import Image from "next/image";
import styles from "./Customer.module.css";

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

function CustomerCard({ headline, tags, links }: CustomerCardData) {
  return (
    <article className={styles.card}>
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
    </article>
  );
}

export default function Customer() {
  return (
    <section className={styles.customer} aria-labelledby="customer-title">
      <div className="mx-auto w-full max-w-site px-4 py-10 sm:px-6 sm:py-14 md:py-16">
        <h2 id="customer-title" className={styles.title}>
          You&apos;re in the right place if...
        </h2>

        <div className={styles.content}>
          <div className={styles.background} aria-hidden="true">
            <div className={styles.sphere} />
            <div className={styles.blur} />
          </div>

          <div className={styles.cardGrid}>
            {cards.map((card) => (
              <CustomerCard key={card.headline} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
