# AI IELTS Optimizer V2 + ZeroClimber
# GOLDEN WORKFLOWS

## Purpose

These workflows are the product-level acceptance criteria.

Future refactors, lesson-engine changes, learner-model changes, and UI changes should preserve these behaviors unless the product architecture intentionally changes them.

---

# WORKFLOW 1 - New Learner From Near-Zero

## Goal

A learner with almost no usable English foundation should be able to enter the product without knowing what to study.

## Expected flow

1. Open app
2. Complete onboarding
3. State target IELTS goal
4. State approximate current ability
5. State available daily study time
6. System performs or requests enough diagnostic evidence
7. System identifies foundation gaps
8. Learner is placed at the appropriate mountain elevation
9. First Today's Climb is generated
10. Learner starts the first foundation intervention

## Expected product behavior

The learner should NOT have to choose:
- ZeroClimber mode
- IELTS mode
- a random course
- a random lesson

The system chooses the initial route from evidence.

## Acceptance criteria

- learner sees one mountain
- starting point is explained
- first task has a clear reason
- session respects learner time budget
- learner does not need prior IELTS knowledge

---

# WORKFLOW 2 - Stronger Learner Does Not Waste Time

## Goal

A learner who already knows basic material should not be forced through beginner exercises.

## Expected flow

1. Learner enters a lesson
2. Micro pre-check is performed
3. Evidence shows strong performance
4. Basic recognition/controlled activities are compressed or skipped
5. Learner moves to independent production and transfer
6. System records evidence

## Acceptance criteria

- no unnecessary repetition
- learner can reach a harder task quickly
- progression is evidence-driven
- completion does not require every screen

---

# WORKFLOW 3 - Persistent Error Creates a Detour

## Goal

Repeated errors should change the learner's route.

## Example

Learner repeatedly writes:

"I student."
"I student."
"I student."

## Expected flow

1. Error detected
2. Error classified
3. Error frequency increases
4. System identifies persistent blocker
5. Next Best Action changes to remediation
6. Today's Climb explains why
7. Learner performs targeted remediation
8. Learner completes a transfer check
9. If successful, learner returns to main route

## Acceptance criteria

- persistent errors influence planning
- remediation is specific
- learner does not feel labelled as a failure
- detour is temporary
- route can rejoin main trail

---

# WORKFLOW 4 - Local-First Beginner Evaluation

## Goal

Simple beginner responses should receive immediate feedback.

## Expected flow

1. Learner submits simple grammar answer
2. Local deterministic evaluator runs first
3. If confidently classified:
   - no network call
   - immediate feedback
4. If uncertain:
   - AI fallback
5. Result is stored as evidence

## Acceptance criteria

- deterministic cases do not require Gemini
- AI remains fallback for ambiguity
- latency is low for simple tasks
- no regression to all-request-to-AI behavior

---

# WORKFLOW 5 - Free Production With AI Fallback

## Goal

Open-ended production should be evaluated appropriately.

## Example

Learner writes:
"My name is Linh. I am a student. I am from Vietnam."

## Expected flow

1. local evaluator checks deterministic beginner patterns
2. if result is confidently determined ? local feedback
3. otherwise ? AI evaluator
4. feedback includes:
   - correctness
   - better version
   - explanation
   - actionable next step
5. evidence is attached to relevant competencies

## Acceptance criteria

AI should not be called merely because the task is called "AI Feedback".

---

# WORKFLOW 6 - Lesson Completion Does Not Equal Mastery

## Goal

The learner may finish a lesson without mastering every competency.

## Example

Learner completes Lesson 1.

Evidence:
- controlled = 90
- independent = 78
- transfer = 42
- retention = unknown

## Expected result

Lesson:
COMPLETED

Competency:
NOT MASTERED

System schedules:
- remediation or transfer review
- delayed retrieval

## Acceptance criteria

- lesson completion and mastery are separate states
- route progression uses mastery/evidence rather than only completion

---

# WORKFLOW 7 - Delayed Retention

## Goal

The system tests whether learning survives after time has passed.

## Expected flow

1. Lesson completed
2. Immediate evidence recorded
3. Review scheduled
4. Learner returns later
5. System gives retrieval task without full re-teaching
6. Result updates retention estimate
7. Weak retention increases review priority

## Acceptance criteria

- review is scheduled automatically
- delayed review is not just "read the lesson again"
- retrieval performance matters
- retention influences future planning

---

# WORKFLOW 8 - Transfer To New Context

## Goal

The system must test generalization rather than memorization.

## Example

Lesson teaches:
"I am a student."
"My name is Minh."

Transfer:
"Introduce your friend."

Expected learner output:
"She is a student."
"Her name is Lan."

## Acceptance criteria

- task uses a novel context
- exact memorized template is insufficient
- transfer evidence is stored separately
- failure can trigger remediation

---

# WORKFLOW 9 - 10-Minute Session

## Goal

A short session must still create useful learning.

## Expected flow

Example budget:

10 minutes

Possible route:
- short retrieval
- core remediation
- one production task
- checkpoint

## Acceptance criteria

- session ends coherently
- the learner is not forced into an unfinished multi-step flow
- evidence from completed activities is preserved
- next session can continue intelligently

---

# WORKFLOW 10 - 20-Minute Session

## Goal

This is the normal target session.

Possible route:
- retrieval
- new learning
- controlled practice
- production
- transfer

## Acceptance criteria

- session uses approximately the selected budget
- activities are selected based on learner state
- session is not simply a fixed 20-minute script

---

# WORKFLOW 11 - 30-Minute Session

## Goal

A longer session should deepen rather than merely repeat.

Possible route:
- retrieval
- remediation
- new concept
- controlled practice
- production
- transfer
- mastery review

## Acceptance criteria

Extra time should increase learning depth, not filler.

---

# WORKFLOW 12 - Base Camp Progression

## Goal

A learner progresses based on demonstrated foundation readiness.

## Expected flow

1. Learner completes multiple foundation interventions
2. Evidence accumulates
3. Competency mastery rises
4. Retention and transfer become sufficient
5. Base Camp readiness threshold is reached
6. Functional English terrain opens

## Acceptance criteria

Progression must not depend solely on:
- number of lessons
- streak
- XP

---

# WORKFLOW 13 - Foundation Gap During IELTS Training

## Goal

A learner already practicing IELTS can still receive foundation intervention.

## Example

Learner has reasonable IELTS Reading but repeatedly makes:
- article errors
- subject-verb agreement errors
- sentence-structure errors

## Expected flow

1. IELTS task exposes recurring foundation weakness
2. Error is linked to foundation competency
3. Planner recommends foundation detour
4. Learner performs short remediation
5. Transfer check
6. Learner returns to IELTS terrain

## Acceptance criteria

There is no permanent mode switch.

---

# WORKFLOW 14 - Today's Climb Explanation

## Goal

The learner understands why the system chose today's work.

Example:

TODAY'S CLIMB

20 minutes

Strengthen:
Giving Reasons

Why today?
You struggled with connecting ideas in 3 recent attempts.

## Acceptance criteria

The explanation must be:
- short
- concrete
- evidence-based
- actionable

---

# WORKFLOW 15 - Universal Mountain UX

## Goal

The product must work for teenagers and adults.

## Expected visual language

Modern Alpine Expedition.

Should feel:
- mature
- clear
- calm
- motivating
- readable

Avoid:
- childish cartoon dependency
- noisy gamification
- excessive XP/gems
- forced social competition

## Acceptance criteria

The mountain metaphor should aid orientation and motivation without replacing real learning information.

---

# WORKFLOW 16 - One Mountain

## Goal

There is one continuous journey.

Expected:

ZERO
? BASE CAMP
? FUNCTIONAL ENGLISH
? STRUCTURED COMMUNICATION
? IELTS READINESS
? IELTS PERFORMANCE
? SUMMIT

## Acceptance criteria

Do NOT introduce a permanent:
"ZeroClimber mode"

Do NOT introduce a separate:
"IELTS app inside the app"

They share the same learner model and competency graph.

---

# WORKFLOW 17 - AI Failure

## Goal

AI service failure must not destroy the learning experience.

If AI returns:
- 503
- timeout
- malformed response
- quota error

Expected behavior:
1. local evaluator handles deterministic cases when possible
2. safe fallback is shown
3. learner can continue
4. evidence is still recorded where confidence allows
5. app does not freeze indefinitely

## Acceptance criteria

AI is an enhancement, not a single point of failure for the whole lesson.

---

# WORKFLOW 18 - Persistence

## Goal

Learner progress survives reload/restart.

After:
- lesson completion
- mastery update
- error update
- session completion
- review scheduling

reload app.

Expected:
- learner state remains
- route remains correct
- progress remains
- scheduled work remains

---

# WORKFLOW 19 - Existing V2 Compatibility

## Goal

New learning architecture must not break existing V2 functionality.

Current V2 features to preserve:
- diagnostic
- Today
- intervention
- session budget
- recommendation
- re-test
- verification
- learner profile

Migration should be incremental.

## Acceptance criteria

A new engine layer should not require removing working V2 behavior before the replacement is validated.

---

# WORKFLOW 20 - Lesson Health Evaluation

## Goal

The team can determine whether a lesson actually teaches effectively.

For an important lesson, collect:

Pre
? Immediate Post
? 24h
? 7d
? Transfer

Also track:
- completion
- drop-off
- retries
- hint use
- AI usage
- common errors

## Acceptance criteria

The team can eventually answer:

"Did this lesson actually improve retained and transferable ability?"

not merely:

"Did people finish it?"

---

# WORKFLOW 21 - Product Development Rule

Before implementing a new lesson/feature, ask:

1. What learner problem does it solve?
2. Which competency does it target?
3. What evidence will show success?
4. How does it fit the competency graph?
5. How does it affect mastery?
6. How does it affect route selection?
7. How does it behave under 10/20/30 minute budgets?
8. What happens when the learner is much stronger?
9. What happens when the learner is much weaker?
10. Can the feature fail safely?

If these answers are unclear, do not implement blindly.

---

# GOLDEN PRINCIPLE

The product is successful when:

the learner does not merely complete more lessons,

but demonstrably:
- knows more,
- can produce more,
- retains more,
- transfers more,
- and gets closer to the target IELTS outcome.
