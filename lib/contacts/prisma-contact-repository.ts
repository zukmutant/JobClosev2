import type { Contact as PrismaContact, Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "../server/prisma.ts";
import type { Contact, ContactCreateRecord } from "./contact.ts";
import type {
  BlockingContactDuplicate,
  BlockingContactDuplicateLookup,
  ContactRepository,
} from "./contact-repository.ts";

type ContactDelegate = Pick<PrismaClient["contact"], "create" | "findFirst">;

export class PrismaContactRepository implements ContactRepository {
  private readonly contacts: ContactDelegate;

  constructor(contacts: ContactDelegate) {
    this.contacts = contacts;
  }

  async findBlockingDuplicate(
    lookup: BlockingContactDuplicateLookup,
  ): Promise<BlockingContactDuplicate | null> {
    if (lookup.kind === "precise") {
      return this.findPreciseDuplicate(lookup);
    }

    return this.findNameDuplicate(lookup);
  }

  async createContact(input: ContactCreateRecord): Promise<Contact> {
    const contact = await this.contacts.create({
      data: {
        businessId: input.businessId,
        firstName: input.firstName,
        lastName: input.lastName,
        displayName: input.displayName,
        companyName: input.companyName,
        firstNameNormalized: input.firstNameNormalized,
        lastNameNormalized: input.lastNameNormalized,
        displayNameNormalized: input.displayNameNormalized,
        companyNameNormalized: input.companyNameNormalized,
        email: input.email,
        emailNormalized: input.emailNormalized,
        emailDomain: input.emailDomain,
        phone: input.phone,
        phoneE164: input.phoneE164,
        phoneRegion: input.phoneRegion,
        companyCode: input.companyCode,
        companyCodeNormalized: input.companyCodeNormalized,
        vatCode: input.vatCode,
        vatCodeNormalized: input.vatCodeNormalized,
        phoneSmsEnabled: input.phoneSmsEnabled,
        phoneWhatsappEnabled: input.phoneWhatsappEnabled,
        phoneTelegramEnabled: input.phoneTelegramEnabled,
      },
    });

    return toContact(contact);
  }

  private async findPreciseDuplicate(
    lookup: Extract<BlockingContactDuplicateLookup, { kind: "precise" }>,
  ): Promise<BlockingContactDuplicate | null> {
    const conditions: Prisma.ContactWhereInput[] = [];

    if (lookup.values.emailNormalized !== undefined) {
      conditions.push({ emailNormalized: lookup.values.emailNormalized });
    }

    if (lookup.values.phoneE164 !== undefined) {
      conditions.push({ phoneE164: lookup.values.phoneE164 });
    }

    if (lookup.values.companyCodeNormalized !== undefined) {
      conditions.push({ companyCodeNormalized: lookup.values.companyCodeNormalized });
    }

    if (lookup.values.vatCodeNormalized !== undefined) {
      conditions.push({ vatCodeNormalized: lookup.values.vatCodeNormalized });
    }

    if (conditions.length === 0) {
      return null;
    }

    const contact = await this.contacts.findFirst({
      where: {
        businessId: lookup.businessId,
        removedFromActiveAt: null,
        OR: conditions,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (contact === null) {
      return null;
    }

    return {
      contactId: contact.id,
      reason: getPreciseDuplicateReason(contact, lookup),
    };
  }

  private async findNameDuplicate(
    lookup: Extract<BlockingContactDuplicateLookup, { kind: "name" }>,
  ): Promise<BlockingContactDuplicate | null> {
    const contact = await this.contacts.findFirst({
      where: {
        businessId: lookup.businessId,
        removedFromActiveAt: null,
        firstNameNormalized: lookup.firstNameNormalized ?? null,
        lastNameNormalized: lookup.lastNameNormalized ?? null,
        displayNameNormalized: lookup.displayNameNormalized ?? null,
        companyNameNormalized: lookup.companyNameNormalized ?? null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (contact === null) {
      return null;
    }

    return {
      contactId: contact.id,
      reason: "name",
    };
  }
}

export const contactRepository = new PrismaContactRepository(prisma.contact);

function getPreciseDuplicateReason(
  contact: PrismaContact,
  lookup: Extract<BlockingContactDuplicateLookup, { kind: "precise" }>,
): BlockingContactDuplicate["reason"] {
  if (
    lookup.values.emailNormalized !== undefined &&
    contact.emailNormalized === lookup.values.emailNormalized
  ) {
    return "email";
  }

  if (lookup.values.phoneE164 !== undefined && contact.phoneE164 === lookup.values.phoneE164) {
    return "phone";
  }

  if (
    lookup.values.companyCodeNormalized !== undefined &&
    contact.companyCodeNormalized === lookup.values.companyCodeNormalized
  ) {
    return "companyCode";
  }

  if (
    lookup.values.vatCodeNormalized !== undefined &&
    contact.vatCodeNormalized === lookup.values.vatCodeNormalized
  ) {
    return "vatCode";
  }

  return "email";
}

function toContact(contact: PrismaContact): Contact {
  return {
    id: contact.id,
    businessId: contact.businessId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    displayName: contact.displayName,
    companyName: contact.companyName,
    firstNameNormalized: contact.firstNameNormalized,
    lastNameNormalized: contact.lastNameNormalized,
    displayNameNormalized: contact.displayNameNormalized,
    companyNameNormalized: contact.companyNameNormalized,
    email: contact.email,
    emailNormalized: contact.emailNormalized,
    emailDomain: contact.emailDomain,
    phone: contact.phone,
    phoneE164: contact.phoneE164,
    phoneRegion: contact.phoneRegion,
    companyCode: contact.companyCode,
    companyCodeNormalized: contact.companyCodeNormalized,
    vatCode: contact.vatCode,
    vatCodeNormalized: contact.vatCodeNormalized,
    phoneSmsEnabled: contact.phoneSmsEnabled,
    phoneWhatsappEnabled: contact.phoneWhatsappEnabled,
    phoneTelegramEnabled: contact.phoneTelegramEnabled,
    removedFromActiveAt: contact.removedFromActiveAt,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  };
}
