import Link from "next/link";
import ScrollRevealGroup from "@/components/ScrollRevealGroup";
import { SiteGridShell, siteGridStyles } from "@/components/SiteGrid";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <section
      className="w-full py-10 sm:py-14 md:py-16 md:backdrop-blur-[50px]"
      aria-labelledby="header-headline"
    >
      <SiteGridShell>
        <ScrollRevealGroup
          playOnMount
          className={`${siteGridStyles.grid} ${styles.headerGrid}`}
        >
          <div className={styles.textBlock}>
            <h1 id="header-headline" className={styles.headline} data-reveal>
              Design leadership that fits your company&apos;s stage, pace, and way
              of building.
            </h1>
            <p className={styles.subheading} data-reveal>
              Rose Lane Studio is for companies that need experienced design
              leadership{" "}
              <span className={styles.subheadingSuffix}>
                — not someday, but now.
              </span>
            </p>
          </div>
          <Link href="/contact" className={styles.button} data-reveal>
            <span className={styles.buttonLabel}>Get in touch</span>
          </Link>
        </ScrollRevealGroup>
      </SiteGridShell>
    </section>
  );
}
