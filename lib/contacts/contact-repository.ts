import type { Contact, ContactCreateRecord } from "./contact.ts";
import type { ContactDuplicateLookup } from "./contact-creation-rules.ts";

export type BlockingContactDuplicate = {
  contactId?: string;
  reason: "email" | "phone" | "companyCode" | "vatCode" | "name";
};

export type BlockingContactDuplicateLookup = Exclude<ContactDuplicateLookup, { kind: "none" }>;

export class DuplicateContactError extends Error {
  readonly duplicate?: BlockingContactDuplicate;

  constructor(duplicate?: BlockingContactDuplicate) {
    super("Duplicate contact");
    this.name = "DuplicateContactError";
    this.duplicate = duplicate;
  }
}

export function isDuplicateContactError(error: unknown): error is DuplicateContactError {
  return error instanceof DuplicateContactError;
}

export interface ContactRepository {
  findBlockingDuplicate(
    lookup: BlockingContactDuplicateLookup,
  ): Promise<BlockingContactDuplicate | null>;
  createContact(input: ContactCreateRecord): Promise<Contact>;
}
