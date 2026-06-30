# Project Change Log

## 2026-07-01

- Task summary: Fixed repeated Contact Creation submit after successful create.
- Files changed:
  - `app/contact-creation-form.tsx`
  - `docs/project-change-log.md`
- Behavior changed: After every successful contact creation, the Contact form clears all visible fields, hides phone channels, resets checked phone-channel controls, and disables submit because the form is empty.
- Behavior not changed: Error results still preserve entered values; Contact fields, UI wrappers, phone-channel visibility rule, Server Action path, backend behavior, duplicate rules, persistence schema, and phone parser behavior were not changed.
- Validation run: `npm run test:ci`, `npm run build`, manual browser verification, and `git diff --check` passed.
- Next recommended task: Add a rendered UI regression test for successful submit clearing values and phone-channel checkbox state once the UI test harness is approved.

## 2026-06-30

- Task summary: Improved Contact Creation duplicate feedback.
- Files changed:
  - `docs/features/create-contact-mvp.md`
  - `lib/contacts/contact-repository.ts`
  - `lib/contacts/prisma-contact-repository.ts`
  - `lib/contacts/prisma-contact-repository.test.ts`
  - `lib/contacts/contact-creation-form-state.ts`
  - `lib/contacts/create-contact-form-action-runner.ts`
  - `lib/contacts/create-contact-form-action.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: Duplicate contact results now include matched reason plus existing contact display data when a known matching contact row is found, and the Contact Creation form message names the matched reason and readable existing contact label. Duplicate races without a known row keep generic reason-based feedback.
- Behavior not changed: Duplicate matching rules, Contact form fields, UI layout, phone-channel visibility, Server Action path, persistence schema, contact list, edit, delete, search, parser UI, and AI behavior were not changed.
- Validation run: `npm run test:ci`, `npm run build`, manual browser verification, and `git diff --check` passed.
- Next recommended task: Add a rendered UI regression test for duplicate feedback once the UI test harness is approved.

- Task summary: Updated Contact Creation MVP minimum rule to require email or phone.
- Files changed:
  - `docs/features/create-contact-mvp.md`
  - `lib/contacts/contact-creation-rules.ts`
  - `lib/contacts/contact-creation-rules.test.ts`
  - `lib/contacts/create-contact-service.ts`
  - `lib/contacts/create-contact-service.test.ts`
  - `lib/contacts/create-contact-action.test.ts`
  - `lib/contacts/create-contact-form-action-runner.ts`
  - `lib/contacts/create-contact-form-action.test.ts`
  - `app/contact-creation-form.tsx`
  - `docs/project-change-log.md`
- Behavior changed: Manual contact creation now requires a non-empty email or phone; name-only and company-only contacts are rejected as `emptyContact`, and the UI submit button stays disabled until email or phone is present.
- Behavior not changed: Existing Contact form fields, phone-channel visibility, UI wrappers, Server Action path, persistence schema, duplicate persistence indexes, parser UI, contact list, edit, delete, search, and AI behavior were not changed.
- Validation run: `npm run test:ci`, `npm run build`, manual browser verification, and `git diff --check` passed.
- Next recommended task: Add an approved rendered UI regression test for name-only disabled submit and email/phone-enabled submit.

- Task summary: Preserved Contact Creation form values on submit errors.
- Files changed:
  - `app/contact-creation-form.tsx`
  - `docs/project-change-log.md`
- Behavior changed: Contact Creation form fields now clear only after a successful submit and preserve entered values after `invalidInput`, `emptyContact`, and `duplicateContact` results.
- Behavior not changed: Contact fields, layout, UI wrappers, phone-channel visibility, submit disabled rule, Server Action submit path, backend behavior, schema, persistence, duplicate rules, parser behavior, and product flow were not changed.
- Validation run: `npm run test:ci`, `npm run build`, manual browser verification, and `git diff --check` passed.
- Next recommended task: Add a rendered UI regression test for Contact Creation submit-result field preservation once a UI test harness is approved.

- Task summary: Fixed Contact Creation form input change runtime crash.
- Files changed:
  - `app/contact-creation-form.tsx`
  - `components/ui/form-panel.tsx`
  - `docs/project-change-log.md`
- Behavior changed: Controlled Contact form inputs now receive string values from the UI wrapper instead of reading `event.currentTarget.value` inside deferred state updates, preventing the client runtime crash while typing.
- Behavior not changed: Contact fields, UI wrapper usage, layout, phone-channel visibility rule, submit disabled rule, Server Action submit path, backend behavior, schema, persistence, duplicate rules, parser behavior, and product flow were not changed.
- Validation run: `npm run test:ci`, `npm run build`, manual browser verification, and `git diff --check` passed.
- Next recommended task: Add a rendered UI regression test for typing in Contact Creation fields and verifying phone-channel visibility.

- Task summary: Fixed Contact form submit disabled state.
- Files changed:
  - `app/contact-creation-form.tsx`
  - `components/ui/form-panel.tsx`
  - `docs/project-change-log.md`
- Behavior changed: The Contact Creation submit button is now disabled while a submit is pending and while all five main visible fields are empty.
- Behavior not changed: Contact fields, layout, UI wrappers, phone-channel visibility, Server Action submit path, backend behavior, schema, persistence, duplicate rules, parser behavior, and product flow were not changed.
- Validation run: `npm run test:ci`, `npm run build`, and `git diff --check` passed.
- Next recommended task: Add a focused rendered UI test for the Contact Creation form submit button disabled state.

- Task summary: Refactored the Contact Creation form to approved UI wrappers.
- Files changed:
  - `app/page.tsx`
  - `app/contact-creation-form.tsx`
  - `components/ui/form-panel.tsx`
  - `components/ui/page-shell.tsx`
  - `docs/project-change-log.md`
- Behavior changed: None intended. The existing contact creation form now renders through generic `components/ui/**` wrappers backed by Mantine instead of raw inline-styled form elements.
- Behavior not changed: Contact fields, phone-channel visibility, submit through the existing Server Action, pending/success/invalid/empty/duplicate result states, backend behavior, schema, persistence, duplicate rules, parser behavior, and product flow were not changed.
- Validation run: `npm run test:ci`, `npm run build`, and `git diff --check` passed.
- Next recommended task: Add a user-behavior UI test setup for the contact creation form so phone-channel visibility and submit-state rendering can be covered through rendered UI interactions.

- Task summary: Implemented the minimal Contact Creation MVP UI.
- Files changed:
  - `app/page.tsx`
  - `app/contact-creation-form.tsx`
  - `lib/contacts/contact-creation-form-state.ts`
  - `lib/contacts/create-contact-form-action.ts`
  - `lib/contacts/create-contact-form-action-runner.ts`
  - `lib/contacts/create-contact-form-action.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: The home page now shows one contact creation form with first name, last name, company name, email, and phone fields; phone channel checkboxes for SMS, WhatsApp, and Telegram appear only while a phone value is present; submit uses the existing Contact create Server Action through a form adapter; pending, success, invalid input, empty contact, and duplicate contact states are rendered.
- Behavior not changed: No businessId input, display-only internal fields, contact list, edit, delete, search, AI, parser UI, schema change, repository behavior change, duplicate rule change, or new persistence model was added.
- Validation run: `npm run test:ci`, `npm run build`, and `git diff --check` passed.
- Next recommended task: Add a user-behavior UI test setup for the contact creation form so phone-channel visibility and submit-state rendering can be covered without relying only on adapter unit tests.

## 2026-06-29

- Task summary: Fixed Contact preparation edge cases.
- Files changed:
  - `lib/contacts/contact-preparation.ts`
  - `lib/contacts/contact-preparation.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: Contact preparation now drops phone channel flags unless a trimmed phone value is present, and direct email input must pass Zod email validation before deriving `emailNormalized` or `emailDomain`.
- Behavior not changed: No UI, phone parser, persistence schema, auth implementation, service behavior, repository behavior, contact form, arbitrary-text email extractor, or phone E.164 preparation was added.
- Validation run: `npx prisma validate` passed with a process-only `DATABASE_URL` from `.env.example`; `npm run test:ci`, `npm run build`, and `git diff --check` passed.
- Next recommended task: Add the minimal contact form UI only after approving the exact MVP form fields and submit-state behavior.

- Task summary: Added Contact create input preparation before the service call.
- Files changed:
  - `lib/contacts/contact-preparation.ts`
  - `lib/contacts/contact-preparation.test.ts`
  - `lib/contacts/create-contact-action-runner.ts`
  - `lib/contacts/create-contact-action.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: Server Action input now trims text, prepares normalized name/company fields, normalizes direct email input with `emailDomain`, normalizes typed company/VAT codes, and passes prepared input to the existing create-contact service.
- Behavior not changed: No UI, auth implementation, phone parser internals, persistence schema, service behavior, repository behavior, contact form, email extractor, or phone E.164 preparation was added.
- Validation run: `npx prisma validate` passed with a process-only `DATABASE_URL` from `.env.example`; `npm run test:ci`, `npm run build`, and `git diff --check` passed.
- Next recommended task: Add the minimal contact form UI only after approving the exact MVP form fields and submit-state behavior.

- Task summary: Added the Contact create Server Action boundary.
- Files changed:
  - `lib/contacts/create-contact-action.ts`
  - `lib/contacts/create-contact-action-runner.ts`
  - `lib/contacts/create-contact-action.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: Added a server action boundary that validates external contact input, reads the trusted server `businessId`, and delegates to the existing create-contact service with the Prisma repository.
- Behavior not changed: No UI, contact form, auth implementation, service behavior, repository behavior, schema, migration, parsing, normalization, email logic, phone logic, or new contact creation rules were added.
- Validation run: `npx prisma validate` passed with a process-only `DATABASE_URL` from `.env.example`; `npm run test:ci`, `npm run build`, and `git diff --check` passed.
- Next recommended task: Add the minimal contact form UI only after approving the exact MVP form fields and submit-state behavior.

- Task summary: Added the MVP trusted business context foundation.
- Files changed:
  - `lib/server/business-context.ts`
  - `lib/server/business-context.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: Added a server-side mock helper that returns a fixed development `businessId` without accepting editable caller input.
- Behavior not changed: No auth implementation, UI, Server Action, contact form, schema, migration, repository behavior, contact creation flow, parsing, normalization, email logic, or phone logic was added.
- Validation run: `npx prisma validate` passed with a process-only `DATABASE_URL` from `.env.example`; `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add the Contact create Server Action boundary that reads `businessId` from `getTrustedBusinessContext`, validates external input with Zod, and calls the existing contact creation service.

- Task summary: Documented the duplicateContact result contract for database unique constraint races.
- Files changed:
  - `lib/contacts/contact-repository.ts`
  - `lib/contacts/create-contact-service.ts`
  - `lib/contacts/create-contact-service.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: None. Documented that duplicateContact may include `duplicate.reason` without `duplicate.contactId` when created from a database unique constraint race.
- Behavior not changed: No UI, Server Action, API route, schema, migration, repository strategy, duplicate behavior, auth/business context, parsing, normalization, email logic, phone logic, or contact creation flow was changed.
- Validation run: `npx prisma validate` passed with a process-only `DATABASE_URL` from `.env.example`; `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add the Server Action boundary only after approving how trusted `businessId` is obtained for the MVP.

- Task summary: Fixed backend duplicate safety for Contact creation.
- Files changed:
  - `lib/contacts/contact-repository.ts`
  - `lib/contacts/create-contact-service.ts`
  - `lib/contacts/create-contact-service.test.ts`
  - `lib/contacts/prisma-contact-repository.ts`
  - `lib/contacts/prisma-contact-repository.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: Database unique constraint races during contact create now return the typed `duplicateContact` service result, and precise duplicate reason mapping no longer falls back to an invented email reason.
- Behavior not changed: No UI, Server Action, API route, auth/business context, schema, migration, Contact MVP behavior, parser internals, normalization implementation, email logic, or phone logic was added.
- Validation run: `npx prisma validate`, `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add the Server Action boundary only after approving how trusted `businessId` is obtained for the MVP.

- Task summary: Added explicit Contact duplicate rule tests.
- Files changed:
  - `lib/contacts/contact-creation-rules.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: None. Added test coverage only for first-name-only and company-name-only duplicate lookup decisions.
- Behavior not changed: No UI, API route, Server Action, service logic, repository logic, schema, migration, Contact MVP behavior, matching, parsing, normalization, email logic, or phone logic was changed.
- Validation run: `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add the Server Action boundary only after approving how trusted `businessId` is obtained for the MVP.

- Task summary: Added the Prisma-backed Contact repository adapter.
- Files changed:
  - `lib/server/prisma.ts`
  - `lib/contacts/prisma-contact-repository.ts`
  - `lib/contacts/prisma-contact-repository.test.ts`
  - `lib/contacts/contact-creation-rules.ts`
  - `lib/contacts/contact-creation-rules.test.ts`
  - `docs/project-change-log.md`
- Behavior changed: Added a server-side Prisma client boundary, a `ContactRepository` implementation for active duplicate lookup and contact persistence mapping, and repository-level tests using a fake Prisma delegate.
- Behavior not changed: No UI, Server Action, API route, auth/business context, Contact MVP behavior, parser internals, normalization implementation, or new database schema was added.
- Validation run: `npx prisma validate`, `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add a Server Action boundary that obtains trusted `businessId`, validates external input with Zod, calls the contact creation service, and returns the typed result.

- Task summary: Added the backend domain slice for Contact Creation MVP.
- Files changed:
  - `lib/contacts/contact.ts`
  - `lib/contacts/contact-validation.ts`
  - `lib/contacts/contact-creation-rules.ts`
  - `lib/contacts/contact-repository.ts`
  - `lib/contacts/create-contact-service.ts`
  - `lib/contacts/contact-creation-rules.test.ts`
  - `package.json`
  - `package-lock.json`
  - `tsconfig.json`
  - `docs/project-change-log.md`
- Behavior changed: Added Contact domain types, raw and prepared create-contact validation schemas, pure empty-contact and duplicate-lookup decision rules, a repository interface, an application service skeleton, and unit tests for approved rule decisions.
- Behavior not changed: No UI, Server Action, API route, auth/business context lookup, repository implementation, Prisma write path, email parser, phone parser, matching implementation, normalization implementation, or contact creation flow was added.
- Validation run: `npx prisma validate`, `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Implement a Prisma-backed Contact repository adapter behind the `ContactRepository` interface, using the existing database constraints and without adding UI or route handlers.

- Task summary: Cleaned up Contact migration indexes.
- Files changed:
  - `prisma/schema.prisma`
  - `prisma/migrations/20260629195506_cleanup_contact_indexes/migration.sql`
  - `docs/project-change-log.md`
- Behavior changed: Updated database migration state so active-contact partial unique indexes exclude NULL prepared values and redundant regular composite indexes are dropped.
- Behavior not changed: No app UI, service, repository, server action, auth/business context, matching, parsing, normalization, email logic, phone logic, or contact creation flow was added.
- Validation run: `npx prisma migrate dev`, `npx prisma validate`, `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add database-level migration verification tests for active Contact duplicate indexes and the empty-contact CHECK constraint.

- Task summary: Created the initial Contact table Prisma migration with required PostgreSQL constraints.
- Files changed:
  - `prisma/migrations/20260629190746_create_contact_table/migration.sql`
  - `prisma/migrations/migration_lock.toml`
  - `docs/project-change-log.md`
- Behavior changed: Added database migration SQL for the `contacts` table, `gen_random_uuid()` support, active-only partial unique indexes, and a trim-based non-empty contact check.
- Behavior not changed: No app UI, service, repository, server action, contact creation logic, Business/User/Auth models, or business-context behavior was added.
- Validation run: `npx prisma migrate dev`, `npx prisma validate`, `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add database-level migration verification tests for the Contact table constraints before implementing contact creation services.

- Task summary: Added Docker Compose PostgreSQL setup for local development.
- Files changed:
  - `docker-compose.yml`
  - `.env.example`
  - `.gitignore`
  - `docs/project-change-log.md`
- Behavior changed: None. No application runtime behavior was changed.
- Behavior not changed: No migrations, real `.env`, real database connection from the app, repository, service, server action, UI, matching, parsing, normalization, email logic, or phone logic were added.
- Validation run: `docker compose config` could not run because Docker CLI was not available; `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Start the local PostgreSQL container and create the first SQL migration for the `contacts` table with partial unique indexes.

- Task summary: Added Prisma schema foundation for the Contact Creation MVP.
- Files changed:
  - `package.json`
  - `package-lock.json`
  - `prisma/schema.prisma`
  - `docs/project-change-log.md`
  - `.gitattributes`
- Behavior changed: None. No runtime contact creation behavior was implemented.
- Behavior not changed: No migrations, database connection, repository, service, server action, UI, matching, parsing, normalization, email logic, or phone logic were added. Line endings were normalized with `.gitattributes`.
- Validation run: `npx prisma validate`, `npm run build`, `npm run test:ci`, and `git diff --check` passed.
- Next recommended task: Add the SQL migration for the `contacts` table, including partial unique indexes for active contacts, after confirming the local PostgreSQL development connection.
