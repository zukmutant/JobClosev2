import type { PreparedContactCreateInput } from "./contact.ts";
import type { BlockingContactDuplicate, ContactRepository } from "./contact-repository.ts";
import { isDuplicateContactError } from "./contact-repository.ts";
import { hasNonEmptyContactField, selectContactDuplicateLookup } from "./contact-creation-rules.ts";
import { preparedContactCreateInputSchema } from "./contact-validation.ts";

export type CreateContactCommand = {
  businessId: string;
  input: PreparedContactCreateInput;
};

export type CreateContactResult =
  | {
      ok: true;
      contactId: string;
    }
  | {
      ok: false;
      reason: "invalidInput" | "emptyContact" | "duplicateContact";
      duplicate?: BlockingContactDuplicate;
    };

export async function createContact(
  command: CreateContactCommand,
  repository: ContactRepository,
): Promise<CreateContactResult> {
  const validation = preparedContactCreateInputSchema.safeParse(command.input);

  if (!validation.success) {
    return { ok: false, reason: "invalidInput" };
  }

  if (!hasNonEmptyContactField(command.input)) {
    return { ok: false, reason: "emptyContact" };
  }

  const duplicateLookup = selectContactDuplicateLookup(command.businessId, command.input);

  if (duplicateLookup.kind !== "none") {
    const duplicate = await repository.findBlockingDuplicate(duplicateLookup);

    if (duplicate !== null) {
      return { ok: false, reason: "duplicateContact", duplicate };
    }
  }

  try {
    const contact = await repository.createContact({
      businessId: command.businessId,
      ...command.input,
    });

    return { ok: true, contactId: contact.id };
  } catch (error) {
    if (isDuplicateContactError(error)) {
      return { ok: false, reason: "duplicateContact", duplicate: error.duplicate };
    }

    throw error;
  }
}
