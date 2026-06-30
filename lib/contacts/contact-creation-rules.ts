import type { ContactCreateInput, PreparedContactCreateInput } from "./contact.ts";

const manualContactRequiredFields = [
  "email",
  "phone",
] as const satisfies readonly (keyof ContactCreateInput)[];

export type PreciseContactDuplicateField =
  | "emailNormalized"
  | "phoneE164"
  | "companyCodeNormalized"
  | "vatCodeNormalized";

export type PreciseContactDuplicateValues = Partial<Record<PreciseContactDuplicateField, string>>;

export type ContactDuplicateLookup =
  | {
      kind: "precise";
      businessId: string;
      values: PreciseContactDuplicateValues;
    }
  | {
      kind: "name";
      businessId: string;
      firstNameNormalized?: string;
      lastNameNormalized?: string;
      displayNameNormalized?: string;
      companyNameNormalized?: string;
    }
  | {
      kind: "none";
      businessId: string;
    };

export function hasRequiredManualContactField(input: ContactCreateInput): boolean {
  return manualContactRequiredFields.some((field) => hasText(input[field]));
}

export function selectContactDuplicateLookup(
  businessId: string,
  input: PreparedContactCreateInput,
): ContactDuplicateLookup {
  const values: PreciseContactDuplicateValues = {};

  if (hasText(input.emailNormalized)) {
    values.emailNormalized = input.emailNormalized;
  }

  if (hasText(input.phoneE164)) {
    values.phoneE164 = input.phoneE164;
  }

  if (hasText(input.companyCodeNormalized)) {
    values.companyCodeNormalized = input.companyCodeNormalized;
  }

  if (hasText(input.vatCodeNormalized)) {
    values.vatCodeNormalized = input.vatCodeNormalized;
  }

  if (Object.keys(values).length > 0) {
    return { kind: "precise", businessId, values };
  }

  const nameLookup = {
    firstNameNormalized: textOrUndefined(input.firstNameNormalized),
    lastNameNormalized: textOrUndefined(input.lastNameNormalized),
    displayNameNormalized: textOrUndefined(input.displayNameNormalized),
    companyNameNormalized: textOrUndefined(input.companyNameNormalized),
  };

  if (Object.values(nameLookup).some((value) => value !== undefined)) {
    return { kind: "name", businessId, ...nameLookup };
  }

  return { kind: "none", businessId };
}

function hasText(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0;
}

function textOrUndefined(value: string | undefined): string | undefined {
  return hasText(value) ? value : undefined;
}
