"use client";

import { type ChangeEvent, FormEvent, useEffect, useId, useRef, useState } from "react";
import headerStyles from "./Header.module.css";
import styles from "./ContactForm.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ENGAGEMENT_OPTIONS = [
  "Fractional Head of Design",
  "Interim Design Leader",
  "Advisor",
  "Not sure",
] as const;

const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 1–3 months",
  "In the next 3–6 months",
  "Not sure yet",
] as const;

type FormValues = {
  name: string;
  company: string;
  role: string;
  email: string;
  engagementTypes: string[];
  situation: string;
  timeline: string;
  referral: string;
  timezone: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  engagementTypes?: string;
  timeline?: string;
};

const INITIAL_VALUES: FormValues = {
  name: "",
  company: "",
  role: "",
  email: "",
  engagementTypes: [],
  situation: "",
  timeline: "",
  referral: "",
  timezone: "",
};

const FORM_VALIDATION_ERROR =
  "Please complete the required fields above.";
const FORM_SUBMIT_ERROR =
  "Something went wrong sending your message. Please try again in a moment.";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className={styles.fieldError} role="alert">
      <span className={styles.fieldErrorBullet} aria-hidden="true">
        ●
      </span>
      <span className={styles.fieldErrorText}>{message}</span>
    </p>
  );
}

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const formId = useId();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useScrollReveal(sectionRef, { playOnMount: true });

  useEffect(() => {
    setValues((current) => ({
      ...current,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }));
  }, []);

  useEffect(() => {
    if (!formError) return;
    formErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formError]);

  const updateField =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      if (field === "name" || field === "email") {
        setFieldErrors((current) => ({ ...current, [field]: undefined }));
      }
    };

  const toggleEngagement = (option: string) => {
    setValues((current) => {
      const selected = current.engagementTypes.includes(option);
      return {
        ...current,
        engagementTypes: selected
          ? current.engagementTypes.filter((item) => item !== option)
          : [...current.engagementTypes, option],
      };
    });
    setFieldErrors((current) => ({ ...current, engagementTypes: undefined }));
  };

  const selectTimeline = (option: string) => {
    setValues((current) => ({
      ...current,
      timeline: current.timeline === option ? "" : option,
    }));
    setFieldErrors((current) => ({ ...current, timeline: undefined }));
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!values.name.trim()) {
      errors.name = "Please enter your name.";
    }

    if (!values.email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!isValidEmail(values.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (values.engagementTypes.length === 0) {
      errors.engagementTypes = "Please choose at least one engagement type.";
    }

    if (!values.timeline.trim()) {
      errors.timeline = "Please choose when you're looking to get started.";
    }

    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError(FORM_VALIDATION_ERROR);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      let data: { ok?: boolean } = {};
      try {
        data = (await response.json()) as { ok?: boolean };
      } catch {
        // Non-JSON error responses still surface the form-level message below.
      }

      if (!response.ok || !data.ok) {
        setFormError(FORM_SUBMIT_ERROR);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setFormError(FORM_SUBMIT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameErrorId = `${formId}-name-error`;
  const emailErrorId = `${formId}-email-error`;
  const engagementErrorId = `${formId}-engagement-error`;
  const timelineErrorId = `${formId}-timeline-error`;
  const formErrorId = `${formId}-form-error`;

  return (
    <section
      ref={sectionRef}
      className={styles.contact}
      aria-labelledby={isSubmitted ? `${formId}-confirmation-headline` : `${formId}-headline`}
    >
      <div className={`mx-auto w-full max-w-site ${styles.inner}`}>
        {isSubmitted ? (
          <div className={styles.confirmation}>
            <div className={styles.checkCircle} aria-hidden="true">
              ✓
            </div>
            <h2
              id={`${formId}-confirmation-headline`}
              className={styles.confirmationHeadline}
            >
              We&apos;ll be in touch.
            </h2>
            <p className={styles.confirmationBody}>
              You&apos;ll hear from Deonne soon.
            </p>
          </div>
        ) : (
          <div className={styles.layout}>
            <header className={styles.header}>
              <h2 id={`${formId}-headline`} className={styles.headline} data-reveal>
                Get in touch.
              </h2>
              <p className={styles.intro} data-reveal>
                Fill out the form and Deonne will be in touch soon.
              </p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label
                    className={`${styles.label} ${fieldErrors.name ? styles.labelError : ""}`}
                    htmlFor={`${formId}-name`}
                  >
                    Name
                  </label>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
                    value={values.name}
                    onChange={updateField("name")}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? nameErrorId : undefined}
                    required
                  />
                  {fieldErrors.name ? (
                    <FieldError id={nameErrorId} message={fieldErrors.name} />
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label
                    className={`${styles.label} ${fieldErrors.email ? styles.labelError : ""}`}
                    htmlFor={`${formId}-email`}
                  >
                    Email
                  </label>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
                    value={values.email}
                    onChange={updateField("email")}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? emailErrorId : undefined}
                    required
                  />
                  {fieldErrors.email ? (
                    <FieldError id={emailErrorId} message={fieldErrors.email} />
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${formId}-company`}>
                    Company
                  </label>
                  <input
                    id={`${formId}-company`}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Company name"
                    className={styles.input}
                    value={values.company}
                    onChange={updateField("company")}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${formId}-role`}>
                    Role
                  </label>
                  <input
                    id={`${formId}-role`}
                    name="role"
                    type="text"
                    autoComplete="organization-title"
                    placeholder="Your role at your company"
                    className={styles.input}
                    value={values.role}
                    onChange={updateField("role")}
                  />
                </div>
              </div>

              <div
                role="group"
                className={styles.pillField}
                aria-labelledby={`${formId}-engagement-label`}
                aria-describedby={
                  fieldErrors.engagementTypes ? engagementErrorId : undefined
                }
              >
                <p
                  id={`${formId}-engagement-label`}
                  className={`${styles.label} ${fieldErrors.engagementTypes ? styles.labelError : ""}`}
                >
                  What kind of engagement are you thinking?
                </p>
                <div className={styles.pills}>
                  {ENGAGEMENT_OPTIONS.map((option) => {
                    const selected = values.engagementTypes.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.pill} ${selected ? styles.pillSelected : ""}`}
                        aria-pressed={selected}
                        onClick={() => toggleEngagement(option)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.engagementTypes ? (
                  <FieldError
                    id={engagementErrorId}
                    message={fieldErrors.engagementTypes}
                  />
                ) : null}
              </div>

              <div className={`${styles.field} ${styles.fieldWide}`}>
                <label className={styles.label} htmlFor={`${formId}-situation`}>
                  Describe the situation
                </label>
                <textarea
                  id={`${formId}-situation`}
                  name="situation"
                  placeholder="What's going on, and what are you trying to solve? The more specific, the better."
                  className={styles.textarea}
                  value={values.situation}
                  onChange={updateField("situation")}
                />
              </div>

              <div
                role="group"
                className={styles.pillField}
                aria-labelledby={`${formId}-timeline-label`}
                aria-describedby={
                  fieldErrors.timeline ? timelineErrorId : undefined
                }
              >
                <p
                  id={`${formId}-timeline-label`}
                  className={`${styles.label} ${fieldErrors.timeline ? styles.labelError : ""}`}
                >
                  When are you looking to get started?
                </p>
                <div className={styles.pills}>
                  {TIMELINE_OPTIONS.map((option) => {
                    const selected = values.timeline === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.pill} ${selected ? styles.pillSelected : ""}`}
                        aria-pressed={selected}
                        onClick={() => selectTimeline(option)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.timeline ? (
                  <FieldError
                    id={timelineErrorId}
                    message={fieldErrors.timeline}
                  />
                ) : null}
              </div>

              <div className={`${styles.field} ${styles.fieldColumn}`}>
                <label className={styles.label} htmlFor={`${formId}-referral`}>
                  How did you hear about Rose Lane Studio?
                </label>
                <input
                  id={`${formId}-referral`}
                  name="referral"
                  type="text"
                  placeholder="Referral, LinkedIn, search..."
                  className={styles.input}
                  value={values.referral}
                  onChange={updateField("referral")}
                />
              </div>

              <input type="hidden" name="timezone" value={values.timezone} readOnly />

              <div className={`${styles.submitWrap} ${styles.fieldColumn}`}>
                <button
                  type="submit"
                  className={`${headerStyles.button} ${styles.submit}`}
                  disabled={isSubmitting}
                  aria-describedby={formError ? formErrorId : undefined}
                >
                  <span className={headerStyles.buttonLabel}>
                    {isSubmitting ? "Sending…" : "Send message"}
                  </span>
                </button>
                {formError ? (
                  <p
                    ref={formErrorRef}
                    id={formErrorId}
                    className={styles.formErrorHelper}
                    role="alert"
                    aria-live="polite"
                  >
                    {formError}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
