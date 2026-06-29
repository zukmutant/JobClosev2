# JobClose Engineering Standards

This document is the engineering source of truth for JobClose architecture, approved stack, code boundaries, persistence, service layers, validation, and testing.

It applies to ChatGPT reasoning, implementation tasks, implementation planning, and repository work.

Before proposing architecture, stack, data model, persistence, frontend/backend boundary, UI service layer, validation, or testing changes, use this file as the primary JobClose engineering reference.

This document defines general engineering standards. It must not contain feature-specific implementation details such as concrete component names, local state names, matcher result names, temporary implementation shortcuts, or current feature-specific flows. Feature-specific plans belong in feature documents or product progress notes.

## 1. Approved external references

Engineering recommendations must be based on approved sources, not assistant improvisation.

### Primary React architecture reference

Bulletproof React:
https://github.com/alan2207/bulletproof-react

Use it as the primary practical reference for production React application structure, project standards, API layer, components, hooks, types, testing, error handling, and maintainable boundaries.

### Frontend architecture reference

Feature-Sliced Design:
https://fsd.how/docs/get-started/overview/

Use it as the reference for frontend layering, boundaries, and feature/entity/shared separation.

Use FSD-lite incrementally. FSD-lite is a direction for new or refactored code, not a mandate to reorganize the existing project in one pass. Do not propose a full FSD migration unless the product owner explicitly approves it.

### React state/component reference

React official docs — Thinking in React:
https://react.dev/learn/thinking-in-react

Use it for:

- component breakdown
- minimal UI state
- derived data
- data flow
- state ownership
- building UI from data models

### Next.js reference

Next.js project structure:
https://nextjs.org/docs/app/getting-started/project-structure

Next.js Server and Client Components:
https://nextjs.org/docs/app/getting-started/server-and-client-components

Next.js Server Actions and Mutations:
https://nextjs.org/docs/app/getting-started/updating-data

Next.js Caching and Revalidating:
https://nextjs.org/docs/app/getting-started/caching-and-revalidating

Use these for:

- App Router structure
- route handlers
- server/client boundaries
- browser-only API placement
- server data vs client interactivity
- Server Actions
- route refresh and cache revalidation

### UI framework reference

Mantine Next.js guide:
https://mantine.dev/guides/next/

Use Mantine as the approved UI framework.

JobClose UI boundary rule:

- Direct `@mantine/core` imports are allowed only in approved Mantine boundary files.
- Approved production Mantine boundary files are `components/ui/**` and `app/layout.tsx`.
- Approved non-production Mantine boundary files may include test/provider setup, Storybook provider setup, or visual sandbox provider setup, only when those files exist and are explicitly used to install Mantine providers, theme, or test rendering infrastructure.
- App components, feature components, feature tests, and feature stories must import UI primitives through `components/ui/**` unless a task explicitly approves a boundary exception.

### Backend/database reference

Prisma with Next.js:
https://www.prisma.io/nextjs

Prisma PostgreSQL docs:
https://www.prisma.io/docs/orm/overview/databases/postgresql

PostgreSQL docs:
https://www.postgresql.org/docs/current/

Prisma schema reference:
https://www.prisma.io/docs/orm/reference/prisma-schema-reference

PostgreSQL UUID functions:
https://www.postgresql.org/docs/current/functions-uuid.html

Use PostgreSQL + Prisma as the target MVP backend persistence stack.

### Validation reference

Zod:
https://zod.dev/

Use Zod for external and unsafe input boundaries.

### Testing reference

Testing Library guiding principles:
https://testing-library.com/docs/guiding-principles/

Use this principle:

> Tests should resemble how users use the product.

Source-string tests may protect architecture boundaries, but they are not a replacement for behavior tests.

## 2. Approved JobClose stack

### Frontend

- Next.js App Router
- React
- TypeScript

### UI

- Mantine
- Mantine through `components/ui/**` wrappers
- `lucide-react` for icons
- global CSS only as a legacy/supporting layer

Do not introduce Tailwind, shadcn/ui, Radix as a new UI stack, or another design system without explicit product-owner approval.

### State

Approved state rules:

- React local state for UI-only state
- derived data must be computed, not stored separately
- URL search parameters for shareable and reload-safe interactive UI state
- no Redux, Zustand, Jotai, XState, React Query, or other state manager without explicit product-owner approval

React local state is appropriate for:

- temporary input values
- open/closed UI state
- unsaved draft UI state
- local pending/error state
- client-only view interactions

React local state is not appropriate for:

- persisted business records
- canonical domain state
- cross-device user data
- backend mutation source of truth
- business data that must survive real user sessions

### URL state rule

For shareable and reload-safe interactive UI state, prefer URL search parameters.

Use URL search parameters for:

- active filters
- search query
- sort order
- pagination
- selected tab
- lightweight view mode

Do not use URL search parameters for:

- draft text
- sensitive data
- large payloads
- business records
- user corrections
- unconfirmed matcher decisions
- temporary parser results

If UI state must survive reloads and be shareable, use URL search parameters before considering `localStorage`.

If UI state is business data or must survive across devices/sessions, use approved backend persistence instead.

### Backend

- Next.js Route Handlers and/or Server Actions
- application services in an explicit service layer
- domain logic must not live inside UI components

The chosen service location must be named in each implementation task. Acceptable locations include `lib/server/**`, `lib/<domain>/**`, or an approved feature/service folder.

### Database

- PostgreSQL is the target MVP database
- Prisma is the approved ORM/data access layer

### Validation

- Zod is the approved runtime validation layer for external and unsafe input boundaries
- TypeScript is the approved internal type-safety layer for trusted in-process code

### Persistence

Target MVP business persistence is PostgreSQL through Prisma.

Business data that must survive reloads, browser changes, devices, or real user sessions must be stored through the approved backend persistence layer:

- PostgreSQL
- Prisma
- Next.js Route Handlers and/or Server Actions
- Zod validation before writes

`localStorage` is not an approved persistence layer for real MVP business data.

`localStorage` may be used only for explicitly approved prototype-only experiments or non-business UI preferences. If `localStorage` is used for a prototype, the task must clearly state:

- what data is stored locally
- why server persistence is not used yet
- when it must be replaced
- what user-facing limitations exist

Do not introduce new `localStorage` business-data storage unless the product owner explicitly approves it for a temporary prototype step.

## 3. Decision source hierarchy

Use this order:

1. Explicit product-owner decision
2. Approved JobClose plan/document
3. Current committed code behavior
4. This engineering standards file
5. Official references listed above
6. Assistant or implementation-agent recommendation

If a lower source conflicts with a higher source, the higher source wins.

If no approved source supports a recommendation, do not implement. Present options and ask for approval.

Non-behavioral editorial maintenance may be recommended when supported by the current committed file or repository state.

Allowed editorial maintenance examples:

- typo fixes
- Markdown formatting fixes
- duplicate document removal
- broken internal link fixes
- heading consistency fixes
- clarification of existing process wording without changing behavior

This editorial-maintenance exception must not be used for architecture, stack, data model, persistence, validation, product behavior, UI behavior, domain rule, or runtime behavior changes.

## 4. Bootstrap rule

If the repository is empty or does not yet contain the approved stack, implementation must start with a minimal project scaffold only.

A bootstrap task may create:

- package configuration
- Next.js App Router base files
- TypeScript configuration
- Mantine provider boundary
- approved UI wrapper boundary
- test runner configuration
- README

A bootstrap task must not implement product behavior unless the product behavior is separately approved.

Do not mix project bootstrap with feature implementation unless the product owner explicitly approves that combined scope.

## 5. Required layer model

Use this layer model:

```text
UI components
↓
presentation adapters / view models
↓
application services
↓
domain models and domain rules
↓
repositories / local stores / external adapters
↓
database / API / external service
```

Rules:

- UI components render data and collect user input.
- UI components must not own domain formatting, persistence logic, matching/search logic, backend rules, or long payload construction.
- Presentation adapters turn domain data into display data.
- Application services own use-case flow.
- Domain models and domain rules represent business concepts and invariants.
- Repositories own storage mechanics.
- External adapters own integration mechanics.
- Domain models stay stable and should not be duplicated.

## 6. Data model rules

Each business object must have one canonical domain model.

Do not create uncontrolled parallel schemas for the same business object.

Allowed model variants must have a clear layer and purpose:

- domain model — canonical business object
- create/update input — validated data accepted from UI/API
- persistence model — database/ORM representation
- search/match input — narrowed data used by deterministic matching/search logic
- display/view model — data prepared for UI rendering
- API DTO — data crossing client/server boundaries

Rules:

- Every non-domain variant must map explicitly to or from the canonical domain model.
- UI components must not invent their own business-object shape.
- Search/matching functions must not return UI layout models.
- Repositories must not return UI display strings.
- Persistence models must not leak directly into UI components.
- UI display models must not become persistence models.
- If a new model variant is needed, its layer and mapper must be named in the task.

Forbidden:

- uncontrolled alternative schemas that become separate sources of truth
- copying business-object fields into ad hoc objects inside components without a mapper
- changing the canonical domain model shape because one UI component needs different display text
- hiding schema changes inside UI work

## 7. Validation boundary rules

Zod validation is required at external and unsafe input boundaries:

- UI form payloads crossing into Server Actions
- API Route request bodies and query parameters
- file/document/parser outputs before they enter domain logic
- webhook or external service payloads
- data loaded from untrusted external sources
- persistence write inputs before database mutation

Inside trusted server-side application flow, use TypeScript types and canonical domain models instead of repeating Zod validation at every internal function boundary.

Do not duplicate the same runtime validation across UI, application service, domain service, and repository layers unless there is a specific security, trust-boundary, or data-integrity reason.

Repositories may assume they receive validated persistence inputs from the application service layer, unless the repository is itself the first trust boundary.

Validation schemas must not become uncontrolled alternative domain models. If a Zod schema represents a non-domain variant, its layer and mapping to or from the canonical domain model must be clear.

## 8. Parsing, matching, and normalization rules

Parsing, matching, normalization, deduplication, and candidate ranking are not UI responsibilities.

They must live in the correct non-UI layer:

- pure deterministic rules belong in domain rules or domain services
- use-case orchestration belongs in application services
- external library integration belongs in an adapter or clearly named helper
- UI rendering preparation belongs in presentation adapters / view models

Rules:

- UI components may trigger parsing or matching through an approved service or pure function, but must not contain the parser or matcher logic.
- Parser and matcher functions must return domain results, not UI layout models.
- UI labels, badges, row text, grouping, and empty-state wording must be produced by presentation adapters or view models.
- External parsers, metadata libraries, and normalizers must not be hidden inside UI components.
- AI must not replace deterministic validation where standards, metadata, or libraries exist.

## 9. Persistent entity identifiers

Source of truth:

- Prisma schema reference
- Prisma PostgreSQL documentation
- PostgreSQL UUID functions

Target PostgreSQL + Prisma rule:

- Persistent business entities must have stable primary identifiers.
- Identifier strategy is part of the persistence schema, not UI component logic.
- Prefer Prisma/PostgreSQL UUID defaults for MVP business entities unless the product owner explicitly approves a different strategy.
- UI components must not generate identifiers for database-persisted records.
- Existing seeded/demo entity ids must be preserved during seeding and migration unless the product owner explicitly approves an id migration.

Prototype-local exception:

- Browser-local prototype records may use browser-generated identifiers only when prototype-local persistence is explicitly approved.
- Prototype-local identifier strategy must be reviewed when the data moves to PostgreSQL.
- Prototype-local storage must not be treated as the target backend persistence model.

## 10. Presentation adapter / view model rules

Do not put domain-to-display formatting directly into UI components.

Use presentation adapters / view models when domain data must be rendered consistently.

Generic examples:

- domain model -> display model
- search/match result + domain model -> candidate display model
- form state -> submit payload

A display model should contain render-ready fields such as:

```ts
type DisplayModel = {
  id: string;
  label: string;
  secondary: string[];
  badges?: string[];
};
```

Rules:

- UI renders display models.
- Search/matcher logic returns domain results, not UI layout.
- Repositories return domain or persistence models, not UI strings.
- Adapters avoid empty separators and duplicate formatting logic.
- Repeated formatting must be moved out of UI components into an adapter.
- Adapters must not perform persistence, mutation, external calls, or hidden product decisions.

## 11. Persistence rules

Target MVP persistence:

```text
PostgreSQL
Prisma
Next.js Route Handlers / Server Actions
Zod validation at trust boundaries
```

Repository/service boundary:

```text
UI
→ application service
→ repository
→ database/local store/external adapter
```

Rules:

- UI must not know storage details.
- UI must not directly call external persistence services.
- Repositories own storage mechanics.
- Application services own use-case flow and call repositories.
- Local prototype storage is acceptable only for explicitly approved prototype-only flows.
- If a feature must work for real users across browser sessions/devices, use server/database persistence.

## 12. API and service rules

Backend mutations must follow this pattern:

```text
validate external input with Zod
call application service
service applies business rules
repository writes data
return typed result
UI updates from result
```

Rules:

- Do not call external services directly from UI components.
- Do not let UI components enforce backend business rules if those rules affect persisted state.
- Do not write to repositories directly from presentational UI components.
- Backend mutations must validate external input before writing to storage.
- Service functions must return typed success/failure results that UI can render.
- Final UI execution state must come from handler/service/backend result, not AI, matcher output, or UI assumption.

### Client mutation and async UI state rule

Business-data mutations triggered from the client must not use ad hoc client-side `fetch` calls from UI components.

Preferred mutation path:

```text
Client UI
→ Server Action or approved Route Handler
→ Zod validation at the boundary
→ application service
→ repository
→ persistence
→ typed result returned to UI
```

Client components may use React mutation hooks such as `useActionState`, `useTransition`, or form action state to represent pending, submitted, and error state.

After a successful mutation, freshness must be handled explicitly by the mutation path using one of:

- returned typed result
- `refresh()`
- `revalidatePath`
- `revalidateTag`
- approved route refresh behavior

Do not call `router.refresh()` blindly after every mutation. Use it only when the feature contract says the current route must be refreshed and server-side cache invalidation is not required.

Do not use `useEffect` + client `fetch` as the default mechanism for business-data mutations. Exceptions must be named in the feature document.

## 13. UI implementation rules

Mantine is the approved UI framework.

Rules:

- App code imports UI primitives from `components/ui/**`.
- Do not import `@mantine/core` directly outside the approved Mantine boundary.
- Do not introduce Tailwind or shadcn without explicit product-owner approval.
- Do not create new custom UI primitives when a project-approved Mantine wrapper exists.
- Do not change product behavior during visual refactors.
- UI refactors must preserve props, callbacks, payloads, disabled rules, and copy unless explicitly approved.
- Global CSS must not become the main design system for new UI.
- Existing global CSS may be reduced gradually as components move to approved Mantine wrappers.

### Mantine import boundary

Direct `@mantine/core` imports are allowed only in:

- `components/ui/**`
- `app/layout.tsx`
- approved test/provider setup files
- approved Storybook provider setup files, if Storybook exists
- approved visual sandbox provider setup files, if a visual sandbox exists

Non-production boundary files may import Mantine only to install providers, theme, wrappers, or rendering infrastructure. They must not become feature implementation files.

Feature code, app components, feature-specific tests, feature-specific stories, and visual examples must use project UI wrappers from `components/ui/**` unless the task explicitly approves a boundary exception.

Boundary exceptions must name:

- file path
- reason
- whether the exception is temporary or permanent
- replacement plan, if temporary

### `components/ui/**` composition rule

Components in `components/ui/**` are generic design-system primitives.

They must not contain:

- feature-specific business behavior
- domain-specific validation
- parser-specific rendering
- matcher-specific states
- persistence logic
- service calls
- product-flow decisions

Feature-specific behavior must be implemented through composition in feature components, presentation adapters, or view models.

Allowed in `components/ui/**`:

- visual variants
- accessibility behavior
- generic loading/disabled/error props
- generic layout and composition primitives
- Mantine wrapping and style normalization

Forbidden in `components/ui/**`:

- feature-specific props
- business-object names
- parser/matcher-specific rendering
- service/repository calls
- hidden product decisions

## 14. Product behavior approval rule

ChatGPT and implementation agents must not invent:

- new buttons
- new UI states
- new confirmation steps
- second-click flows
- matcher timing changes
- auto-filled fields
- suggested / ambiguous / conflict behavior
- submit / disabled / loading behavior
- payload changes
- backend persistence model
- data schema changes

For any UI/product behavior change, first produce:

```text
Source:
Problem:
Options:
Recommendation:
Approval needed:
```

Do not start implementation until the product owner approves the behavior.

Implementation agents must not design UX flows. They may only implement an approved UI contract.

## 15. Feature-specific engineering rules

Feature-specific implementation rules must live outside this general engineering standards file.

Use this file for:

- stack
- architecture
- layer rules
- boundaries
- persistence standards
- validation standards
- testing standards

Do not put concrete feature component names, local state names, matcher result names, or current feature-specific implementation details in this file.

Feature-specific documents should live under:

```text
docs/features/**
```

Feature-specific documents may define:

- concrete domain model names
- concrete UI component names
- concrete adapter names
- concrete route names
- concrete state machines
- concrete matcher behavior
- concrete accepted user flows
- concrete forbidden behavior
- concrete test expectations

Feature-specific documents must still comply with this engineering standards file.

## 16. Testing rules

Use the correct test level:

- pure logic: node/unit test
- mapper/adapter: unit test
- repository/store: persistence behavior test
- API/service: integration-style test
- critical UI flow: user behavior test
- boundary rules: source/static assertion allowed

Source-string tests are not enough for UI behavior.

Required validation for implementation tasks unless explicitly scoped smaller:

```text
git diff --check
npm run build
npm run test:ci
```

For feature-specific work, run that feature's relevant tests as well.

### Read-only QA / inspection validation

Read-only QA, reasoning, and inspection tasks do not modify files, run migrations, install packages, or execute code unless the task explicitly allows it.

For read-only QA, validation may be limited to static inspection of the approved source, repository files, diffs, or supplied artifacts.

A read-only QA report must state:

- source inspected
- scope inspected
- findings
- recommended follow-up tasks, if implementation is needed
- validation not run, with reason

Required implementation validation does not apply to read-only QA tasks unless the task explicitly asks for executable validation.

If a task allows command execution but forbids file changes, the report must separate:

- commands run
- files not modified
- findings from command output
- findings from static inspection

Rules:

- If a test relies on fixture bytes, fixture files must be tracked and protected from platform-specific line-ending conversion.
- Do not update expected fixtures from local-only output without checking committed fixture inputs.
- CI must be treated as the source for cross-platform validation.
- Do not use source-string assertions as the only proof of UI behavior.

## 17. Required engineering discipline

Before giving an engineering recommendation, state the source used:

- product-owner decision
- approved JobClose plan/document
- current committed code
- this engineering standards file
- official documentation listed in this file

If no source supports the recommendation, do not recommend implementation. Ask for approval or write an inspection task.

Every engineering recommendation must name the affected layer:

- UI
- presentation adapter / view model
- application service
- domain model
- repository/store
- API route / server action
- database
- validation schema
- test

If the affected layer is unclear, inspect first.

Do not implement until the layer, source, data model, and validation method are known.

## 18. Implementation-agent role

Implementation agents are implementation executors, not product owners or UX designers.

Implementation agents must implement only approved mechanics.

If a task requires product/UI behavior that is not specified, the implementation agent must stop and report options rather than invent behavior.

Final implementation reports must include:

- files changed
- behavior changed
- behavior not changed
- validation run
- tests passed/failed
- untracked files left untouched
- commit hash and push status when committed

### Read-only QA / inspection report

Read-only QA and inspection reports must include:

- source used
- inspected scope
- findings
- severity or recommendation
- suggested task, if implementation is needed
- validation not run, with reason

Read-only QA reports must not claim files changed, commits created, tests passed, or push status unless those actions actually happened.

Read-only QA reports must not present product behavior, UI behavior, architecture, stack, schema, persistence, validation, or domain-rule changes as implementation-ready unless supported by the decision source hierarchy.

## 19. What not to introduce without explicit approval

Do not introduce any of the following without explicit product-owner approval:

- Tailwind
- shadcn/ui
- Radix as a new UI stack
- Redux
- Zustand
- Jotai
- XState
- React Query / TanStack Query
- tRPC
- Supabase
- Firebase
- Drizzle instead of Prisma
- another database instead of PostgreSQL
- another ORM instead of Prisma
- a new design system
- a new hidden AI decision/risk/routing layer
- a new persistence model
- a new domain schema for existing business objects

## 20. Migration rule

Do not perform large architecture migrations in one step.

Use incremental slices:

1. Inspect current files and boundaries.
2. Identify affected layer.
3. Identify approved source.
4. Implement one small slice.
5. Validate.
6. Commit.
7. Move to the next slice.

Do not mix:

- UI refactor
- product behavior change
- persistence change
- schema change
- test cleanup
- docs cleanup

unless explicitly approved.
