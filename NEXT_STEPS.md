# AI IELTS Optimizer V2 — Next Steps

## Current Checkpoint

Step 19F complete.

The learner-state read path is working:

HTTP
→ Express
→ learnerStateService
→ PostgreSQL
→ JSON

The learner-state endpoint has been verified against a real database learner.

---

# Step 20 — Learning State Updater

## Primary Objective

Create a centralized transactional backend/domain service that receives
assessment evidence and updates persistent learner state.

The service must update:

- mastery_states
- learner_error_states

in a consistent PostgreSQL transaction.

---

## Step 20A — Audit Existing Learning Logic

Before implementing the updater, inspect:

- src/components/DiagnosticFlow.tsx
- src/components/ReadingModule.tsx
- src/components/WritingModule.tsx
- src/services/profile/profileService.ts
- src/engine/
- src/data/diagnosticContent.ts
- src/data/mockContent.ts
- src/types/learning.ts

Goal:

Identify what learner-state logic already exists and avoid duplicating or
discarding useful domain behavior.

---

## Step 20B — Define Assessment Evidence Contract

Design a shared backend input model for assessment evidence.

It should be capable of representing:

- learner ID
- source type
- subskill
- score
- correctness
- error pattern
- evidence strength
- timestamp
- assessment context

Possible source types:

- diagnostic
- practice
- retest
- verification

Do not finalize weighting until the existing frontend/domain logic has been audited.

---

## Step 20C — Define Mastery Update Algorithm

Determine:

- how much a single observation changes mastery
- how evidence count affects update strength
- how diagnostic evidence differs from practice evidence
- how repeated evidence changes confidence
- how improvement and regression affect trend
- how retest evidence is weighted

The algorithm should be explicit, deterministic, testable, and centralized.

---

## Step 20D — Implement Learning State Updater

Create one centralized service responsible for:

1. validating assessment evidence
2. updating mastery
3. updating confidence
4. updating evidence count
5. updating trend
6. recording detected learner errors
7. updating error frequency
8. updating error trend
9. maintaining transaction integrity

---

## Step 20E — Create Tests

Required tests:

- first evidence
- repeated correct evidence
- repeated incorrect evidence
- mixed evidence
- multiple subskills
- multiple errors
- diagnostic evidence
- practice evidence
- retest evidence
- rollback on failure

Test data must not remain in the development database.

---

## Step 20F — Create Assessment Submission API

After the domain service is stable, expose a backend API for assessment evidence.

Potential direction:

POST /api/assessment-results

The exact contract must be finalized after the domain model is implemented.

---

## Step 20G — Integrate Frontend

After backend behavior is verified:

DiagnosticFlow
→ API
→ Learning State Updater

ReadingModule
→ API
→ Learning State Updater

WritingModule
→ API
→ Learning State Updater

The frontend should eventually stop directly owning persistent learner mastery.

---

## Step 20H — Verify End-to-End

Final target:

User action
→ assessment result
→ backend API
→ Learning State Updater
→ PostgreSQL
→ updated learner state
→ GET /api/learner-state/:learnerId
→ frontend reflects updated state

---

# Parallel Documentation Work

Before major implementation steps:

- update PROJECT_MEMORY.md
- update PROJECT_STATUS.md
- update ARCHITECTURE.md when architecture changes
- update DECISIONS.md when a new architectural decision is made

---

# Session Completion Checklist

At the end of each meaningful development session:

- run relevant tests
- update PROJECT_STATUS.md
- update NEXT_STEPS.md
- update PROJECT_MEMORY.md when necessary
- update ARCHITECTURE.md if architecture changed
- update DECISIONS.md if a new decision was made
- git add
- git commit
- git push

---

# Recovery Instruction

If the chat history is lost:

1. Read PROJECT_MEMORY.md
2. Read PROJECT_STATUS.md
3. Read ARCHITECTURE.md
4. Read DECISIONS.md
5. Read NEXT_STEPS.md
6. Inspect the source and runtime
7. Verify the documented checkpoint
8. Continue from the current next step

Do not repeat completed work unless verification shows it is broken.
