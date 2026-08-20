# OPUS 5 - START HERE

You are taking over an existing software/product project:

AI IELTS Optimizer V2 + ZeroClimber.

This is NOT a greenfield project.

The repository already contains:
- a working V2 IELTS learning application
- learner profile persistence
- mastery/error/re-test concepts
- recommendation/intervention logic
- adaptive session budgeting
- a ZeroClimber V0.1 prototype
- a local-first beginner evaluator with AI fallback

Your job is to CONTINUE the project, not redesign it blindly.

---

# REQUIRED READING ORDER

Before changing code, read these files:

1. PROJECT_HANDOFF.md
2. ZEROCLIMBER_AUDIT_PROMPT.md
3. PRODUCT_PRINCIPLES.md
4. CURRENT_STATE.md
5. GOLDEN_WORKFLOWS.md
6. OPUS5_HANDOFF/UI_REFERENCE/02-current-v2-product-surface.md
7. OPUS5_HANDOFF/UI_REFERENCE/03-your-mountain-current-state.md
8. OPUS5_HANDOFF/UI_REFERENCE/04-lesson-1-current-state.md

Then inspect the actual repository.

The repository is the source of truth for current implementation details.
The handoff documents are the source of truth for product direction and known decisions.

---

# CURRENT GIT CHECKPOINT

Current intended baseline:

8b74d9e feat: integrate ZeroClimber V0.1

Branch:
main

Verify the real state before editing.

---

# CORE PRODUCT DECISION

ZeroClimber is NOT a permanent mode.

The product must evolve toward ONE continuous mountain:

ZERO
? BASE CAMP
? FUNCTIONAL ENGLISH
? STRUCTURED COMMUNICATION
? IELTS READINESS
? IELTS PERFORMANCE
? SUMMIT

One learner.
One learner model.
One competency graph.
One adaptive learning system.

Do NOT create:
- separate ZeroClimber learner state
- separate ZeroClimber recommendation engine
- permanent mode switching
- duplicated sources of truth

---

# CURRENT V0.1 STATUS

ZeroClimber V0.1 is a technical/product vertical slice.

It proves:
- onboarding
- mountain overview
- camp progression
- Lesson 1
- persistence
- local deterministic evaluator
- AI fallback
- basic progression

It does NOT yet prove:
- complete competency graph
- evidence engine
- mastery engine
- transfer measurement
- delayed retention
- generic lesson engine
- unified adaptive planner
- final curriculum
- final mountain UX

Treat current Lesson 1 as PROTOTYPE, not final curriculum.

---

# IMPORTANT PERFORMANCE DECISION

The current evaluation pattern is:

learner answer
? local deterministic evaluator
? only if uncertain ? AI fallback

Do not regress this into:
every answer ? Gemini

Simple beginner grammar should be evaluated locally.

AI is for:
- ambiguity
- free-form production
- transfer
- nuanced explanation
- adaptive coaching

---

# CURRENT PRODUCT STRENGTH

The existing V2 already has:
- learner profile
- subskill mastery
- baseline mastery
- error memory
- error patterns
- re-test
- verification
- recommendation
- intervention
- session budgeting
- persistence

These are foundations to generalize, not systems to throw away.

---

# CURRICULUM PRINCIPLE

Competency > topic.

Topics are contexts.

The long-term curriculum should be competency-first and dependency-aware.

Base Camp currently has a conceptual competency map covering:
- sentence foundation
- core verbs
- noun/time/relation control
- vocabulary
- comprehension
- functional production

The detailed map is in the handoff documents.

Do NOT mass-generate Lesson 2+ before the competency/mastery architecture exists.

---

# MASTERY PRINCIPLE

Lesson completion != mastery.

Evidence dimensions:
- recognition
- controlled
- independent
- transfer
- retention

A learner can complete a lesson while still needing remediation.

The system must eventually determine mastery from evidence, not progress bars.

Immediate post-test performance is not enough.
Retention and transfer matter.

---

# LESSON PRINCIPLE

Target lesson flow:

Trailhead
? Micro Pre-check
? Goal / Why
? Model
? Notice
? Controlled Practice
? Guided Production
? Independent Production
? Transfer
? Mastery Check
? Delayed Review

Current Lesson 1 lacks some of these pieces.
That is a known prototype limitation.

---

# SESSION PRINCIPLE

Lesson != Session.

Session = available learning time.

The current V2 already supports adaptive session budgeting.
Reuse that system.

A 10-minute session, 20-minute session, and 30-minute session can use different activity sequences from the same lesson definition.

---

# MOUNTAIN UX PRINCIPLE

The mountain is a visualization of learning state.

It should represent:
- route
- terrain
- progress
- checkpoints
- remediation detours
- uncertainty
- challenge
- summit

It should NOT become:
- childish gamification
- XP wrapper
- cosmetic mountain wallpaper

The target visual language is:
Modern Alpine Expedition.

It must work for teenagers and adults.

---

# IMMEDIATE TASK

Do NOT:
- create Lesson 2
- mass-generate curriculum
- rewrite the entire app
- redesign the full UI
- big-bang rewrite LearnerProfile

Instead begin Phase 1.

First implementation:

Create:

src/types/learningEngine.ts

Define domain contracts for:

- CompetencyDefinition
- LearningObjective
- ActivityType
- ActivityDefinition
- LessonDefinition
- CompetencyEvidence
- MasteryState
- ReviewSchedule
- NextBestAction
- LearningSession

This should be non-invasive and should not break the current runtime.

---

# VALIDATION

After the first implementation:

npx tsc --noEmit

npm run build

If something fails:
- inspect the actual local code
- fix the smallest necessary problem
- rerun validation

Do not claim success without checking the real output.

---

# NEXT ARCHITECTURAL ORDER

After the domain types:

1. compatibility adapter
   LearnerProfile
   ?
   Unified Learner Model

2. evidence model

3. mastery engine

4. review scheduler

5. adaptive planner / Next Best Action

6. convert Lesson 1 into data

7. build generic Lesson Engine

8. rewrite Lesson 1

9. validate Lesson 1 as the reference lesson

10. only then create Lesson 2+

---

# ENGINEERING RULE

Work incrementally.

Protect:
- existing V2 behavior
- UTF-8 Vietnamese content
- current persistence
- session budgeting
- recommendation/intervention logic
- local-first evaluator architecture

Avoid:
- duplicated state
- duplicated services
- speculative abstractions
- mass content generation before the engine is validated

---

# PRODUCT QUALITY RULE

Every meaningful new lesson/feature should answer:

1. What learner problem does it solve?
2. Which competency does it target?
3. What evidence proves it worked?
4. What happens for a weak learner?
5. What happens for a strong learner?
6. How does it fit the learner model?
7. How does it affect the next best action?
8. How does it behave under different session budgets?
9. How will retention/transfer eventually be measured?

If those questions cannot be answered, do not blindly implement.

---

# FINAL INSTRUCTION

Do not treat this project as:
"add more screens and lessons."

Treat it as:
"build an evidence-backed adaptive learning system whose UI feels like a real mountain expedition."

Start by inspecting the actual repository and validating the current state.

Then implement ONLY the first domain-contract step described above.
