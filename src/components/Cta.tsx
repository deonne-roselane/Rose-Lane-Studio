import Link from "next/link";
import ScrollRevealGroup from "@/components/ScrollRevealGroup";
import headerStyles from "./Header.module.css";
import styles from "./Cta.module.css";

export default function Cta() {
  return (
    <section
      id="contact"
      className={styles.cta}
      aria-labelledby="cta-headline"
    >
      <div className={`mx-auto w-full max-w-site ${styles.inner}`}>
        <ScrollRevealGroup className={styles.content}>
          <h2 id="cta-headline" className={styles.headline} data-reveal>
            Think there&apos;s a fit? Let&apos;s find out.
          </h2>
          <Link
            href="/contact"
            className={`${headerStyles.button} ${styles.button}`}
            data-reveal
          >
            <span className={headerStyles.buttonLabel}>Get in touch</span>
          </Link>
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
