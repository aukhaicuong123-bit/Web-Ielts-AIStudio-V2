\# AI IELTS Optimizer V2 — Project Handoff



\## 1. Project Overview



AI IELTS Optimizer V2 is a personalized IELTS learning web application.



Core product idea:



\* Analyze learner profile and recent errors.

\* Identify the highest-ROI learning bottleneck.

\* Recommend a specific learning pathway.

\* Allocate a user-selected study-session budget.

\* Guide the learner through a closed-loop intervention.

\* Verify progress through a Re-Test.

\* Update learner state after verification.



Target experience:



```text

Learner State

→ Error Detection

→ Prioritization

→ Next Best Action

→ Learning Pathway

→ Session Budget

→ Step Execution

→ Re-Test

→ Verification

→ Learner State Update

```



The project currently contains a mixture of deterministic heuristics, mock/demo data, React UI logic, local learner state, and AI-related services.



A major objective of the next phase is to determine whether the architecture is robust enough for further product development or whether a deeper refactor is required.



\---



\# 2. Current Repository



GitHub repository:



https://github.com/aukhaicuong123-bit/Web-Ielts-AIStudio-V2



Main branch:



```text

main

```



Recent commits:



```text

f8e6fa4  Fix adaptive session time budgeting

a7c47e4  Fix session duration display

```



Latest known commit:



```text

a7c47e4

```



The repository is connected locally as:



```text

origin

```



\---



\# 3. Local Development Environment



Project path used during development:



```text

C:\\Users\\Kaiseazz\\Desktop\\landaulaptrinhpython\\Web-Ielts-AIStudio-V2

```



Technology currently observed:



\* React

\* TypeScript

\* Vite

\* Node.js

\* Express/server.ts

\* esbuild

\* Tailwind-style utility classes

\* Lucide icons



Package scripts include:



```text

npm run build

npm start

```



Development environment was successfully built and run locally.



TypeScript check:



```text

npx tsc --noEmit

```



Production build:



```text

npm run build

```



Both were passing after the latest changes.



\---



\# 4. Current Production Deployment



Current production URL:



https://ai-ielts-study-optimizer.ai.studio/



Google Cloud information discovered during investigation:



```text

Project:

smooth-yew-qq6d2



Cloud Run service:

ai-ielts-study-optimizer



Region:

asia-southeast1



Deployment type:

Source



Cloud Run URL:

https://ai-ielts-study-optimizer.ai.studio



Deployed from:

AI Studio

```



The production service is managed through AI Studio.



Important observation:



GitHub push does NOT automatically mean the AI Studio workspace is updated.



AI Studio and the GitHub repository can contain different states.



The AI Studio GitHub Sync screen previously showed:



```text

Repository:

aukhaicuong123-bit/Web-Ielts-AIStudio-V2



Branch:

main



15 changed files

```



Therefore synchronization between:



```text

local

GitHub

AI Studio workspace

published production revision

```



must be treated as a separate concern.



\---



\# 5. Important Deployment Finding



AI Studio publishing eventually worked.



Before the latest successful publish, the application repeatedly showed:



```text

There are unpublished changes.

Click republish to update the app.

```



The successful publish timestamps observed included:



```text

Aug 18, 2026, 4:37:23 PM

Aug 18, 2026, 4:47:58 PM

```



After Republish, the public application reflected the latest duration-display fix.



Do not assume:



```text

git push

```



automatically updates the AI Studio workspace.



\---



\# 6. Major Bug Recently Fixed — Session Budget



One of the main bugs discovered was inconsistent session duration.



User can select:



```text

15 minutes

20 minutes

30 minutes

```



The selected value is represented by:



```ts

profile.preferredSessionMinutes

```



Previously, pathway duration and session duration were mixed.



Examples of problems observed:



```text

Selected 30 minutes

Mission = 30

Pathway displayed 30

But 4 steps became:

8 + 8 + 8 + 8 = 32

```



This was caused by:



```ts

Math.round(effectiveMinutes / pathway.steps.length)

```



The fix implemented in:



```text

src/components/learning/MicroSessionBreakdown.tsx

```



uses:



```ts

const baseStepMinutes = Math.floor(

&#x20; effectiveMinutes / pathway.steps.length

);



const remainderMinutes =

&#x20; effectiveMinutes % pathway.steps.length;



const stepMinutes =

&#x20; baseStepMinutes + (idx < remainderMinutes ? 1 : 0);

```



Expected behavior:



```text

15 → 4 + 4 + 4 + 3 = 15

20 → 5 + 5 + 5 + 5 = 20

30 → 8 + 8 + 7 + 7 = 30

```



This invariant is important:



```text

sum(step durations) === selected session budget

```



\---



\# 7. Session Budget Architecture Fix



Relevant files:



```text

src/components/learning/MicroSessionBreakdown.tsx

src/engine/recommendation/prioritizationEngine.ts

src/features/today/TodayView.tsx

```



The recommendation layer was adjusted so that recommended session duration uses the user-selected available minutes instead of always relying on pathway duration.



Conceptually:



```text

availableMinutes

→ estimatedMinutes

```



instead of using only:



```text

matchedPathway.durationMinutes

```



The explainability copy was also changed so the text references the selected budget.



Example intended explanation:



```text

Phiên học được phân bổ theo ngân sách {availableMinutes} phút bạn đã chọn, bao gồm cả bước Re-Test đối chứng

```



\---



\# 8. UI Duration Display Fix



A separate bug was found in:



```text

src/components/DailyOptimizer.tsx

```



The header and hero description contained hard-coded duration values.



Old examples:



```text

30 Phút Tối Ưu Hôm Nay

```



and:



```text

Hoàn thành 1 chu kỳ can thiệp ngắn 20 phút rồi kiểm chứng ngay qua Re-test.

```



They were changed to use:



```ts

profile.preferredSessionMinutes

```



Specifically:



```tsx

<Zap className="w-3.5 h-3.5" />

{profile.preferredSessionMinutes} Phút Tối Ưu Hôm Nay

```



and:



```tsx

Hoàn thành 1 chu kỳ can thiệp ngắn {profile.preferredSessionMinutes} phút rồi kiểm chứng ngay qua Re-test.

```



This was committed as:



```text

a7c47e4 Fix session duration display

```



and pushed to GitHub.



\---



\# 9. Production Validation Already Performed



Public production was tested after deployment.



Confirmed:



\### 30-minute case



```text

Header:

30 phút



Today's Mission:

30 phút



Next Best Action:

30 phút



Total:

30 phút



Steps:

8 + 8 + 7 + 7 = 30

```



\### 20-minute case



```text

Header:

20 phút



Today's Mission:

20 phút



Next Best Action:

20 phút



Total:

20 phút



Steps:

5 + 5 + 5 + 5 = 20

```



Explainability correctly referenced the selected budget.



The 20-minute case was explicitly validated on production.



15-minute production validation remains a useful regression test.



\---



\# 10. Important Remaining Architectural Concern — Source of Truth



There are multiple concepts that may overlap:



```text

profile.preferredSessionMinutes

pathway.durationMinutes

availableMinutes

estimatedMinutes

effectiveMinutes

```



A major next task is to determine whether these represent genuinely different concepts or whether the architecture accidentally duplicates the same concept.



The desired canonical rule is:



```text

User-selected session budget

=

single source of truth for total session duration

```



while pathway duration should represent pathway-specific characteristics rather than override the user's selected session budget.



Do not assume this is already fully solved.



Audit all usages before further refactoring.



\---



\# 11. Remaining Architectural Concern — Learner State



Different environments have shown different learner states.



Examples observed at different times:



```text

Band 6.0

Reading

Paraphrase \& Keyword Matching

```



versus:



```text

Band 6.5

Writing Task 2

Coherence \& Cohesion Flow

```



This does not necessarily mean the recommendation engine is incorrect.



It may indicate differences in:



\* mock data

\* learner profile initialization

\* local persisted state

\* AI Studio state

\* production state

\* browser storage

\* fallback profile

\* environment-specific data



This must be investigated systematically.



Do not assume the different states are caused by the same bug as session duration.



\---



\# 12. Recommendation Engine



Important file:



```text

src/engine/recommendation/prioritizationEngine.ts

```



The system claims to perform:



```text

Next Best Action

high-ROI intervention

prioritization

cross-skill impact

```



But this must be audited carefully.



Determine whether the actual implementation is:



```text

AI optimization

```



or:



```text

deterministic heuristic / rule-based recommendation

```



or:



```text

hybrid

```



Do not market it as sophisticated optimization if the underlying implementation is mostly rule-based.



Relevant concepts include:



\* weakest skill

\* mastery

\* repetition

\* recency

\* cross-skill impact

\* band threshold

\* ROI

\* pathway selection

\* intervention duration



\---



\# 13. Algorithm Explainability



The product exposes explanations such as:



```text

Phát hiện lặp lại

Kỹ năng nền tảng có tác động chéo lớn nhất

Độ thuần thục hiện tại dưới ngưỡng an toàn

Phiên học được phân bổ theo ngân sách

Biên bản Re-Test gần nhất

```



Audit whether every explanation is actually backed by the current algorithm.



Important concept:



```text

Actual decision

vs

Displayed explanation

```



If these diverge, classify as:



```text

Explainability Drift

```



\---



\# 14. Re-Test / Verification



The product intends to use a closed loop:



```text

Before

→ Intervention

→ After / Re-Test

→ Before vs After comparison

→ Profile update

```



The Re-Test is described as:



```text

2 questions

approximately 5 minutes

```



The product claims that the system will:



\* compare Before vs After

\* validate improvement

\* update the learner profile



These claims must be verified in code.



Audit whether:



\* Re-Test really runs

\* scores are persisted

\* comparison is mathematically correct

\* mastery updates are real

\* profile state changes

\* improvement claims have evidence

\* the Re-Test can be skipped

\* verification can fail silently



\---



\# 15. Current Pathway Examples



Pathway 1:



```text

Precision Paraphrasing \& Distortion Traps

```



Example weakness:



```text

Paraphrase \& Keyword Matching

```



Example error:



```text

Bẫy paraphrase bóp méo nghĩa gốc (Distortion Trap)

```



Pathway 2:



```text

Cause-Effect Logic \& Logical Bridge Construction

```



Example weakness:



```text

Coherence \& Cohesion Flow

```



Example error:



```text

Luận điểm nhảy cóc thiếu cơ chế giải thích (Logical Gap)

```



These are product-facing examples and should be distinguished from the underlying recommendation logic.



\---



\# 16. Known Relevant Files



Important files already identified:



```text

src/components/DailyOptimizer.tsx



src/components/DiagnosticFlow.tsx



src/components/DiagnosticResultsView.tsx



src/components/ReadingModule.tsx



src/components/learning/MicroSessionBreakdown.tsx



src/features/today/TodayView.tsx



src/engine/recommendation/prioritizationEngine.ts



src/engine/errors/errorMemory.ts



src/engine/errors/errorRepository.ts



src/engine/verification/retestVerification.ts



src/services/ai/aiService.ts



src/data/pathways.ts



src/types/learning.ts



server.ts



package.json

```



These files are likely architecture hotspots, but the audit must verify actual dependency relationships.



\---



\# 17. Current Known Git State



Latest known commits:



```text

f8e6fa4 Fix adaptive session time budgeting

a7c47e4 Fix session duration display

```



Latest commit:



```text

a7c47e4

```



The latest change was committed and pushed.



At the time of this handoff, the working tree had previously been clean after the DailyOptimizer commit, but this should be rechecked before any further development.



\---



\# 18. Current Local Validation



Latest known validation:



```text

npx tsc --noEmit

PASS



npm run build

PASS

```



Build warning:



```text

Some chunks are larger than 500 kB after minification.

```



This is currently treated as a non-blocking optimization warning.



\---



\# 19. Deployment / Environment Model



Known environments:



```text

Local development

↓

GitHub

↓

AI Studio workspace

↓

AI Studio Publish

↓

Cloud Run service

↓

Public ai.studio URL

```



Important:



GitHub and AI Studio workspace are not guaranteed to stay synchronized automatically.



AI Studio previously showed:



```text

15 changed files

```



under GitHub Sync.



Therefore:



```text

GitHub =/= AI Studio workspace

```



without explicit synchronization.



Do not blindly use:



```text

Stage and commit all changes

```



from AI Studio because it may push a larger unrelated set of workspace changes into GitHub.



\---



\# 20. Current Product State



What is currently working:



\* Daily session duration selection exists.

\* 15 / 20 / 30 minute budgets exist.

\* Total duration can correctly match selected budget.

\* Step allocation now sums exactly to the selected budget.

\* Recommendation duration can follow the selected session budget.

\* Public production has successfully received the duration fix.

\* Dynamic duration is now used in the DailyOptimizer header and hero text.

\* TypeScript and production build pass.



What is not yet considered fully solved:



\* Single source of truth for duration semantics.

\* Full learner-state consistency across environments.

\* Full recommendation-engine audit.

\* Re-Test verification audit.

\* Whether all explainability statements accurately describe live decisions.

\* Whether mock/demo data is mixed with production-like learner state.

\* Deployment synchronization between GitHub and AI Studio.

\* Full automated regression test coverage.



\---



\# 21. What NOT To Do Yet



Do not:



\* rewrite the whole project

\* introduce a database without proving it is needed

\* replace the recommendation engine

\* migrate frameworks

\* introduce new dependencies just for code style

\* redesign the UI

\* optimize bundle splitting

\* change Cloud Run architecture

\* create a second production deployment

\* delete the current Cloud Run service

\* blindly commit AI Studio's entire 15-file workspace diff



First complete architectural audit.



\---



\# 22. Next Audit Objective



The next engineer/AI should perform a deep architectural audit before making more code changes.



Primary questions:



1\. What is the actual source of truth for each important learner/session concept?

2\. Why can local, GitHub, AI Studio, and production show different state?

3\. Which bugs are symptoms of the same root architectural problem?

4\. Is the recommendation engine truly optimized or primarily heuristic?

5\. Is the Re-Test loop actually closed and persistent?

6\. Which values are hard-coded incorrectly?

7\. Which components contain business logic that belongs in engine/domain layers?

8\. Which state is duplicated?

9\. What minimum refactor makes the system reliable without rewriting everything?

10\. What automated tests are required to prevent regressions?



\---



\# 23. Audit Deliverable Required



The next auditor should produce:



\## Executive Summary



\## Current Architecture



\## Actual Data Flow



\## Source-of-Truth Map



\## Root Causes



\## Bug Clusters



\## P0 / P1 / P2 / P3 Findings



\## File Hotspots



\## State Consistency Analysis



\## Recommendation Engine Assessment



\## Session Engine Assessment



\## Re-Test Assessment



\## Testing Gaps



\## Deployment / Environment Analysis



\## Refactor Roadmap



\## Do-Not-Touch List



\## Immediate Next 5 Actions



The first audit response must NOT modify source code.



The goal is not to patch individual bugs.



The goal is to determine whether the current architecture is safe to continue building on.



