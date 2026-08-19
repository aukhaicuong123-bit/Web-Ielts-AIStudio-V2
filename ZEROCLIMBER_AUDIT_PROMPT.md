You are the senior engineer taking over the existing project:

AI IELTS Optimizer V2

IMPORTANT:
- Read PROJECT_HANDOFF.md first.
- Treat the actual repository code as the current source of truth.
- The handoff may be stale. Current Git state and source code override outdated handoff claims.
- DO NOT MODIFY SOURCE CODE during this audit.
- DO NOT install dependencies.
- DO NOT rewrite or refactor anything.
- DO NOT commit anything.

Current known Git state:
- Branch: main
- HEAD: 9dda116
- Working tree currently contains intentional uncommitted changes in:
  - src/App.tsx
  - src/features/today/TodayView.tsx
  - PROJECT_HANDOFF.md

Known recent commits:
- 9dda116 Fix recommendation pathway resolution
- 3084e3a Propagate session budget into intervention
- a7c47e4 Fix session duration display
- f8e6fa4 Fix adaptive session time budgeting
- 2e6f6b0 fix: configure production server port

Build currently passes.

Your task is ONLY to perform a deep architectural audit.

Inspect the actual repository and produce:

# 1. Executive Summary
What is working, what is fragile, and whether the architecture is safe to continue building on.

# 2. Current Architecture
Identify:
- frontend architecture
- routing
- state management
- profile model
- recommendation engine
- session-budget engine
- pathway engine
- AI service
- verification/retest flow
- persistence
- backend/server
- deployment-related code

# 3. Actual Data Flow
Trace real code paths for:
- learner profile initialization
- learner profile update
- session duration selection
- TodayView
- NextBestAction
- pathway selection
- intervention
- Re-Test
- profile update after Re-Test

Use actual files/functions, not assumptions.

# 4. Source-of-Truth Map
Determine the actual source of truth for:
- learner profile
- preferred session minutes
- selected session minutes
- pathway duration
- available minutes
- estimated minutes
- effective minutes
- active errors
- mastery
- current recommendation
- current pathway
- Re-Test state

Explicitly identify duplicated or conflicting concepts.

# 5. Root Causes
Identify architectural root causes instead of only listing symptoms.

# 6. Bug Clusters
Group related bugs such as:
- session duration
- learner state
- recommendation/pathway
- explainability
- Re-Test persistence
- environment synchronization

# 7. Severity
Classify every important finding as:
- P0 Critical
- P1 High
- P2 Medium
- P3 Low

# 8. File Hotspots
List important files and explain why they are risky/high-impact.

Relevant known files include:
- src/components/DailyOptimizer.tsx
- src/components/DiagnosticFlow.tsx
- src/components/DiagnosticResultsView.tsx
- src/components/ReadingModule.tsx
- src/components/learning/MicroSessionBreakdown.tsx
- src/features/today/TodayView.tsx
- src/engine/recommendation/prioritizationEngine.ts
- src/engine/errors/errorMemory.ts
- src/engine/errors/errorRepository.ts
- src/engine/verification/retestVerification.ts
- src/services/ai/aiService.ts
- src/data/pathways.ts
- src/types/learning.ts
- server.ts
- package.json

# 9. Recommendation Engine Assessment
Determine whether the actual implementation is:
- deterministic heuristic
- AI-driven
- hybrid

Trace the real logic.

Check whether explanations accurately correspond to the actual decision.

Explicitly identify any Explainability Drift.

# 10. Session Engine Assessment
Trace:
user-selected session budget
→ DailyOptimizer
→ TodayView
→ NextBestAction
→ pathway/intervention
→ MicroPathwayView
→ Re-Test

Determine whether the user's selected session budget is truly the canonical total-duration source of truth.

# 11. Re-Test Assessment
Verify:
- whether Re-Test actually runs
- whether scores persist
- whether before/after comparison is real
- whether mastery updates are real
- whether learner profile changes
- whether verification can silently fail
- whether the user can bypass verification

Do not accept product comments as proof. Verify code paths.

# 12. State Consistency Analysis
Explain why local/GitHub/AI Studio/production may show different learner states.

Separate:
- deterministic code behavior
- mock/demo data
- localStorage/browser state
- initialization defaults
- persisted profile
- environment differences
- deployment synchronization

# 13. Testing Gaps
Identify the minimum automated/regression tests needed.

# 14. Deployment/Environment Analysis
Inspect how:
local → GitHub → AI Studio → Cloud Run → public URL
actually works in this repository.

Do not assume these environments are synchronized.

# 15. Refactor Roadmap
Create:
- immediate fixes
- safe refactors
- later refactors

Avoid rewrite proposals.

# 16. Do-Not-Touch List
List areas that should not be changed during the next phase unless necessary.

# 17. Immediate Next 5 Actions
Give the exact 5 highest-value actions in order.

IMPORTANT:
At the end, explicitly answer:

## Is the current V2 architecture safe enough to add ZeroClimber V0.1?

Choose one:
- YES
- YES, WITH SPECIFIC FIXES FIRST
- NO

Explain why.

Do not change any files.
