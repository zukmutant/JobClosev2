import assert from "node:assert/strict";
import test from "node:test";

import { initialContactCreationFormState } from "./contact-creation-form-state.ts";
import { submitContactCreationForm } from "./create-contact-form-action.ts";
import { runContactCreationFormAction } from "./create-contact-form-action-runner.ts";

test("contact creation form action submits visible MVP fields through the server action contract", async () => {
  const formData = new FormData();
  formData.set("firstName", "Ada");
  formData.set("lastName", "Lovelace");
  formData.set("companyName", "Analytical Engines");
  formData.set("email", "ada@example.test");
  formData.set("phone", "+370 600 00000");
  formData.set("phoneSmsEnabled", "on");
  formData.set("phoneWhatsappEnabled", "on");
  formData.set("phoneTelegramEnabled", "on");

  let capturedInput: unknown;
  const result = await runContactCreationFormAction(formData, async (input) => {
    capturedInput = input;
    return { ok: true, contactId: "33333333-3333-4333-8333-333333333333" };
  });

  assert.equal(result.status, "success");
  assert.deepEqual(capturedInput, {
    firstName: "Ada",
    lastName: "Lovelace",
    companyName: "Analytical Engines",
    email: "ada@example.test",
    phone: "+370 600 00000",
    phoneSmsEnabled: true,
    phoneWhatsappEnabled: true,
    phoneTelegramEnabled: true,
  });
});

test("contact creation form action maps creation result states", async () => {
  const formData = new FormData();

  assert.deepEqual(
    await runContactCreationFormAction(formData, async () => ({ ok: false, reason: "invalidInput" })),
    {
      status: "invalidInput",
      message: "Invalid input. Check the contact fields and try again.",
    },
  );

  assert.deepEqual(
    await runContactCreationFormAction(formData, async () => ({ ok: false, reason: "emptyContact" })),
    {
      status: "emptyContact",
      message: "Enter at least one contact field.",
    },
  );

  assert.deepEqual(
    await runContactCreationFormAction(formData, async () => ({
      ok: false,
      reason: "duplicateContact",
    })),
    {
      status: "duplicateContact",
      message: "Duplicate contact. This contact already exists.",
    },
  );
});

test("submitContactCreationForm keeps the useActionState-compatible signature", () => {
  assert.equal(typeof submitContactCreationForm, "function");
  assert.equal(initialContactCreationFormState.status, "idle");
});
