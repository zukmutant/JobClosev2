-- DropIndex
DROP INDEX "contacts_business_company_code_normalized_idx";

-- DropIndex
DROP INDEX "contacts_business_email_normalized_idx";

-- DropIndex
DROP INDEX "contacts_business_phone_e164_idx";

-- DropIndex
DROP INDEX "contacts_business_vat_code_normalized_idx";

-- DropIndex
DROP INDEX "contacts_active_business_email_normalized_uidx";

-- DropIndex
DROP INDEX "contacts_active_business_phone_e164_uidx";

-- DropIndex
DROP INDEX "contacts_active_business_company_code_normalized_uidx";

-- DropIndex
DROP INDEX "contacts_active_business_vat_code_normalized_uidx";

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_email_normalized_uidx"
ON "contacts"("business_id", "email_normalized")
WHERE "removed_from_active_at" IS NULL
AND "email_normalized" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_phone_e164_uidx"
ON "contacts"("business_id", "phone_e164")
WHERE "removed_from_active_at" IS NULL
AND "phone_e164" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_company_code_normalized_uidx"
ON "contacts"("business_id", "company_code_normalized")
WHERE "removed_from_active_at" IS NULL
AND "company_code_normalized" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_vat_code_normalized_uidx"
ON "contacts"("business_id", "vat_code_normalized")
WHERE "removed_from_active_at" IS NULL
AND "vat_code_normalized" IS NOT NULL;
