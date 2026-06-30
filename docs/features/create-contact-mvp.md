# MVP: Contact Creation

## Goal

The user must be able to create a contact inside the current business.

## Included in the MVP

- accept contact data;
- verify that a manual contact has email or phone;
- prepare data for future search;
- store the email domain as a linking field;
- check duplicates inside the current business;
- save the contact inside the current business;
- add system-managed fields;
- return the creation result.

## Contact fields

The following fields may be provided when creating a contact:

- first name;
- last name;
- full name / display name;
- company name;
- email;
- phone;
- company code;
- VAT code;
- phone channels:
  - SMS;
  - WhatsApp;
  - Telegram.

## Minimum rule

A manual contact must include a non-empty email or phone value.

Name-only and company-only contacts cannot be created manually.

A fully empty contact cannot be created.

Whitespace-only values are treated as empty values.

## Email

If an email is provided, the system stores:

- the original email;
- the prepared email value for future search and duplicate checks;
- the email domain as a linking field.

The email domain is not treated as a duplicate key.

## Phone

If a phone number is provided, the system stores:

- the original phone number;
- the prepared phone value for future search;
- E.164, if the number can be prepared through a metadata-based parser;
- the phone region, if known;
- phone channels, if provided.

Regex-only validation must not be used as the final phone processing method.

Blocking duplicate checks by phone are performed only when a reliable prepared phone value exists, such as `phone_e164`.

## Company code / VAT code

If the source already provides the field type, the system stores the value as:

- company code;
- or VAT code.

If a number is provided without a type, the system must not decide by itself whether it is a company code or VAT code.

## Duplicate checks

Duplicates are checked only inside the current business.

Blocking duplicates are:

- same prepared email;
- same prepared phone;
- same prepared company code;
- same prepared VAT code.

If the new manual contact includes email or phone but has no prepared email, prepared phone, prepared company code, or prepared VAT code, then an identical first name / last name / display name / company name inside the current business blocks creation.

The email domain is not treated as a duplicate key.

## Persistence

The system adds these fields itself:

- contact id;
- business id of the current business;
- created at;
- updated at.

The UI or external source must not provide these fields as manual user data.

The business id must come from the current authenticated business context, not from editable UI input.

## MVP table

The MVP uses one `contacts` table.

Fields:

- `id`
- `business_id`
- `first_name`
- `last_name`
- `display_name`
- `company_name`
- `first_name_normalized`
- `last_name_normalized`
- `display_name_normalized`
- `company_name_normalized`
- `email`
- `email_normalized`
- `email_domain`
- `phone`
- `phone_e164`
- `phone_region`
- `company_code`
- `company_code_normalized`
- `vat_code`
- `vat_code_normalized`
- `phone_sms_enabled`
- `phone_whatsapp_enabled`
- `phone_telegram_enabled`
- `removed_from_active_at`
- `created_at`
- `updated_at`

## Indexes

Unique indexes for active contacts inside one business:

- `business_id + email_normalized`
- `business_id + phone_e164`
- `business_id + company_code_normalized`
- `business_id + vat_code_normalized`

Do not create a unique index for first name, last name, display name, or company name.

## Readiness checks

- an empty contact cannot be created;
- a name-only contact cannot be created manually;
- a company-only contact cannot be created manually;
- a contact can be created with only an email;
- a contact can be created with only a phone number;
- the email domain is stored;
- the email domain is not treated as a duplicate key;
- the same prepared email blocks creation;
- the same `phone_e164` blocks creation;
- the same prepared company code blocks creation;
- the same prepared VAT code blocks creation;
- the same name blocks creation only when there are no more precise fields;
- the contact is created only inside the current business.
