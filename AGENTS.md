# AGENTS.md

## Purpose

This file defines the rules for implementation agents working in the JobClose repository.

The agent must follow the approved project source documents before making any changes to architecture, data schema, persistence, UI, validation, testing, or product behavior.

## Mandatory engineering reference

Before making any changes to architecture, stack, data model, persistence, frontend/backend boundaries, UI framework, service/repository layers, validation, or testing, the agent must read and apply:

```text
docs/jobclose-engineering-standards.md
```

If the actual committed path differs, use the committed path and do not create a second engineering standards file under another name.

This file is the mandatory engineering source for:

- stack;
- architecture;
- frontend/backend boundaries;
- UI boundary rules;
- persistence;
- service layer;
- validation;
- testing;
- migration discipline.

## Decision source order

Before making changes, the agent must use decision sources in this order:

1. Explicit product-owner decision in the current task.
2. Approved feature document for the requested work.
3. Current committed code behavior.
4. `docs/jobclose-engineering-standards.md`.
5. Official references listed in the engineering standards.

If sources conflict, the higher source wins.

If there is no approved source for behavior, schema, UI state, persistence rule, or product decision, the agent must stop and report what decision is missing. The agent must not invent behavior.

## Feature documents

Feature-specific rules must live in separate feature documents.

Expected location:

```text
docs/features/**
```

A feature document may define:

- accepted user flow;
- concrete fields;
- table requirements;
- validation rules;
- duplicate rules;
- UI behavior;
- forbidden behavior;
- test expectations.

Do not add feature-specific behavior to the engineering standards.

## Approved stack

Use only the approved stack unless the product owner explicitly approves otherwise:

- Next.js App Router;
- React;
- TypeScript;
- Mantine;
- Mantine through `components/ui/**`;
- PostgreSQL;
- Prisma;
- Zod.

Do not introduce without explicit approval:

- Tailwind;
- shadcn/ui;
- Radix as a new UI stack;
- Redux;
- Zustand;
- Jotai;
- XState;
- React Query / TanStack Query;
- tRPC;
- Supabase;
- Firebase;
- Drizzle;
- another database;
- another ORM;
- a new design system.

## Layers

Use this layer direction:

```text
UI components
↓
presentation adapters / view models
↓
application services
↓
domain models and domain rules
↓
repositories / external adapters
↓
database / API / external service
```

Rules:

- UI components only render data and collect user input.
- UI components must not contain persistence logic, matching/search logic, normalization, domain rules, or backend rules.
- Application services own use-case flow.
- Repositories own storage mechanics.
- Presentation adapters prepare display data.
- Domain models and domain rules must not be duplicated into ad hoc UI shapes.

## UI rules

Mantine imports are restricted.

Direct `@mantine/core` imports are allowed only in approved boundary files:

- `components/ui/**`;
- `app/layout.tsx`;
- approved test/provider setup files;
- approved Storybook provider setup files;
- approved visual sandbox provider setup files.

Feature code must use UI wrappers from:

```text
components/ui/**
```

Components in `components/ui/**` must remain generic design-system primitives.

They must not contain:

- feature-specific business behavior;
- domain-specific validation;
- parser-specific rendering;
- matcher-specific states;
- persistence logic;
- service calls;
- product-flow decisions.

## Persistence rules

Business data that must survive reloads, browser changes, device changes, or real user sessions must use approved backend persistence:

```text
PostgreSQL
Prisma
Next.js Route Handlers / Server Actions
Zod validation at trust boundaries
```

Do not use `localStorage` for MVP business data.

UI must not write directly to repositories, Prisma, or external persistence services.

## Validation rules

Use Zod at external and unsafe input boundaries:

- Server Action payloads;
- API Route request bodies and query parameters;
- form payloads crossing into backend logic;
- file/parser/external service outputs before domain logic;
- persistence write inputs before database mutation.

Inside trusted server-side application flow, use TypeScript types and canonical domain models.

Do not duplicate the same Zod validation at every internal layer unless there is a specific security or trust-boundary reason.

## Mutation rules

Backend mutations must follow this pattern:

```text
validate external input with Zod
call application service
service applies business rules
repository writes data
return typed result
UI updates from result
```

Client-side business mutations must not use ad hoc `fetch` calls inside UI components.

Use Server Actions or approved Route Handlers.

After a successful mutation, freshness must be handled explicitly by one of:

- returned typed result;
- `refresh()`;
- `revalidatePath`;
- `revalidateTag`;
- approved route refresh behavior.

Do not blindly call `router.refresh()` after every mutation.

## Data model rules

Each business object must have one canonical domain model.

Do not create uncontrolled parallel schemas.

Allowed variants must have a clear layer and purpose:

- domain model;
- create/update input;
- persistence model;
- search/match input;
- display/view model;
- API DTO.

Every non-domain variant must map explicitly to or from the canonical domain model.

## Identifiers

Persistent business entities must have stable UUID identifiers generated by the persistence layer.

UI must not generate persisted entity IDs.

For MVP business entities, prefer Prisma/PostgreSQL UUID defaults unless the product owner explicitly approves another approach.

## Product behavior rules

The agent must not invent:

- new buttons;
- new UI states;
- new confirmation steps;
- second-click flows;
- matcher timing changes;
- auto-filled fields;
- suggested / ambiguous / conflict behavior;
- submit / disabled / loading behavior;
- payload changes;
- backend persistence model;
- data schema changes.

If behavior is not described, the agent must stop and report:

```text
Source:
Problem:
Options:
Recommendation:
Approval needed:
```

Do not implement until approval is given.

## Bootstrap rule

If the repository is empty or does not yet contain the approved stack, start only with a minimal project scaffold.

A bootstrap task may create:

- package configuration;
- Next.js App Router base files;
- TypeScript configuration;
- Mantine provider boundary;
- approved UI wrapper boundary;
- test runner configuration;
- README.

A bootstrap task must not implement product behavior unless it is explicitly approved.

Do not mix bootstrap and feature implementation without explicit approval.

## Migration rule

Do not perform large architecture migrations in one step.

Work in incremental slices:

1. Inspect current files and boundaries.
2. Identify affected layer.
3. Identify approved source.
4. Implement one small slice.
5. Validate.
6. Report.
7. Move to the next slice only after approval.

Do not mix:

- UI refactor;
- product behavior change;
- persistence change;
- schema change;
- test cleanup;
- docs cleanup;

unless explicitly approved.

## Testing and validation

For implementation tasks, run unless scope is explicitly smaller:

```text
git diff --check
npm run build
npm run test:ci
```

For feature-specific work, also run relevant feature tests.

Use the correct test level:

- pure logic: unit test;
- mapper/adapter: unit test;
- repository/store: persistence behavior test;
- API/service: integration-style test;
- critical UI flow: user behavior test;
- boundary rules: source/static assertion allowed.

Source-string tests are not enough for UI behavior.

## Read-only QA / inspection

For read-only QA tasks:

- do not modify files;
- do not install packages;
- do not run migrations;
- do not execute commands unless the task explicitly allows it.

A read-only QA report must include:

- source inspected;
- scope inspected;
- findings;
- severity or recommendation;
- suggested follow-up task if implementation is needed;
- validation not run, with reason.

Do not claim that files changed, tests passed, commits were created, or push status exists unless those actions actually happened.

## Project change log

After every implementation task, update:

`docs/project-change-log.md`

Each entry must include:
- date;
- task summary;
- files changed;
- behavior changed;
- behavior not changed;
- validation run;
- next recommended task.

Do not use the change log as a replacement for the final report.

## Final report format

Every completed implementation task must end with this report structure unless the user provides a task-specific final report format.

Cleanup-only or git-only tasks may use a shorter report if the task explicitly asks for it.

```md
### Files changed

### What changed

### Tests run

### Build result

### Safety check

### Manual verification

### System overview update

### Test plan update

### Git status

### Commit

### Push status

### Next recommended task
```

Report rules:

- Do not claim files changed if no files were changed.
- Do not claim tests passed if tests were not run.
- Do not claim commit or push status unless commit or push actually happened.
- If validation was not run, state why.
- If a section does not apply, write `Not applicable` or a short reason.

## Next recommended task

Every completed implementation task must end with one useful next recommended task.

The recommendation should help the user continue without needing to invent the next step.

The recommendation must:

- be specific;
- be small enough to be a next implementation slice;
- follow approved source documents;
- not create unsafe product behavior;
- not jump prematurely to backend integrations;
- not introduce unapproved architecture, schema, UI behavior, or AI behavior.

If no safe next task is available, recommend an inspection or decision task instead.

Examples:

```text
Next recommended task:
Create the feature document for MVP contact creation before implementation.
```

```text
Next recommended task:
Inspect the current Prisma schema and confirm the existing business table name before adding contact persistence.
```

## Stop conditions

The agent must stop and request approval if:

- required product behavior is missing;
- UI behavior is ambiguous;
- schema change is not supported by approved feature docs;
- persistence model is unclear;
- business object shape conflicts with existing code;
- implementation requires an unapproved stack/library;
- the task mixes unrelated changes;
- validation cannot be run while the task requires validation.
