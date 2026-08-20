# AI IELTS Optimizer V2 + ZeroClimber
# PRODUCT PRINCIPLES

## 1. One Mountain, One Learning System

ZeroClimber is NOT a permanent mode.

The product is one continuous learning expedition:

ZERO
→ BASE CAMP
→ FUNCTIONAL ENGLISH
→ STRUCTURED COMMUNICATION
→ IELTS READINESS
→ IELTS PERFORMANCE
→ SUMMIT

A learner can start at different elevations based on evidence.

---

## 2. Learning Outcome > Lesson Completion

Completing a lesson does not prove learning.

The system must distinguish:

- exposure
- recognition
- controlled performance
- independent production
- transfer
- retention

"Lesson completed" is engagement metadata, not mastery evidence.

---

## 3. Competency > Topic

Curriculum should be built around competencies and dependencies.

Topics such as:
- self-introduction
- family
- hobbies
- daily routine

are contexts.

They are not the core curriculum architecture.

The core architecture is a competency graph.

---

## 4. Retention > Immediate Score

A high post-test score is not enough.

A lesson must eventually be judged by:

- immediate learning
- delayed retention
- novel-context transfer
- IELTS-like transfer

Prefer real retained learning over impressive immediate scores.

---

## 5. Transfer > Recognition

Multiple-choice recognition is useful but insufficient.

The system must gradually move the learner from:

recognize
→ recall
→ construct
→ produce
→ transfer

A learner who can recognize the correct answer but cannot use the skill independently is not considered fully competent.

---

## 6. AI Is an Adaptive Layer, Not the Entire Teacher

Use deterministic evaluation whenever the answer can be safely classified locally.

Use AI for:

- ambiguous input
- open-ended production
- nuanced explanations
- transfer tasks
- adaptive coaching

Do NOT send every interaction to AI.

This protects:
- latency
- cost
- reliability
- determinism

---

## 7. Personalization Must Be Evidence-Driven

The system should decide what the learner does next using:

- mastery
- error patterns
- retention
- transfer
- prerequisites
- learner goal
- available session time

Do not personalize based only on:
- completed lessons
- streak
- arbitrary lesson order

---

## 8. Session ≠ Lesson

A lesson is a learning intervention definition.

A session is a time budget.

A learner with 10 minutes and a learner with 30 minutes should be able to receive different activity sequences from the same underlying lesson definition.

---

## 9. Mountain UI Represents Learning State

The mountain is not decoration.

Examples:

- trail = learning route
- camp = development stage
- checkpoint = mastery/evidence verification
- detour = remediation
- rest camp = retrieval/consolidation
- fog = uncertainty
- storm = persistent blocker
- ridge = higher challenge
- summit = target achievement

The UI should visualize learning state but should not become the source of truth.

---

## 10. Universal, Mature UX

The product must work for:
- teenagers
- university students
- adults

The visual direction should feel like:

Modern Alpine Expedition

not:

Cartoon Mountain Game

Avoid:
- excessive gems
- XP spam
- childish mascots
- confetti after every task
- leaderboard pressure
- noisy gamification

Use:
- strong readability
- calm typography
- topographic/map inspiration
- subtle animation
- accessible controls
- reduced motion support

---

## 11. Adaptive Difficulty Should Be Evidence-Based

The same lesson may have:
- a foundation route
- a standard route
- a challenge route

Use pre-checks and learner evidence.

Strong learners should not be forced through obvious material.

Weak learners should receive remediation and scaffolding.

---

## 12. AI Feedback Must Respect Learner Level

Feedback should adapt to learner ability.

A beginner should receive:
- short
- concrete
- immediately usable feedback

A more advanced learner can receive:
- nuanced grammar
- coherence
- lexical flexibility
- discourse-level feedback

Never give the same feedback depth to all learners.

---

## 13. Avoid Big-Bang Rewrites

The existing V2 already contains valuable systems:

- learner profile
- mastery prototype
- error memory
- recommendation
- intervention
- session budgeting
- re-test
- verification

Preserve these while migrating incrementally toward the unified learning engine.

Use compatibility layers/projections when necessary.

---

## 14. Do Not Duplicate Sources of Truth

Avoid parallel systems such as:

LearnerProfile
+
ZeroClimberProfile
+
IELTSProfile
+
another learner state

Instead build toward:

One Unified Learner Model

with projections for legacy components during migration.

---

## 15. Protect Vietnamese UTF-8

The project contains Vietnamese UI/content.

Do not use risky full-file PowerShell rewrites that can corrupt UTF-8.

Prefer:
- Node scripts
- safe UTF-8 editor operations

Validate multilingual content after changes.

---

## 16. Build the Learning Engine Before Mass-Producing Lessons

Do NOT immediately create Lesson 2, Lesson 3, Lesson 4...

First establish:

- competency graph
- mastery model
- evidence model
- lesson contract
- evaluator architecture
- review system
- adaptive planner

Then build lessons on top of that engine.

---

## 17. Measure Whether Lessons Actually Work

For every important lesson, eventually measure:

Pre
→ Post
→ 24h
→ 7d
→ Transfer

A lesson is not successful merely because:
- completion is high
- the UI looks good
- AI feedback is impressive
- immediate scores are high

The goal is retained, transferable learning.

---

## 18. Product North Star

Target long-term metric:

Verified Learning Progress

Operational idea:

Retained and transferred competencies gained per learner per week.

Do not optimize the product only for:
- DAU
- streak
- study minutes
- lessons completed

---

## 19. Product Moat

The durable advantage should come from:

- competency graph
- error taxonomy
- learner model
- exercise bank
- mastery model
- evidence history
- transfer data
- longitudinal learning data

Not simply from "having AI".

---

## 20. Engineering Rule

Before writing code, answer:

1. What learner problem does this solve?
2. Which competency does it affect?
3. What evidence will prove it worked?
4. How does it fit the unified learner model?
5. Does it improve the learning expedition?
6. Does it create a duplicate source of truth?

If these are unclear, do not implement yet.
