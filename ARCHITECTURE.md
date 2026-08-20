# AI IELTS Optimizer V2 — Architecture

## 1. High-Level System

The system is an AI-powered IELTS learning platform.

Primary flow:

User
→ React Frontend
→ Express API
→ Domain / Service Layer
→ PostgreSQL
→ Learner State

AI-assisted flows may additionally call:
Express
→ Google Gemini / AI services
→ Structured assessment result
→ Learning State Updater
→ PostgreSQL

---

## 2. Frontend Architecture

Main source directory:

src/

Important areas:

src/components/
- UI and feature components
- Existing Reading and Writing modules
- Diagnostic flow
- Daily optimization UI
- Other learning interfaces

src/features/
- Feature-specific modules
- ZeroClimber and related learning functionality

src/services/
- Frontend/domain-facing service logic
- Existing profile-related logic

src/data/
- Diagnostic content
- Mock learning content
- Reading passages
- Writing prompts
- Learning taxonomy metadata
- Existing pathway/recommendation data

src/engine/
- Learning/recommendation logic
- Mastery-related calculations
- Prioritization
- Pathway/recommendation logic

src/types/
- Shared TypeScript domain types
- Canonical `SubskillId`
- Learning-related interfaces

Important existing frontend components include:

- DiagnosticFlow
- ReadingModule
- WritingModule
- DailyOptimizer
- ZeroClimber-related components

---

## 3. Backend Architecture

Current server entry:

server.ts

Main backend stack:

Node.js
→ Express
→ service/domain logic
→ PostgreSQL

Current backend files:

src/server/db.ts
- PostgreSQL connection pool
- Uses `pg`
- Reads PostgreSQL configuration from environment variables

src/server/learnerState.ts
- Learner mastery initialization
- Creates one mastery state for each canonical subskill

src/server/learnerStateService.ts
- Reads learner profile
- Reads mastery states
- Reads active learner errors

src/server/learnerStateRoutes.ts
- Express router for learner state

---

## 4. Database Architecture

Database:

PostgreSQL 18.6

Database name:

ai_ielts_optimizer

Current core entities:

users
→ learner_profiles

skills
→ subskills

learner_profiles
→ mastery_states

learner_profiles
→ learner_error_states

error_patterns
→ error_pattern_subskills
→ subskills

---

## 5. Identity Layer

users

Represents the application-level user identity.

Current relationship:

One user
→ one learner profile

learner_profiles

Contains learner-specific information such as:

- name
- target band
- current level type
- previous official score
- exam date
- booking status
- available study time
- preferred session duration
- onboarding state

---

## 6. Learning Taxonomy

skills

Current domains:

- reading
- writing
- cross_skill

subskills

Current canonical IDs:

Reading:
- reading_paraphrase
- reading_cause_effect
- reading_detail_inference
- reading_summary_completion

Writing:
- writing_task_response
- writing_coherence_cohesion
- writing_lexical_resource
- writing_complex_grammar

Cross-skill:
- cross_paraphrase_transfer
- cross_argument_logic

Total:
10 subskills

Canonical source:
src/types/learning.ts

Currently implemented metadata source:
src/data/mockContent.ts

---

## 7. Error Taxonomy

Current canonical error patterns:

- ERR_PARAPHRASE_DISTORTION
- ERR_EXTRAPOLATION_TRAP
- ERR_FALSE_CORRELATION
- ERR_EVIDENCE_BOUNDARY
- ERR_OVERCONFIDENCE_BIAS
- ERR_VOCAB_INFERENCE
- ERR_LITERAL_MATCHING
- ERR_DETAIL_MISMATCH
- ERR_POLARITY_INVERSION
- ERR_UNSUBSTANTIATED_LEAP
- ERR_CROSS_PARAGRAPH_DISTORTION
- ERR_REVERSED_CAUSALITY
- ERR_SOLUTION_VS_PROBLEM

Error patterns and subskills use a many-to-many relationship.

Mapping table:

error_pattern_subskills

This prevents the system from incorrectly forcing every error into exactly
one subskill.

---

## 8. Learner Mastery

Table:

mastery_states

One learner can have one mastery state per subskill.

Important fields include:

- mastery
- confidence
- evidence_count
- baseline
- trend
- last_updated_at
- last_assessed_at
- last_practiced_at

Initial state:

mastery = 0.50
baseline = 0.50
confidence = insufficient_data
evidence_count = 0
trend = new

Mastery values are stored in the database as 0.0–1.0.

---

## 9. Learner Error State

Table:

learner_error_states

Purpose:

Represent the learner-specific persistent state of an error pattern.

Important concepts:

- frequency
- first detected time
- last detected time
- trend
- resolved state
- intervention count
- intervention linkage
- evidence

This table is different from `error_patterns`.

`error_patterns`:
What types of mistakes exist in the learning system?

`learner_error_states`:
Which mistakes does this learner repeatedly make?

---

## 10. Current Learner State API

Endpoint:

GET /api/learner-state/:learnerId

Current response:

{
  profile,
  mastery,
  activeErrors
}

Request flow:

HTTP request
→ learnerStateRouter
→ getLearnerState()
→ PostgreSQL
→ JSON response

The endpoint has been tested successfully against a real database learner.

---

## 11. Intended Learning Engine

The long-term architecture is:

Diagnostic / Practice / Writing / Reading
→ Assessment Result
→ Learning State Updater
→ mastery_states
→ learner_error_states
→ Recommendation / Prioritization
→ Intervention
→ Practice
→ Retest
→ Verification
→ Updated Learner State

The Learning State Updater should become the centralized domain service
responsible for learner-state mutation.

---

## 12. Source of Truth

The intended hierarchy is:

1. Runtime / PostgreSQL
2. Source code
3. Project documentation
4. Chat history

If documentation conflicts with runtime or source code,
runtime/source must be investigated and documentation updated.

---

## 13. Critical Architecture Rule

Frontend components should not become independent persistent
sources of truth for learner mastery.

Examples:

ReadingModule
WritingModule
DiagnosticFlow

may calculate or produce assessment evidence, but persistent learner-state
updates should ultimately flow through the centralized backend/domain layer.

Intended future flow:

Frontend result
→ API
→ Learning State Updater
→ PostgreSQL transaction
→ updated learner state

---

## 14. Current Architecture Gaps

The following are not yet complete:

- Centralized Learning State Updater
- Formal assessment submission API
- Mastery update algorithm
- Evidence weighting system
- Confidence progression
- Error trend update algorithm
- Retest verification pipeline
- Full frontend integration with persistent learner state
- Full UI architecture audit

These are deliberate next-stage work items, not accidental omissions.

---

## 15. Current Checkpoint

Completed:

- PostgreSQL foundation
- Identity model
- Learning taxonomy
- Error taxonomy
- Error/subskill many-to-many model
- Mastery initialization
- Learner state read service
- Learner state API
- Runtime validation

Current checkpoint:

Step 19F complete.

Next major architectural milestone:

Step 20 — Learning State Updater
