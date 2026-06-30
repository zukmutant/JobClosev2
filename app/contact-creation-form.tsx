"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  type ContactCreationFormState,
  initialContactCreationFormState,
} from "../lib/contacts/contact-creation-form-state.ts";
import {
  submitContactCreationForm,
} from "../lib/contacts/create-contact-form-action.ts";

export function ContactCreationForm() {
  const [state, formAction] = useActionState(
    submitContactCreationForm,
    initialContactCreationFormState,
  );
  const [phone, setPhone] = useState("");
  const hasPhone = phone.trim().length > 0;

  return (
    <form action={formAction} style={styles.form}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create contact</h1>
      </div>

      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>First name</span>
          <input name="firstName" type="text" autoComplete="given-name" style={styles.input} />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Last name</span>
          <input name="lastName" type="text" autoComplete="family-name" style={styles.input} />
        </label>

        <label style={styles.fieldWide}>
          <span style={styles.label}>Company name</span>
          <input name="companyName" type="text" autoComplete="organization" style={styles.input} />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Email</span>
          <input name="email" type="email" autoComplete="email" style={styles.input} />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Phone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.currentTarget.value)}
            style={styles.input}
          />
        </label>
      </div>

      {hasPhone ? (
        <fieldset style={styles.channels}>
          <legend style={styles.legend}>Phone channels</legend>
          <label style={styles.check}>
            <input name="phoneSmsEnabled" type="checkbox" />
            <span>SMS</span>
          </label>
          <label style={styles.check}>
            <input name="phoneWhatsappEnabled" type="checkbox" />
            <span>WhatsApp</span>
          </label>
          <label style={styles.check}>
            <input name="phoneTelegramEnabled" type="checkbox" />
            <span>Telegram</span>
          </label>
        </fieldset>
      ) : null}

      <div style={styles.footer}>
        <SubmitButton />
        <p aria-live="polite" style={getStatusStyle(state.status)}>
          {state.message}
        </p>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" style={styles.button}>
      {pending ? "Saving..." : "Create contact"}
    </button>
  );
}

function getStatusStyle(status: ContactCreationFormState["status"]) {
  if (status === "success") {
    return styles.success;
  }

  if (status === "idle") {
    return styles.status;
  }

  return styles.error;
}

const styles = {
  form: {
    width: "min(100%, 720px)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 24,
    border: "1px solid #d7dde5",
    borderRadius: 8,
    background: "#ffffff",
    boxShadow: "0 16px 40px rgba(21, 34, 50, 0.08)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    margin: 0,
    color: "#132033",
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fieldWide: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    gridColumn: "1 / -1",
  },
  label: {
    color: "#26384f",
    fontSize: 14,
    fontWeight: 650,
  },
  input: {
    minHeight: 42,
    border: "1px solid #b9c3cf",
    borderRadius: 6,
    padding: "8px 10px",
    color: "#132033",
    font: "inherit",
  },
  channels: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    margin: 0,
    padding: 16,
    border: "1px solid #d7dde5",
    borderRadius: 8,
  },
  legend: {
    padding: "0 6px",
    color: "#26384f",
    fontSize: 14,
    fontWeight: 650,
  },
  check: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#132033",
    fontSize: 14,
  },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 14,
  },
  button: {
    minHeight: 42,
    border: 0,
    borderRadius: 6,
    padding: "0 16px",
    background: "#126b5f",
    color: "#ffffff",
    font: "inherit",
    fontWeight: 700,
    cursor: "pointer",
  },
  status: {
    minHeight: 22,
    margin: 0,
    color: "#516173",
    fontSize: 14,
  },
  success: {
    minHeight: 22,
    margin: 0,
    color: "#126b5f",
    fontSize: 14,
    fontWeight: 650,
  },
  error: {
    minHeight: 22,
    margin: 0,
    color: "#a23030",
    fontSize: 14,
    fontWeight: 650,
  },
} as const;
