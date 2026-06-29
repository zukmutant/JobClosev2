import assert from "node:assert/strict";
import test from "node:test";

import { DEV_BUSINESS_ID, getTrustedBusinessContext } from "./business-context.ts";

test("trusted business context uses the fixed dev business id", () => {
  assert.deepEqual(getTrustedBusinessContext(), {
    businessId: DEV_BUSINESS_ID,
  });
});

test("trusted business context does not accept editable caller input", () => {
  assert.equal(getTrustedBusinessContext.length, 0);
});
