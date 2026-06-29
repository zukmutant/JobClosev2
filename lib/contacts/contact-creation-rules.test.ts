import assert from "node:assert/strict";
import test from "node:test";

import {
  hasNonEmptyContactField,
  selectContactDuplicateLookup,
} from "./contact-creation-rules.ts";

const businessId = "11111111-1111-4111-8111-111111111111";

test("empty contact decision treats missing and whitespace-only useful fields as empty", () => {
  assert.equal(hasNonEmptyContactField({}), false);
  assert.equal(
    hasNonEmptyContactField({
      firstName: " ",
      lastName: "\t",
      displayName: "",
      companyName: "   ",
      email: " ",
      phone: " ",
      companyCode: " ",
      vatCode: " ",
    }),
    false,
  );
});

test("empty contact decision accepts one useful non-empty field", () => {
  assert.equal(hasNonEmptyContactField({ firstName: "Ada" }), true);
  assert.equal(hasNonEmptyContactField({ email: "ada@example.test" }), true);
  assert.equal(hasNonEmptyContactField({ phone: "+37061234567" }), true);
});

test("duplicate decision uses precise prepared fields before name fields", () => {
  assert.deepEqual(
    selectContactDuplicateLookup(businessId, {
      firstName: "Ada",
      firstNameNormalized: "ada",
      email: "Ada@Example.test",
      emailNormalized: "ada@example.test",
      emailDomain: "example.test",
    }),
    {
      kind: "precise",
      businessId,
      values: {
        emailNormalized: "ada@example.test",
      },
    },
  );
});

test("duplicate decision checks all available precise prepared fields", () => {
  assert.deepEqual(
    selectContactDuplicateLookup(businessId, {
      emailNormalized: "ada@example.test",
      phoneE164: "+37061234567",
      companyCodeNormalized: "12345",
      vatCodeNormalized: "lt12345",
    }),
    {
      kind: "precise",
      businessId,
      values: {
        emailNormalized: "ada@example.test",
        phoneE164: "+37061234567",
        companyCodeNormalized: "12345",
        vatCodeNormalized: "lt12345",
      },
    },
  );
});

test("duplicate decision uses normalized names only when no precise prepared field exists", () => {
  assert.deepEqual(
    selectContactDuplicateLookup(businessId, {
      firstName: "Ada",
      lastName: "Lovelace",
      firstNameNormalized: "ada",
      lastNameNormalized: "lovelace",
    }),
    {
      kind: "name",
      businessId,
      firstNameNormalized: "ada",
      lastNameNormalized: "lovelace",
      displayNameNormalized: undefined,
      companyNameNormalized: undefined,
    },
  );
});

test("duplicate decision skips duplicate lookup when no reliable prepared duplicate field exists", () => {
  assert.deepEqual(
    selectContactDuplicateLookup(businessId, {
      phone: "unparsed phone",
    }),
    {
      kind: "none",
      businessId,
    },
  );
});
