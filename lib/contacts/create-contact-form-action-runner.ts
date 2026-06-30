import type { ContactCreationFormState } from "./contact-creation-form-state.ts";
import type { BlockingContactDuplicate } from "./contact-repository.ts";
import type { CreateContactResult } from "./create-contact-service.ts";

export async function runContactCreationFormAction(
  formData: FormData,
  createContact: (input: unknown) => Promise<CreateContactResult>,
): Promise<ContactCreationFormState> {
  const result = await createContact(toContactCreatePayload(formData));

  return toContactCreationFormState(result);
}

function toContactCreatePayload(formData: FormData) {
  return {
    firstName: getFormString(formData, "firstName"),
    lastName: getFormString(formData, "lastName"),
    companyName: getFormString(formData, "companyName"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    phoneSmsEnabled: getFormBoolean(formData, "phoneSmsEnabled"),
    phoneWhatsappEnabled: getFormBoolean(formData, "phoneWhatsappEnabled"),
    phoneTelegramEnabled: getFormBoolean(formData, "phoneTelegramEnabled"),
  };
}

function getFormString(formData: FormData, field: string): string | undefined {
  const value = formData.get(field);

  return typeof value === "string" ? value : undefined;
}

function getFormBoolean(formData: FormData, field: string): boolean | undefined {
  return formData.has(field) ? formData.get(field) === "on" : undefined;
}

function toContactCreationFormState(result: CreateContactResult): ContactCreationFormState {
  if (result.ok) {
    return {
      status: "success",
      message: "Contact created.",
    };
  }

  if (result.reason === "invalidInput") {
    return {
      status: "invalidInput",
      message: "Invalid input. Check the contact fields and try again.",
    };
  }

  if (result.reason === "emptyContact") {
    return {
      status: "emptyContact",
      message: "Enter an email or phone.",
    };
  }

  const duplicateState: ContactCreationFormState = {
    status: "duplicateContact",
    message: getDuplicateContactMessage(result.duplicate),
  };

  if (result.duplicate !== undefined) {
    duplicateState.duplicate = result.duplicate;
  }

  return duplicateState;
}

function getDuplicateContactMessage(duplicate: BlockingContactDuplicate | undefined): string {
  if (duplicate === undefined) {
    return "Duplicate contact. This contact already exists.";
  }

  const reason = getDuplicateReasonLabel(duplicate.reason);

  if (duplicate.contactId !== undefined && duplicate.existingContact !== undefined) {
    return `Duplicate contact. Matched by ${reason}: ${duplicate.existingContact.label}.`;
  }

  return `Duplicate contact. Matched by ${reason}.`;
}

function getDuplicateReasonLabel(reason: BlockingContactDuplicate["reason"]): string {
  if (reason === "companyCode") {
    return "company code";
  }

  if (reason === "vatCode") {
    return "VAT code";
  }

  return reason;
}
