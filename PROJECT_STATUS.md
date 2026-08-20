# AI IELTS Optimizer V2 — Project Status

Last updated:
2026-08-20

## Database

- [x] PostgreSQL 18.6 installed and running
- [x] Database `ai_ielts_optimizer`
- [x] Node.js → pg → PostgreSQL connection
- [x] `users`
- [x] `learner_profiles`
- [x] `skills`
- [x] `subskills`
- [x] `error_patterns`
- [x] `error_pattern_subskills`
- [x] `mastery_states`
- [x] `learner_error_states`

## Migrations

- [x] 001_identity.sql
- [x] 002_learning_model.sql
- [x] 003_seed_learning_taxonomy.sql
- [x] 004_fix_error_pattern_relations.sql
- [x] 005_seed_error_patterns.sql
- [x] 006_map_error_patterns_to_subskills.sql

## Learning Taxonomy

- [x] 3 skill domains
- [x] 10 canonical subskills
- [x] 13 canonical error patterns
- [x] 14 error-pattern → subskill mappings

## Backend

- [x] `src/server/db.ts`
- [x] `src/server/learnerState.ts`
- [x] `src/server/learnerStateService.ts`
- [x] `src/server/learnerStateRoutes.ts`
- [x] `GET /api/learner-state/:learnerId`

## Runtime Verification

- [x] Database connection test
- [x] Database CRUD test
- [x] Mastery initialization test
- [x] Learner state read test
- [x] HTTP endpoint test
- [x] Test data cleanup
- [x] TypeScript compilation

## Frontend

- [x] Existing React application
- [x] Existing Reading module
- [x] Existing Writing module
- [x] Existing Diagnostic flow
- [x] Existing learning/recommendation components
- [ ] Full frontend/UI architecture audit
- [ ] Connect persistent learner state to frontend
- [ ] Remove/replace duplicated learner-state sources

## Current Architecture

React
→ Express
→ Services
→ PostgreSQL

Persistent learner state:
PostgreSQL = source of truth

## Current Checkpoint

Step 19F complete.

## Current Next Step

Step 20 — Learning State Updater

### Objective

Create a centralized transactional domain service that receives
assessment evidence and updates:

- `mastery_states`
- `learner_error_states`

### Constraints

- Do not duplicate mastery logic inside ReadingModule.
- Do not duplicate mastery logic inside WritingModule.
- Do not duplicate mastery logic inside DiagnosticFlow.
- Preserve canonical subskill IDs.
- Preserve error taxonomy.
- Use PostgreSQL transactions.
- Keep backend learner state as the source of truth.

## Known Open Questions

- Mastery update algorithm
- Evidence weighting
- Confidence progression
- Error frequency/trend rules
- Diagnostic vs practice evidence
- Retest evidence
- Assessment submission API
- Frontend learner-state migration
