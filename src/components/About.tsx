import Image from "next/image";
import ScrollRevealGroup from "@/components/ScrollRevealGroup";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className={styles.about} aria-labelledby="about-eyebrow">
      <div className="mx-auto w-full max-w-site px-4 py-10 sm:px-6 sm:py-14 md:py-16">
        <ScrollRevealGroup className={styles.content}>
          <div className={styles.text}>
            <p id="about-eyebrow" className={styles.eyebrow} data-reveal>
              Who you work with
            </p>
            <p className={styles.body} data-reveal>
              Deonne Castaneda is the design leader behind Rose Lane Studio. For
              over 15 years, she&apos;s led teams at Apple, built design from the
              ground up at startups like Block Party (acquired by DeleteMe),
              keynoted at SXSW, and been interviewed about designing privacy into
              tech products. She knows what it looks like when design leadership
              is missing and exactly what it takes to fix it.
            </p>
          </div>
          <div className={styles.photo} data-reveal>
            <Image
              src="/deonne-roselane.png"
              alt="Deonne Castaneda"
              width={270}
              height={270}
              className={styles.photoImage}
              sizes="(max-width: 1024px) 240px, 270px"
            />
          </div>
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
