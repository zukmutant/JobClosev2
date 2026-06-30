import assert from "node:assert/strict";
import test from "node:test";

import {
  hasRequiredManualContactField,
  selectContactDuplicateLookup,
} from "./contact-creation-rules.ts";

const businessId = "11111111-1111-4111-8111-111111111111";

test("manual contact minimum decision treats missing and whitespace-only contact methods as empty", () => {
  assert.equal(hasRequiredManualContactField({}), false);
  assert.equal(
    hasRequiredManualContactField({
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

test("manual contact minimum decision rejects name-only and company-only contacts", () => {
  assert.equal(hasRequiredManualContactField({ firstName: "Ada" }), false);
  assert.equal(hasRequiredManualContactField({ companyName: "Analytical Engines" }), false);
});

test("manual contact minimum decision accepts email or phone", () => {
  assert.equal(hasRequiredManualContactField({ email: "ada@example.test" }), true);
  assert.equal(hasRequiredManualContactField({ phone: "+37061234567" }), true);
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

test("duplicate decision checks first-name-only normalized name duplicates", () => {
  assert.deepEqual(
    selectContactDuplicateLookup(businessId, {
      firstName: "Ada",
      firstNameNormalized: "ada",
    }),
    {
      kind: "name",
      businessId,
      firstNameNormalized: "ada",
      lastNameNormalized: undefined,
      displayNameNormalized: undefined,
      companyNameNormalized: undefined,
    },
  );
});

test("duplicate decision checks company-name-only normalized name duplicates", () => {
  assert.deepEqual(
    selectContactDuplicateLookup(businessId, {
      companyName: "Analytical Engines Ltd",
      companyNameNormalized: "analytical engines ltd",
    }),
    {
      kind: "name",
      businessId,
      firstNameNormalized: undefined,
      lastNameNormalized: undefined,
      displayNameNormalized: undefined,
      companyNameNormalized: "analytical engines ltd",
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
