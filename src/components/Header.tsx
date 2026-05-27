import styles from "./Header.module.css";

export default function Header() {
  return (
    <section
      className="w-full backdrop-blur-[50px] py-10 sm:py-14 md:py-16"
      aria-labelledby="header-headline"
    >
      <div className="mx-auto flex w-full max-w-site flex-col items-center px-4 sm:px-6">
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-7 md:gap-8 lg:w-10/12 xl:w-8/12">
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <h1 id="header-headline" className={styles.headline}>
              Design leadership that fits your company&apos;s stage, pace, and way
              of building.
            </h1>
            <p className={styles.subheading}>
              Rose Lane Studio is for companies that need experienced design
              leadership{" "}
              <span className={styles.subheadingSuffix}>
                — not someday, but now.
              </span>
            </p>
          </div>
          <a
            href="#contact"
            className={`${styles.button} w-full sm:w-1/2 lg:w-[48.42%]`}
          >
            <span className={styles.buttonLabel}>Get in touch</span>
          </a>
        </div>
      </div>
    </section>
  );
}
