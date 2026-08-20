# AI IELTS Optimizer V2 — Project Memory

## 1. Project Identity

Project name:
AI IELTS Optimizer V2

Current repository:
Web-Ielts-AIStudio-V2

Primary goal:
Build an AI-powered IELTS learning system that does more than score answers.
The system should diagnose weaknesses, track learner mastery, identify recurring
errors, recommend targeted interventions, and verify improvement through retesting.

Long-term direction:
Evolve from an IELTS preparation application into a personalized learning
platform capable of replacing a meaningful portion of ineffective or
non-personalized tutoring.

---

## 2. Product Philosophy

Core principle:

AI should act as a learning engine, not merely as a chatbot or generic grader.

The product should answer:

1. What is the learner weak at?
2. Why is the learner weak?
3. What should the learner practice next?
4. Did the intervention actually improve the weakness?
5. Can the system verify that improvement?

The long-term learning loop is:

Diagnostic
→ Assessment
→ Learner State
→ Error Detection
→ Prioritization
→ Intervention
→ Practice
→ Retest
→ Verification
→ Updated Learner State

---

## 3. Current Product State

The project currently contains:

- React frontend
- Express/Node backend
- PostgreSQL persistent database
- Existing IELTS Reading functionality
- Existing IELTS Writing functionality
- Diagnostic flow
- Learning engine components
- Recommendation-related components
- Learner profile logic
- Persistent learner-state foundation

The current development phase is focused on moving learner state from
frontend/mock-only logic into a persistent backend-driven learning system.

---

## 4. Current Backend Foundation

PostgreSQL:
- Version: 18.6
- Database: ai_ielts_optimizer
- Host: localhost
- Port: 5432

Database connection:
- src/server/db.ts
- pg Pool
- Environment variables:
  PGHOST
  PGPORT
  PGDATABASE
  PGUSER
  PGPASSWORD

Current migrations:

001_identity.sql
- users
- learner_profiles

002_learning_model.sql
- skills
- subskills
- mastery_states
- learner_error_states
- error_patterns

003_seed_learning_taxonomy.sql
- 3 skills
- 10 subskills

004_fix_error_pattern_relations.sql
- converts error_patterns → subskills relationship to many-to-many

005_seed_error_patterns.sql
- 13 canonical error patterns

006_map_error_patterns_to_subskills.sql
- 14 error-pattern → subskill mappings

---

## 5. Current Database Model

users
→ learner_profiles

skills
→ subskills

learner_profiles
→ mastery_states
→ learner_error_states

error_patterns
→ error_pattern_subskills
→ subskills

Important relationship decisions:

- One learner has one learner profile.
- One learner has one mastery state per subskill.
- Error patterns and subskills are many-to-many.
- learner_error_states records persistent learner-specific error state.
- PostgreSQL is the persistent source of truth for learner state.

---

## 6. Canonical Learning Taxonomy

Canonical SubskillId values from src/types/learning.ts:

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

The canonical source for currently implemented subskill metadata is:
src/data/mockContent.ts

Important:
Do not invent new subskill IDs without first checking src/types/learning.ts.

---

## 7. Current Error Taxonomy

13 canonical error patterns are currently seeded:

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

ERR_COMMA_SPLICE exists in demo/profile logic but is NOT currently part
of the canonical seeded error taxonomy.

Do not automatically add it without establishing a proper Writing error taxonomy.

---

## 8. Current Learner Mastery Model

mastery_states contains:

- mastery
- confidence
- evidence_count
- baseline
- trend
- last_updated_at
- last_assessed_at
- last_practiced_at

Initial learner state:

mastery = 0.50
baseline = 0.50
confidence = insufficient_data
evidence_count = 0
trend = new

A learner can be initialized with mastery states for all 10 subskills.

---

## 9. Current Learner State API

Backend service:

src/server/learnerState.ts
- initializeLearnerMastery()

src/server/learnerStateService.ts
- getLearnerState()

Route:

src/server/learnerStateRoutes.ts

HTTP endpoint:

GET /api/learner-state/:learnerId

Current API response structure:

{
  profile,
  mastery,
  activeErrors
}

The endpoint has been tested successfully against a real PostgreSQL learner.

---

## 10. Runtime Verification Completed

Verified:

- PostgreSQL connection
- Node.js → pg → PostgreSQL
- database CRUD
- transaction rollback
- mastery initialization
- learner state read service
- Express route
- HTTP endpoint
- TypeScript compilation

Test data used for API verification was cleaned afterward.

---

## 11. Current Architecture Direction

Frontend:
React components
→ HTTP API

Backend:
Express
→ domain/service layer
→ PostgreSQL

Learning system direction:

Assessment result
→ Learning State Updater
→ mastery_states
→ learner_error_states
→ recommendation logic

The backend should become the canonical owner of persistent learner state.

---

## 12. Critical Architectural Principle

Do not allow ReadingModule, WritingModule, DiagnosticFlow, or other individual
frontend components to independently become the source of truth for mastery.

Persistent learner-state mutation should eventually flow through a centralized
backend/domain service.

The intended future architecture is:

Frontend result
→ API
→ Learning State Updater
→ PostgreSQL transaction
→ updated learner state

---

## 13. Current Checkpoint

Completed:
- PostgreSQL foundation
- identity schema
- learning taxonomy
- error taxonomy
- error/subskill relationship model
- learner mastery initialization
- learner state read service
- learner state API
- runtime verification
- test cleanup

Current checkpoint:
Step 19F complete.

---

## 14. Immediate Next Step

Step 20 — Learning State Updater

Goal:

Create a transactional domain service that receives assessment results from
Diagnostic / Reading / Writing and updates:

- mastery_states
- learner_error_states

The service must avoid duplicated mastery logic across modules.

---

## 15. Current Open Questions

1. Define the exact mastery update algorithm.
2. Define evidence weighting.
3. Define confidence progression.
4. Define error frequency/trend update rules.
5. Define how Diagnostic differs from normal practice evidence.
6. Define how retest evidence changes mastery confidence.
7. Define backend API contracts for assessment submission.
8. Audit existing frontend learner-state logic and migrate it toward backend truth.

---

## 16. Recovery Rule

If chat history is lost:

1. Read this file first.
2. Read PROJECT_STATUS.md.
3. Read ARCHITECTURE.md.
4. Read DECISIONS.md.
5. Read NEXT_STEPS.md.
6. Inspect source/runtime to verify the documented state.
7. Continue from the current checkpoint.
8. Do not repeat already-completed work unless runtime verification shows it is broken.

Source/runtime truth takes precedence over stale documentation.

