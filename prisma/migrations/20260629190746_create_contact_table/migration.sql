-- Ensure gen_random_uuid() is available for Contact ids.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_id" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "display_name" TEXT,
    "company_name" TEXT,
    "first_name_normalized" TEXT,
    "last_name_normalized" TEXT,
    "display_name_normalized" TEXT,
    "company_name_normalized" TEXT,
    "email" TEXT,
    "email_normalized" TEXT,
    "email_domain" TEXT,
    "phone" TEXT,
    "phone_e164" TEXT,
    "phone_region" TEXT,
    "company_code" TEXT,
    "company_code_normalized" TEXT,
    "vat_code" TEXT,
    "vat_code_normalized" TEXT,
    "phone_sms_enabled" BOOLEAN NOT NULL DEFAULT false,
    "phone_whatsapp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "phone_telegram_enabled" BOOLEAN NOT NULL DEFAULT false,
    "removed_from_active_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "contacts_not_fully_empty_chk" CHECK (
        COALESCE(
            NULLIF(btrim("first_name"), ''),
            NULLIF(btrim("last_name"), ''),
            NULLIF(btrim("display_name"), ''),
            NULLIF(btrim("company_name"), ''),
            NULLIF(btrim("email"), ''),
            NULLIF(btrim("phone"), ''),
            NULLIF(btrim("company_code"), ''),
            NULLIF(btrim("vat_code"), '')
        ) IS NOT NULL
    )
);

-- CreateIndex
CREATE INDEX "contacts_business_id_idx" ON "contacts"("business_id");

-- CreateIndex
CREATE INDEX "contacts_business_email_normalized_idx" ON "contacts"("business_id", "email_normalized");

-- CreateIndex
CREATE INDEX "contacts_business_phone_e164_idx" ON "contacts"("business_id", "phone_e164");

-- CreateIndex
CREATE INDEX "contacts_business_company_code_normalized_idx" ON "contacts"("business_id", "company_code_normalized");

-- CreateIndex
CREATE INDEX "contacts_business_vat_code_normalized_idx" ON "contacts"("business_id", "vat_code_normalized");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_email_normalized_uidx"
ON "contacts"("business_id", "email_normalized")
WHERE "removed_from_active_at" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_phone_e164_uidx"
ON "contacts"("business_id", "phone_e164")
WHERE "removed_from_active_at" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_company_code_normalized_uidx"
ON "contacts"("business_id", "company_code_normalized")
WHERE "removed_from_active_at" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_active_business_vat_code_normalized_uidx"
ON "contacts"("business_id", "vat_code_normalized")
WHERE "removed_from_active_at" IS NULL;
