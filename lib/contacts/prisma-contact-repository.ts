import { Prisma } from "@prisma/client";
import type { Contact as PrismaContact, PrismaClient } from "@prisma/client";

import { prisma } from "../server/prisma.ts";
import type { Contact, ContactCreateRecord } from "./contact.ts";
import type {
  BlockingContactDuplicate,
  BlockingContactDuplicateLookup,
  ContactRepository,
} from "./contact-repository.ts";
import { DuplicateContactError } from "./contact-repository.ts";

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
    let contact: PrismaContact;

    try {
      contact = await this.contacts.create({
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
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new DuplicateContactError(getDuplicateFromUniqueConstraint(error));
      }

      throw error;
    }

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

    const reason = getPreciseDuplicateReason(contact, lookup);

    if (reason === undefined) {
      return null;
    }

    return toBlockingDuplicate(contact, reason);
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

    return toBlockingDuplicate(contact, "name");
  }
}

export const contactRepository = new PrismaContactRepository(prisma.contact);

function getPreciseDuplicateReason(
  contact: PrismaContact,
  lookup: Extract<BlockingContactDuplicateLookup, { kind: "precise" }>,
): BlockingContactDuplicate["reason"] | undefined {
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

  return undefined;
}

function isPrismaUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return isObjectWithCode(error) && error.code === "P2002";
}

function isObjectWithCode(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

function getDuplicateFromUniqueConstraint(
  error: Prisma.PrismaClientKnownRequestError,
): BlockingContactDuplicate | undefined {
  const target = getConstraintTarget(error);

  if (includesAny(target, ["emailNormalized", "email_normalized", "email"])) {
    return { reason: "email" };
  }

  if (includesAny(target, ["phoneE164", "phone_e164", "phone"])) {
    return { reason: "phone" };
  }

  if (includesAny(target, ["companyCodeNormalized", "company_code_normalized", "company_code"])) {
    return { reason: "companyCode" };
  }

  if (includesAny(target, ["vatCodeNormalized", "vat_code_normalized", "vat_code"])) {
    return { reason: "vatCode" };
  }

  return undefined;
}

function getConstraintTarget(error: Prisma.PrismaClientKnownRequestError): string {
  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return target.join(" ");
  }

  return typeof target === "string" ? target : "";
}

function includesAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

function toBlockingDuplicate(
  contact: PrismaContact,
  reason: BlockingContactDuplicate["reason"],
): BlockingContactDuplicate {
  return {
    contactId: contact.id,
    reason,
    existingContact: {
      label: getContactLabel(contact),
      email: textOrUndefined(contact.email),
      phone: textOrUndefined(contact.phone),
      companyName: textOrUndefined(contact.companyName),
    },
  };
}

function getContactLabel(contact: PrismaContact): string {
  const name = textOrUndefined(contact.displayName) ?? joinText(contact.firstName, contact.lastName);
  const parts = [
    name,
    textOrUndefined(contact.companyName),
    textOrUndefined(contact.email),
    textOrUndefined(contact.phone),
  ].filter((value) => value !== undefined);

  return parts.length > 0 ? parts.join(" · ") : "Existing contact";
}

function joinText(...values: (string | null)[]): string | undefined {
  const parts = values.map(textOrUndefined).filter((value) => value !== undefined);

  return parts.length > 0 ? parts.join(" ") : undefined;
}

function textOrUndefined(value: string | null): string | undefined {
  return value !== null && value.trim().length > 0 ? value : undefined;
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
