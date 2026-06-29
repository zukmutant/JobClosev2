import assert from "node:assert/strict";
import test from "node:test";

import type { ContactRepository } from "./contact-repository.ts";
import type { CreateContactCommand, CreateContactResult } from "./create-contact-service.ts";
import { runCreateContactAction } from "./create-contact-action-runner.ts";

const trustedBusinessId = "11111111-1111-4111-8111-111111111111";
const editableBusinessId = "22222222-2222-4222-8222-222222222222";
const repository = {} as ContactRepository;

test("create contact action rejects invalid external input before service call", async () => {
  let serviceCalled = false;

  const result = await runCreateContactAction(
    {
      firstName: "Ada",
      unknownField: "not allowed",
    },
    {
      getBusinessContext: () => {
        throw new Error("Business context should not be read for invalid input");
      },
      repository,
      createContactService: async () => {
        serviceCalled = true;
        return { ok: true, contactId: "unused" };
      },
    },
  );

  assert.deepEqual(result, { ok: false, reason: "invalidInput" });
  assert.equal(serviceCalled, false);
});

test("create contact action uses trusted server business context", async () => {
  let capturedCommand: CreateContactCommand | undefined;
  let capturedRepository: ContactRepository | undefined;

  const result = await runCreateContactAction(
    {
      firstName: "Ada",
    },
    {
      getBusinessContext: () => ({ businessId: trustedBusinessId }),
      repository,
      createContactService: async (command, receivedRepository): Promise<CreateContactResult> => {
        capturedCommand = command;
        capturedRepository = receivedRepository;
        return { ok: true, contactId: "33333333-3333-4333-8333-333333333333" };
      },
    },
  );

  assert.deepEqual(result, {
    ok: true,
    contactId: "33333333-3333-4333-8333-333333333333",
  });
  assert.deepEqual(capturedCommand, {
    businessId: trustedBusinessId,
    input: {
      firstName: "Ada",
      firstNameNormalized: "ada",
    },
  });
  assert.equal(capturedRepository, repository);
});

test("create contact action does not accept businessId from external input", async () => {
  let serviceCalled = false;

  const result = await runCreateContactAction(
    {
      businessId: editableBusinessId,
      firstName: "Ada",
    },
    {
      getBusinessContext: () => ({ businessId: trustedBusinessId }),
      repository,
      createContactService: async () => {
        serviceCalled = true;
        return { ok: true, contactId: "unused" };
      },
    },
  );

  assert.deepEqual(result, { ok: false, reason: "invalidInput" });
  assert.equal(serviceCalled, false);
});
