# Project Change Log

## 2026-06-29

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
