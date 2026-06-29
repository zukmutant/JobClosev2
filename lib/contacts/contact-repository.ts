import type { Contact, ContactCreateRecord } from "./contact.ts";
import type { ContactDuplicateLookup } from "./contact-creation-rules.ts";

export type BlockingContactDuplicate = {
  contactId: string;
  reason: "email" | "phone" | "companyCode" | "vatCode" | "name";
};

export type BlockingContactDuplicateLookup = Exclude<ContactDuplicateLookup, { kind: "none" }>;

export interface ContactRepository {
  findBlockingDuplicate(
    lookup: BlockingContactDuplicateLookup,
  ): Promise<BlockingContactDuplicate | null>;
  createContact(input: ContactCreateRecord): Promise<Contact>;
}
