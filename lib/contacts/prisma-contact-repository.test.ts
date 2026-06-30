import assert from "node:assert/strict";
import test from "node:test";

import { Prisma } from "@prisma/client";

import { DuplicateContactError } from "./contact-repository.ts";
import { PrismaContactRepository } from "./prisma-contact-repository.ts";

const businessId = "11111111-1111-4111-8111-111111111111";

test("Prisma repository builds active precise duplicate lookup with prepared values only", async () => {
  const delegate = new FakeContactDelegate({
    id: "22222222-2222-4222-8222-222222222222",
    businessId,
    firstName: "Ada",
    lastName: "Lovelace",
    companyName: "Analytical Engines",
    email: "Ada@Example.test",
    phone: "+370 600 00000",
    emailNormalized: "ada@example.test",
  });
  const repository = new PrismaContactRepository(delegate);

  const duplicate = await repository.findBlockingDuplicate({
    kind: "precise",
    businessId,
    values: {
      emailNormalized: "ada@example.test",
      phoneE164: "+37061234567",
    },
  });

  assert.deepEqual(delegate.lastFindFirstArgs, {
    where: {
      businessId,
      removedFromActiveAt: null,
      OR: [{ emailNormalized: "ada@example.test" }, { phoneE164: "+37061234567" }],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  assert.deepEqual(duplicate, {
    contactId: "22222222-2222-4222-8222-222222222222",
    reason: "email",
    existingContact: {
      label: "Ada Lovelace · Analytical Engines · Ada@Example.test · +370 600 00000",
      email: "Ada@Example.test",
      phone: "+370 600 00000",
      companyName: "Analytical Engines",
    },
  });
});

test("Prisma repository builds active name duplicate lookup as an exact normalized name tuple", async () => {
  const delegate = new FakeContactDelegate({
    id: "22222222-2222-4222-8222-222222222222",
    businessId,
    displayName: "Ada Lovelace",
    firstNameNormalized: "ada",
    lastNameNormalized: "lovelace",
    email: "ada@example.test",
  });
  const repository = new PrismaContactRepository(delegate);

  const duplicate = await repository.findBlockingDuplicate({
    kind: "name",
    businessId,
    firstNameNormalized: "ada",
    lastNameNormalized: "lovelace",
  });

  assert.deepEqual(delegate.lastFindFirstArgs, {
    where: {
      businessId,
      removedFromActiveAt: null,
      firstNameNormalized: "ada",
      lastNameNormalized: "lovelace",
      displayNameNormalized: null,
      companyNameNormalized: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  assert.deepEqual(duplicate, {
    contactId: "22222222-2222-4222-8222-222222222222",
    reason: "name",
    existingContact: {
      label: "Ada Lovelace · ada@example.test",
      email: "ada@example.test",
      phone: undefined,
      companyName: undefined,
    },
  });
});

test("Prisma repository maps create input to Prisma create data and returns domain contact", async () => {
  const delegate = new FakeContactDelegate(null);
  const repository = new PrismaContactRepository(delegate);

  const contact = await repository.createContact({
    businessId,
    firstName: "Ada",
    firstNameNormalized: "ada",
    email: "Ada@Example.test",
    emailNormalized: "ada@example.test",
    emailDomain: "example.test",
    phoneSmsEnabled: true,
  });

  assert.deepEqual(delegate.lastCreateArgs, {
    data: {
      businessId,
      firstName: "Ada",
      lastName: undefined,
      displayName: undefined,
      companyName: undefined,
      firstNameNormalized: "ada",
      lastNameNormalized: undefined,
      displayNameNormalized: undefined,
      companyNameNormalized: undefined,
      email: "Ada@Example.test",
      emailNormalized: "ada@example.test",
      emailDomain: "example.test",
      phone: undefined,
      phoneE164: undefined,
      phoneRegion: undefined,
      companyCode: undefined,
      companyCodeNormalized: undefined,
      vatCode: undefined,
      vatCodeNormalized: undefined,
      phoneSmsEnabled: true,
      phoneWhatsappEnabled: undefined,
      phoneTelegramEnabled: undefined,
    },
  });
  assert.equal(contact.id, "33333333-3333-4333-8333-333333333333");
  assert.equal(contact.businessId, businessId);
  assert.equal(contact.emailNormalized, "ada@example.test");
});

test("Prisma repository maps database unique constraint failure to typed duplicate error", async () => {
  const delegate = new FakeContactDelegate(null, makeUniqueConstraintError("email_normalized"));
  const repository = new PrismaContactRepository(delegate);

  await assert.rejects(
    repository.createContact({
      businessId,
      email: "Ada@Example.test",
      emailNormalized: "ada@example.test",
    }),
    (error) => {
      assert.equal(error instanceof DuplicateContactError, true);
      assert.deepEqual((error as DuplicateContactError).duplicate, { reason: "email" });
      return true;
    },
  );
});

test("Prisma repository does not invent a precise duplicate reason when fetched row does not match lookup", async () => {
  const delegate = new FakeContactDelegate({
    id: "22222222-2222-4222-8222-222222222222",
    businessId,
    emailNormalized: "other@example.test",
  });
  const repository = new PrismaContactRepository(delegate);

  const duplicate = await repository.findBlockingDuplicate({
    kind: "precise",
    businessId,
    values: {
      emailNormalized: "ada@example.test",
    },
  });

  assert.equal(duplicate, null);
});

type FakeContact = {
  id: string;
  businessId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  companyName: string | null;
  firstNameNormalized: string | null;
  lastNameNormalized: string | null;
  displayNameNormalized: string | null;
  companyNameNormalized: string | null;
  email: string | null;
  emailNormalized: string | null;
  emailDomain: string | null;
  phone: string | null;
  phoneE164: string | null;
  phoneRegion: string | null;
  companyCode: string | null;
  companyCodeNormalized: string | null;
  vatCode: string | null;
  vatCodeNormalized: string | null;
  phoneSmsEnabled: boolean;
  phoneWhatsappEnabled: boolean;
  phoneTelegramEnabled: boolean;
  removedFromActiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

class FakeContactDelegate {
  lastCreateArgs: unknown;
  lastFindFirstArgs: unknown;
  private readonly findFirstResult: FakeContact | null;
  private readonly createError: unknown;

  constructor(findFirstResult: Partial<FakeContact> | null, createError?: unknown) {
    this.findFirstResult = findFirstResult === null ? null : makeContact(findFirstResult);
    this.createError = createError;
  }

  async findFirst(args: unknown): Promise<FakeContact | null> {
    this.lastFindFirstArgs = args;
    return this.findFirstResult;
  }

  async create(args: unknown): Promise<FakeContact> {
    this.lastCreateArgs = args;

    if (this.createError !== undefined) {
      throw this.createError;
    }

    return makeContact({
      id: "33333333-3333-4333-8333-333333333333",
      businessId,
      emailNormalized: "ada@example.test",
    });
  }
}

function makeUniqueConstraintError(target: string): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002",
    clientVersion: "test",
    meta: { target },
  });
}

function makeContact(overrides: Partial<FakeContact>): FakeContact {
  const now = new Date("2026-06-29T00:00:00.000Z");

  return {
    id: "22222222-2222-4222-8222-222222222222",
    businessId,
    firstName: null,
    lastName: null,
    displayName: null,
    companyName: null,
    firstNameNormalized: null,
    lastNameNormalized: null,
    displayNameNormalized: null,
    companyNameNormalized: null,
    email: null,
    emailNormalized: null,
    emailDomain: null,
    phone: null,
    phoneE164: null,
    phoneRegion: null,
    companyCode: null,
    companyCodeNormalized: null,
    vatCode: null,
    vatCodeNormalized: null,
    phoneSmsEnabled: false,
    phoneWhatsappEnabled: false,
    phoneTelegramEnabled: false,
    removedFromActiveAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
