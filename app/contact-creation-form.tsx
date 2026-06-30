"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  CheckboxSet,
  FormFooter,
  FormGrid,
  FormGridFull,
  FormPanel,
  FormStatus,
  FormTitle,
  UiCheckbox,
  UiSubmitButton,
  UiTextInput,
} from "../components/ui/form-panel";
import {
  type ContactCreationFormState,
  initialContactCreationFormState,
} from "../lib/contacts/contact-creation-form-state.ts";
import { submitContactCreationForm } from "../lib/contacts/create-contact-form-action.ts";

export function ContactCreationForm() {
  const [state, formAction] = useActionState(
    submitContactCreationForm,
    initialContactCreationFormState,
  );
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
  });
  const hasPhone = formValues.phone.trim().length > 0;
  const isEmptyContact = Object.values(formValues).every((value) => value.trim().length === 0);

  const statusTone = getStatusTone(state.status);

  useEffect(() => {
    if (state.status !== "idle") {
      setFormValues({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
      });
    }
  }, [state.status]);

  return (
    <FormPanel action={formAction}>
      <FormTitle>Create contact</FormTitle>

      <FormGrid>
        <UiTextInput
          name="firstName"
          label="First name"
          type="text"
          autoComplete="given-name"
          value={formValues.firstName}
          onValueChange={(value) => setFormValues((current) => ({ ...current, firstName: value }))}
        />

        <UiTextInput
          name="lastName"
          label="Last name"
          type="text"
          autoComplete="family-name"
          value={formValues.lastName}
          onValueChange={(value) => setFormValues((current) => ({ ...current, lastName: value }))}
        />

        <FormGridFull>
          <UiTextInput
            name="companyName"
            label="Company name"
            type="text"
            autoComplete="organization"
            value={formValues.companyName}
            onValueChange={(value) =>
              setFormValues((current) => ({ ...current, companyName: value }))
            }
          />
        </FormGridFull>

        <UiTextInput
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formValues.email}
          onValueChange={(value) => setFormValues((current) => ({ ...current, email: value }))}
        />

        <UiTextInput
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={formValues.phone}
          onValueChange={(value) => setFormValues((current) => ({ ...current, phone: value }))}
        />
      </FormGrid>

      {hasPhone ? (
        <CheckboxSet legend="Phone channels">
          <UiCheckbox name="phoneSmsEnabled" label="SMS" />
          <UiCheckbox name="phoneWhatsappEnabled" label="WhatsApp" />
          <UiCheckbox name="phoneTelegramEnabled" label="Telegram" />
        </CheckboxSet>
      ) : null}

      <FormFooter>
        <SubmitButton disabledWhenEmpty={isEmptyContact} />
        <FormStatus tone={statusTone}>{state.message}</FormStatus>
      </FormFooter>
    </FormPanel>
  );
}

function SubmitButton({ disabledWhenEmpty }: Readonly<{ disabledWhenEmpty: boolean }>) {
  const { pending } = useFormStatus();

  return (
    <UiSubmitButton disabled={pending || disabledWhenEmpty}>
      {pending ? "Saving..." : "Create contact"}
    </UiSubmitButton>
  );
}

function getStatusTone(status: ContactCreationFormState["status"]) {
  if (status === "success") {
    return "success";
  }

  if (status === "idle") {
    return "neutral";
  }

  return "error";
}
