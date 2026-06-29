import type { ContactCreateInput, PreparedContactCreateInput } from "./contact.ts";
import { z } from "zod";

const textFields = [
  "firstName",
  "lastName",
  "displayName",
  "companyName",
  "email",
  "phone",
  "companyCode",
  "vatCode",
] as const satisfies readonly (keyof ContactCreateInput)[];

const directEmailSchema = z.email();

export function prepareContactCreateInput(input: ContactCreateInput): PreparedContactCreateInput {
  const prepared: PreparedContactCreateInput = {};

  for (const field of textFields) {
    const value = trimToUndefined(input[field]);

    if (value !== undefined) {
      prepared[field] = value;
    }
  }

  if (prepared.phone !== undefined) {
    copyBoolean(input, prepared, "phoneSmsEnabled");
    copyBoolean(input, prepared, "phoneWhatsappEnabled");
    copyBoolean(input, prepared, "phoneTelegramEnabled");
  }

  prepared.firstNameNormalized = normalizeTextForExactMatch(prepared.firstName);
  prepared.lastNameNormalized = normalizeTextForExactMatch(prepared.lastName);
  prepared.displayNameNormalized = normalizeTextForExactMatch(prepared.displayName);
  prepared.companyNameNormalized = normalizeTextForExactMatch(prepared.companyName);

  const emailParts = getEmailParts(prepared.email);

  if (emailParts !== undefined) {
    prepared.emailNormalized = `${emailParts.localPart}@${emailParts.domain}`;
    prepared.emailDomain = emailParts.domain;
  }

  prepared.companyCodeNormalized = normalizeCode(prepared.companyCode);
  prepared.vatCodeNormalized = normalizeCode(prepared.vatCode);

  return stripUndefined(prepared);
}

function copyBoolean(
  input: ContactCreateInput,
  output: PreparedContactCreateInput,
  field: "phoneSmsEnabled" | "phoneWhatsappEnabled" | "phoneTelegramEnabled",
): void {
  if (input[field] !== undefined) {
    output[field] = input[field];
  }
}

function trimToUndefined(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeTextForExactMatch(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value.replace(/\s+/g, " ").toLowerCase();
}

function getEmailParts(
  value: string | undefined,
): { localPart: string; domain: string } | undefined {
  if (value === undefined) {
    return undefined;
  }

  // Direct email fields may use Zod email validation. Arbitrary-text email
  // extraction still needs the approved RFC-compatible parser slice.
  if (!directEmailSchema.safeParse(value).success) {
    return undefined;
  }

  const [localPart, domain, extra] = value.split("@");

  if (localPart === undefined || domain === undefined || extra !== undefined) {
    return undefined;
  }

  const normalizedLocalPart = localPart.toLowerCase();
  const normalizedDomain = domain.toLowerCase();

  if (normalizedLocalPart.length === 0 || normalizedDomain.length === 0) {
    return undefined;
  }

  return {
    localPart: normalizedLocalPart,
    domain: normalizedDomain,
  };
}

function normalizeCode(value: string | undefined): string | undefined {
  return value?.toUpperCase();
}

function stripUndefined(input: PreparedContactCreateInput): PreparedContactCreateInput {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as PreparedContactCreateInput;
}
