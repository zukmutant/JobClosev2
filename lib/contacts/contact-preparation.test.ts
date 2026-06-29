import assert from "node:assert/strict";
import test from "node:test";

import { prepareContactCreateInput } from "./contact-preparation.ts";

test("prepareContactCreateInput trims text fields and normalizes exact-match names", () => {
  assert.deepEqual(
    prepareContactCreateInput({
      firstName: "  Ada  ",
      lastName: "  Lovelace  ",
      displayName: "  Ada   King  ",
      companyName: "  Example   Labs  ",
    }),
    {
      firstName: "Ada",
      lastName: "Lovelace",
      displayName: "Ada   King",
      companyName: "Example   Labs",
      firstNameNormalized: "ada",
      lastNameNormalized: "lovelace",
      displayNameNormalized: "ada king",
      companyNameNormalized: "example labs",
    },
  );
});

test("prepareContactCreateInput normalizes email and extracts email domain", () => {
  assert.deepEqual(
    prepareContactCreateInput({
      email: "  Ada@Example.TEST  ",
    }),
    {
      email: "Ada@Example.TEST",
      emailNormalized: "ada@example.test",
      emailDomain: "example.test",
    },
  );
});

test("prepareContactCreateInput normalizes typed company and VAT codes", () => {
  assert.deepEqual(
    prepareContactCreateInput({
      companyCode: "  ab-123  ",
      vatCode: "  lt100  ",
    }),
    {
      companyCode: "ab-123",
      companyCodeNormalized: "AB-123",
      vatCode: "lt100",
      vatCodeNormalized: "LT100",
    },
  );
});

test("prepareContactCreateInput keeps phone parser internals out of scope", () => {
  assert.deepEqual(
    prepareContactCreateInput({
      phone: "  +372 5555 1234  ",
      phoneSmsEnabled: true,
      phoneWhatsappEnabled: false,
    }),
    {
      phone: "+372 5555 1234",
      phoneSmsEnabled: true,
      phoneWhatsappEnabled: false,
    },
  );
});

test("prepareContactCreateInput omits whitespace-only text fields", () => {
  assert.deepEqual(
    prepareContactCreateInput({
      firstName: "   ",
      email: "   ",
      phoneTelegramEnabled: true,
    }),
    {
      phoneTelegramEnabled: true,
    },
  );
});
