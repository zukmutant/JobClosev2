import type { ContactCreateInput, PreparedContactCreateInput } from "./contact.ts";

const usefulContactFields = [
  "firstName",
  "lastName",
  "displayName",
  "companyName",
  "email",
  "phone",
  "companyCode",
  "vatCode",
] as const satisfies readonly (keyof ContactCreateInput)[];

export type PreciseContactDuplicateField =
  | "emailNormalized"
  | "phoneE164"
  | "companyCodeNormalized"
  | "vatCodeNormalized";

export type ContactDuplicateLookup =
  | {
      kind: "precise";
      businessId: string;
      fields: PreciseContactDuplicateField[];
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

export function hasNonEmptyContactField(input: ContactCreateInput): boolean {
  return usefulContactFields.some((field) => hasText(input[field]));
}

export function selectContactDuplicateLookup(
  businessId: string,
  input: PreparedContactCreateInput,
): ContactDuplicateLookup {
  const fields: PreciseContactDuplicateField[] = [];

  if (hasText(input.emailNormalized)) {
    fields.push("emailNormalized");
  }

  if (hasText(input.phoneE164)) {
    fields.push("phoneE164");
  }

  if (hasText(input.companyCodeNormalized)) {
    fields.push("companyCodeNormalized");
  }

  if (hasText(input.vatCodeNormalized)) {
    fields.push("vatCodeNormalized");
  }

  if (fields.length > 0) {
    return { kind: "precise", businessId, fields };
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
