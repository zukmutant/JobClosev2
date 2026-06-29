# Project Change Log

## 2026-06-29

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
