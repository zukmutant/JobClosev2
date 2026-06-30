import assert from "node:assert/strict";
import test from "node:test";

import type { Contact, ContactCreateRecord } from "./contact.ts";
import { DuplicateContactError } from "./contact-repository.ts";
import type {
  BlockingContactDuplicate,
  BlockingContactDuplicateLookup,
  ContactRepository,
} from "./contact-repository.ts";
import { createContact } from "./create-contact-service.ts";

const businessId = "11111111-1111-4111-8111-111111111111";

test("createContact rejects name-only manual contacts before repository access", async () => {
  const repository = new UnexpectedRepositoryAccess();

  const result = await createContact(
    {
      businessId,
      input: {
        firstName: "Ada",
        firstNameNormalized: "ada",
      },
    },
    repository,
  );

  assert.deepEqual(result, { ok: false, reason: "emptyContact" });
});

test("createContact rejects company-only manual contacts before repository access", async () => {
  const repository = new UnexpectedRepositoryAccess();

  const result = await createContact(
    {
      businessId,
      input: {
        companyName: "Analytical Engines",
        companyNameNormalized: "analytical engines",
      },
    },
    repository,
  );

  assert.deepEqual(result, { ok: false, reason: "emptyContact" });
});

test("createContact returns duplicateContact when repository create hits a unique constraint race", async () => {
  const repository = new DuplicateOnCreateRepository({ reason: "email" });

  const result = await createContact(
    {
      businessId,
      input: {
        email: "Ada@Example.test",
        emailNormalized: "ada@example.test",
      },
    },
    repository,
  );

  assert.deepEqual(result, {
    ok: false,
    reason: "duplicateContact",
    duplicate: { reason: "email" },
  });

  if (result.ok || result.reason !== "duplicateContact" || result.duplicate === undefined) {
    assert.fail("Expected duplicateContact result with duplicate detail");
  }

  assert.equal("contactId" in result.duplicate, false);
});

class DuplicateOnCreateRepository implements ContactRepository {
  private readonly duplicate: BlockingContactDuplicate;

  constructor(duplicate: BlockingContactDuplicate) {
    this.duplicate = duplicate;
  }

  async findBlockingDuplicate(
    _lookup: BlockingContactDuplicateLookup,
  ): Promise<BlockingContactDuplicate | null> {
    return null;
  }

  async createContact(_input: ContactCreateRecord): Promise<Contact> {
    throw new DuplicateContactError(this.duplicate);
  }
}

class UnexpectedRepositoryAccess implements ContactRepository {
  async findBlockingDuplicate(
    _lookup: BlockingContactDuplicateLookup,
  ): Promise<BlockingContactDuplicate | null> {
    throw new Error("Repository duplicate lookup should not be called");
  }

  async createContact(_input: ContactCreateRecord): Promise<Contact> {
    throw new Error("Repository create should not be called");
  }
}
