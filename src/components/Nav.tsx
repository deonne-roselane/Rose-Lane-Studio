import Image from "next/image";
import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <header
      className={`${styles.nav} w-full border-b border-[var(--faint-gray)] bg-[color-mix(in_srgb,var(--white)_66%,transparent)] shadow-[0_2px_4px_rgba(0,0,0,0.04)] backdrop-blur-[10px]`}
    >
      <div className="mx-auto flex h-16 w-full max-w-site items-center px-4 sm:px-6">
        <Link href="/" className={`${styles.navHome} flex items-center gap-2`}>
          <span className="relative block size-7 shrink-0">
            <Image
              src="/logo-mark.png"
              alt=""
              width={28}
              height={28}
              className="size-full object-contain"
              priority
            />
          </span>
          <span
            className={`${styles.navWordmark} text-base sm:text-[length:var(--body-body-2-font-size)]`}
          >
            Rose Lane Studio
          </span>
        </Link>
      </div>
    </header>
  );
}
