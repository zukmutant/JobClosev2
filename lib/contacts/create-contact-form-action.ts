"use server";

import type { ContactCreationFormState } from "./contact-creation-form-state.ts";
import { createContactAction } from "./create-contact-action.ts";
import { runContactCreationFormAction } from "./create-contact-form-action-runner.ts";

export async function submitContactCreationForm(
  _previousState: ContactCreationFormState,
  formData: FormData,
): Promise<ContactCreationFormState> {
  return runContactCreationFormAction(formData, createContactAction);
}
