import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Nav from "@/components/Nav";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Get in touch — Rose Lane Studio",
  description:
    "Fill out the form and Deonne will be in touch soon.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <ContactForm />
      </main>
    </>
  );
}
