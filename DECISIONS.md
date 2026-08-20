# AI IELTS Optimizer V2 — Architecture Decisions

## DEC-001 — PostgreSQL is the persistent source of truth

PostgreSQL is the canonical persistent storage for learner state.

Frontend state may be used for UI behavior and temporary interaction,
but persistent learner mastery and error state must ultimately be stored
and retrieved from PostgreSQL.

---

## DEC-002 — Learner state is backend-owned

The backend/domain layer is responsible for persistent learner-state mutation.

Frontend components such as:

- ReadingModule
- WritingModule
- DiagnosticFlow

may produce assessment evidence, but they should not independently become
the persistent source of truth for mastery.

---

## DEC-003 — Centralized Learning State Updater

Mastery and learner-error updates should eventually flow through one
centralized Learning State Updater service.

Intended flow:

Assessment Evidence
→ Learning State Updater
→ PostgreSQL transaction
→ Updated Learner State

This prevents different modules from implementing conflicting mastery
algorithms.

---

## DEC-004 — Error patterns and subskills are many-to-many

An error pattern may be relevant to multiple subskills.

Therefore the relationship is:

error_patterns
→ error_pattern_subskills
→ subskills

Do not reintroduce a single `subskill_id` foreign key on `error_patterns`
unless the domain model is deliberately redesigned.

---

## DEC-005 — Canonical Subskill IDs must remain stable

The canonical SubskillId definition lives in:

src/types/learning.ts

Current IDs:

- reading_paraphrase
- reading_cause_effect
- reading_detail_inference
- reading_summary_completion
- writing_task_response
- writing_coherence_cohesion
- writing_lexical_resource
- writing_complex_grammar
- cross_paraphrase_transfer
- cross_argument_logic

Do not silently rename or duplicate these IDs.

---

## DEC-006 — Do not invent domain taxonomy when canonical data exists

Existing project data should be treated as the first source for taxonomy.

Before creating:

- new subskills
- new error codes
- new categories
- new pathways

inspect the existing code and data first.

Avoid creating competing dictionaries that describe the same domain concept.

---

## DEC-007 — Mastery is stored as 0.0–1.0

Database mastery values use the normalized range:

0.0 = extremely weak
1.0 = extremely strong

Initial learner state:

0.50

The frontend may display a percentage or band representation,
but persistent storage remains normalized.

---

## DEC-008 — Initial mastery means insufficient evidence, not average ability

A new learner starts with:

mastery = 0.50
baseline = 0.50
confidence = insufficient_data
evidence_count = 0
trend = new

The initial 0.50 value must not be interpreted as a diagnosis that
the learner is actually average.

It is a neutral prior before evidence is collected.

---

## DEC-009 — Transactions are required for learner-state mutation

Updates involving multiple learner-state records should use PostgreSQL
transactions.

For example:

mastery update
+
error-state update
+
related evidence changes

should either succeed together or roll back together.

---

## DEC-010 — Test data must not remain in production tables

Integration tests may create temporary learners and learner states.

Test data must be:

- rolled back
- explicitly deleted
- or isolated in a test database

Do not leave accidental test learners in the real development database.

---

## DEC-011 — Runtime/source truth beats documentation

When these conflict:

1. Runtime / PostgreSQL
2. Source code
3. Documentation
4. Chat history

investigate the higher-priority source and update documentation.

Never blindly trust stale project notes.

---

## DEC-012 — Do not optimize architecture prematurely

Build the smallest correct domain model needed for the current product stage.

Do not introduce unnecessary:

- microservices
- message brokers
- distributed infrastructure
- complex event systems

until actual product requirements justify them.

The current architecture should remain:

React
→ Express
→ Services / Domain Logic
→ PostgreSQL

---

## DEC-013 — Existing frontend learning logic must be audited before migration

The existing frontend already contains learning and mastery-related logic.

Before replacing it, inspect:

- DiagnosticFlow
- ReadingModule
- WritingModule
- DailyOptimizer
- LearningEngine
- profile services
- recommendation engine

The goal is to preserve useful domain behavior while moving persistent
learner state toward the backend source of truth.

Do not blindly delete existing learning logic.

---

## DEC-014 — Diagnostic evidence and practice evidence may differ

The system should not assume that every assessment result has identical
evidential value.

Future Learning State Updater design must distinguish at least:

- diagnostic evidence
- normal practice evidence
- retest evidence
- verified improvement evidence

The exact weighting algorithm is intentionally not finalized yet.

---

## DEC-015 — Retest is part of verification, not just another practice task

A future retest should be used to determine whether a previously detected
weakness was actually improved.

The intended learning loop is:

Detect
→ Intervene
→ Practice
→ Retest
→ Verify
→ Update learner state

---

## DEC-016 — Chat is a workspace, repository is project memory

Chat history is useful for collaboration but is not the authoritative memory
of the project.

Project continuity must live in repository files:

- PROJECT_MEMORY.md
- PROJECT_STATUS.md
- ARCHITECTURE.md
- DECISIONS.md
- NEXT_STEPS.md

If chat history disappears, the project should remain recoverable.

---

## DEC-017 — Every major session should end with a checkpoint

At the end of meaningful development sessions:

1. Update project status.
2. Update next steps.
3. Update architecture/decisions when needed.
4. Run relevant tests.
5. Commit important changes.
6. Push to Git.

The repository should always have a recoverable project checkpoint.
