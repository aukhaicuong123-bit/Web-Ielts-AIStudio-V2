# AI IELTS Optimizer V2 + ZeroClimber
# CURRENT STATE - 2026-08-19

## Git Baseline

Current branch:
main

Current commit:
8b74d9e feat: integrate ZeroClimber V0.1

Working tree:
clean at handoff

---

## VERIFIED WORKING

### Core app
- React/TypeScript app starts with `npm run dev`
- Server runs on port 3000
- Current V2 navigation works
- Learner profile persistence works through ProfileService
- Existing intervention/session/re-test flow is present

### ZeroClimber
- ZeroClimber onboarding exists
- Starting level / target band / daily time are captured
- ZeroClimber overview / Your Climb exists
- Camp progression exists
- Lesson 1 exists
- Lesson 1 persistence works
- Daily climb/streak state exists
- ZeroClimber routes are integrated into App routing

### Evaluation
- Local deterministic evaluator exists
- Local evaluator executes BEFORE remote AI evaluation
- AI is only used when deterministic evaluation cannot confidently classify the response
- AI fallback exists
- This was added specifically to reduce beginner-task latency and avoid unnecessary Gemini calls

### Validation
- `npx tsc --noEmit` passed with 0 errors at the final checkpoint
- Production build compiled successfully during the V0.1 validation
- Local runtime was tested at:
  `http://localhost:3000`

---

## CURRENT ZEROCLIMBER CURRICULUM STATUS

Lesson 1:
`Introduce Yourself`

Current content is intentionally simplified.

It demonstrates:
- basic `be`
- self-introduction patterns
- MCQ
- fill
- reorder
- basic free production
- deterministic beginner evaluation
- AI fallback

Current lesson should be treated as:
PROTOTYPE / VERTICAL SLICE

It is NOT production-ready curriculum.

Known issue:
The current curriculum is too simplified and is not yet sufficiently aligned with a serious zero-to-IELTS learning progression.

Do NOT mass-produce Lesson 2+ from the current Lesson 1 architecture.

---

## CURRENT ARCHITECTURAL STATUS

### Existing V2 primitives

Already present:
- LearnerProfile
- subskill mastery
- baseline mastery
- mastery records
- active errors
- error patterns
- recent activity
- re-test history
- recommendation logic
- pathway/intervention logic
- session budgeting
- verification logic
- local persistence

These are valuable foundations.

### What does NOT yet exist as a unified system

Not yet implemented as a coherent domain:
- Unified Learner Model
- Unified Competency Graph
- Evidence Engine
- Mastery Engine
- Retention Scheduler
- Transfer Measurement
- Unified Next Best Action abstraction
- Generic Lesson Engine
- Generic Activity Renderer
- Mountain state derived directly from learner evidence
- Learning Experiment / Lesson Health analytics

---

## CURRENT ZEROCLIMBER DATA MODEL

Current ZeroClimber state is nested in LearnerProfile.

Important current fields include:
- startingLevel
- targetBand
- dailyMinutes
- currentCampId
- currentLessonId
- currentLessonIndex
- totalClimbsCompleted
- dailyClimbs
- isDailyClimbCompletedToday
- lastClimbDate
- unlockedCampIds
- completedLessonIds
- climbStreakDays

Current progression uses lesson/camp completion concepts.

Long term this should migrate toward:
mastery/evidence-driven route readiness.

Do NOT remove the current data model abruptly.

---

## CURRENT PROFILE PERSISTENCE

Service:
`src/services/profile/profileService.ts`

Storage:
`ai_ielts_learner_profile_v2`

Legacy:
`ai_ielts_learner_profile_v1`

ProfileService currently:
- loads
- normalizes
- migrates
- saves
- resets learning evidence
- starts a new learner

Keep this as the persistence anchor during migration.

---

## CURRENT AI EVALUATION ARCHITECTURE

Current preferred pattern:

```text
Response
? Local deterministic evaluator
? if uncertain ? AI fallback
```

Do NOT replace this with:
```text
Every response ? Gemini
```

The current local-first architecture is a deliberate performance/cost/reliability decision.

---

## CURRENT KNOWN UX LIMITATIONS

- Mountain UI is currently a prototype, not final
- Current lesson flow still looks more like a conventional lesson than a real expedition
- Progress is not yet fully derived from competency mastery
- Adaptive routing is not yet fully unified between V2 and ZeroClimber
- Current learner-facing mastery visualization is still prototype-level
- Current gamification/progression logic is not yet the final evidence-based system
- Current lesson content does not yet demonstrate the eventual pedagogical depth

---

## CURRENT KNOWN CURRICULUM LIMITATIONS

- Topic sequence is not yet replaced by a full competency graph
- Base Camp competency map exists at design level but is not yet fully represented in code
- Mastery criteria are design heuristics, not calibrated from learner data
- Delayed retention checks are not yet implemented as a complete system
- Transfer measurement is not yet implemented as a complete system
- Lesson effectiveness analytics are not yet implemented
- IELTS bridge curriculum is not yet fully designed
- Zero-to-6.5 curriculum is not yet production-ready

---

## CURRENT PRODUCT DIRECTION

The intended long-term journey is:

ZERO
? BASE CAMP
? FUNCTIONAL ENGLISH
? STRUCTURED COMMUNICATION
? IELTS READINESS
? IELTS PERFORMANCE
? SUMMIT

The product should feel like:
Modern Alpine Expedition

The experience should work for:
- teenagers
- university students
- adults

Mountain should represent:
- route
- terrain
- progression
- evidence
- remediation
- mastery

Not merely decoration.

---

## NEXT VERIFIED DEVELOPMENT TARGET

Next code step should be:

Create:
`src/types/learningEngine.ts`

with domain contracts for:
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

Then validate:

```powershell
npx tsc --noEmit
npm run build
```

After that:
1. design LearnerProfile compatibility adapter
2. implement evidence model
3. implement mastery engine
4. implement review scheduler
5. implement adaptive planner
6. convert Lesson 1 into data
7. build generic Lesson Engine
8. rewrite Lesson 1
9. only then build Lesson 2+
