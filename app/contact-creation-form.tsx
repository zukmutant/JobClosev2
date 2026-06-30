"use client";

import { useActionState, useState } from "react";
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
  const [phone, setPhone] = useState("");
  const hasPhone = phone.trim().length > 0;

  const statusTone = getStatusTone(state.status);

  return (
    <FormPanel action={formAction}>
      <FormTitle>Create contact</FormTitle>

      <FormGrid>
        <UiTextInput name="firstName" label="First name" type="text" autoComplete="given-name" />

        <UiTextInput name="lastName" label="Last name" type="text" autoComplete="family-name" />

        <FormGridFull>
          <UiTextInput
            name="companyName"
            label="Company name"
            type="text"
            autoComplete="organization"
          />
        </FormGridFull>

        <UiTextInput name="email" label="Email" type="email" autoComplete="email" />

        <UiTextInput
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.currentTarget.value)}
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
        <SubmitButton />
        <FormStatus tone={statusTone}>{state.message}</FormStatus>
      </FormFooter>
    </FormPanel>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <UiSubmitButton>{pending ? "Saving..." : "Create contact"}</UiSubmitButton>
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
