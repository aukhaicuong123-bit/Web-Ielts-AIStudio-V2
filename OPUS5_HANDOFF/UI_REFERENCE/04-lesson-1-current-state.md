# AI IELTS Optimizer V2 + ZeroClimber
# UI REFERENCE 04 - CURRENT LESSON 1

## Lesson

Base Camp - Lesson 1/5

Title:
Lesson 1: Introduce Yourself

Current lesson progress model:
20% ? 40% ? 60% ? 80% ? 100%

---

# PART 1 ? CORE PATTERNS

Title:
Ph?n 1: M?u c?u c? b?n

Content:
3 m?u c?u t? gi?i thi?u b?n th?n.

Pattern 1:
My name is [T?n c?a b?n].

Examples:
My name is Nam.
My name is Linh.

Rule:
Lu?n c? "is" sau "My name".
Kh?ng n?i:
"My name Nam."

Pattern 2:
I am a / an [Ngh? nghi?p / Vai tr?].

Examples:
I am a student.
I am a teacher.

Rule:
D?ng "I am a student".
Kh?ng n?i:
"I student."

Pattern 3:
I am from [Qu? h??ng / Qu?c gia].

Examples:
I am from Vietnam.
I am from Da Nang.

Rule:
"from" di?n t? xu?t ph?t t? ??u.
"I" ?i v?i "am".

---

# PART 2 ? MULTIPLE CHOICE

Title:
Ph?n 2: Ch?n c?u ??ng ng? ph?p

3 questions.

Question 1:
T?n t?i l? Minh.

Options:
My name is Minh.
My name Minh.
I name is Minh.

Question 2:
T?i l? m?t h?c sinh.

Options:
I student.
I am a student.
I is a student.

Question 3:
T?i ??n t? Vi?t Nam.

Options:
I from Vietnam.
I am from Vietnam.
I am come from Vietnam.

Purpose:
basic grammar recognition.

---

# PART 3 ? FILL IN THE BLANK

Title:
Ph?n 3: ?i?n t? c?n thi?u

3 questions.

Question 1:
My name ___ Ha.
Options:
is / am / are

Question 2:
I ___ a student.
Options:
is / am / are

Question 3:
I am ___ Vietnam.
Options:
from / in / at

Purpose:
basic controlled recall.

---

# PART 4 ? WORD ORDER

Title:
Ph?n 4: S?p x?p t? th?nh c?u

3 questions.

Question 1:
Meaning:
T?n t?i l? An.

Tokens:
name / is / My / An

Target:
My name is An.

Question 2:
Meaning:
T?i l? m?t h?c sinh.

Tokens:
a / am / I / student

Target:
I am a student.

Question 3:
Meaning:
T?i ??n t? Vi?t Nam.

Tokens:
from / Vietnam / am / I

Target:
I am from Vietnam.

Purpose:
basic sentence construction.

---

# PART 5 ? FREE PRODUCTION

Title:
Ph?n 5: Th?c h?nh t? vi?t & AI Nh?n x?t

Prompt:
Write 2?3 simple English sentences introducing yourself.

Required information:
- name
- student/profession/role
- origin/place

Reference:
"My name is Linh. I am a student. I am from Vietnam."

Current architecture:
free text
? evaluation
? feedback

Current feedback example:
"Tuy?t v?i! B?n ?? ??t chu?n b?i h?c!"

Example feedback:
"B?n ?? vi?t ???c c?c c?u gi?i thi?u b?n th?n r?t chu?n ng? ph?p, d?ng ??ng ??ng t? to-be v? c?u tr?c c? b?n."

Example corrected sentence:
"My name is Linh. I am a student. I am from Vietnam."

Example explanation:
"Danh t?/??i t? + ??ng t? to-be (is/am) + Th?ng tin r? r?ng."

Important:
Current free-production architecture has local deterministic evaluation first and AI fallback for uncertain responses.

---

# LESSON COMPLETION

Current completion screen:

"CLIMB COMPLETE - HO?N TH?NH CH?NG LEO"

Message:
"You can now introduce yourself in English!"

Current completion claim:
"B?n ?? ho?n th?nh tr?n v?n b?i h?c ??u ti?n t?i Base Camp v? l?m ch? c?c m?u c?u t? gi?i thi?u b?n th?n chu?n ng? ph?p."

Current listed abilities:
- Bi?t d?ng "My name is..." chu?n x?c v?i ??ng t? to-be.
- Bi?t d?ng "I am a student..." ??ng m?o t?.
- Bi?t d?ng "I am from Vietnam..." gi?i thi?u qu? qu?n.

---

# CURRENT PEDAGOGICAL STRUCTURE

Current flow:

Teach
? Multiple Choice
? Fill
? Reorder
? Free Production
? Complete

This is a useful V0.1 prototype, but it is still mostly a linear worksheet.

---

# WHAT IS GOOD

The lesson already proves several useful implementation ideas:

1. Progressive lesson stages
2. Clear beginner language
3. Explicit grammar explanation
4. Multiple practice formats
5. Production activity
6. Feedback
7. Completion state
8. Deterministic-first evaluation architecture

These should be preserved conceptually.

---

# WHAT IS MISSING

The current lesson does NOT yet have a complete evidence-based learning loop.

Missing or weak:

1. No real micro pre-check before teaching
2. No adaptive branch for strong vs weak learners
3. Little distinction between recognition and independent production
4. No guided-production stage with gradually decreasing scaffold
5. No genuine novel-context transfer task
6. No delayed retention test
7. No separate mastery decision
8. No evidence-backed reason to say "mastered"
9. No competency-level mastery update
10. Completion percentage is linear rather than mastery-derived

---

# CRITICAL CURRENT OVERCLAIM

The completion screen says:

"You can now introduce yourself in English."

and:

"B?n ?? ... l?m ch? c?c m?u c?u..."

Current evidence is NOT sufficient to make that claim.

Why:

- no delayed retention evidence
- no transfer evidence
- limited independent production evidence
- no pre/post comparison
- no mastery engine

Future system should distinguish:

Lesson:
COMPLETED

from:

Competency:
MASTERED / STILL LEARNING / NEEDS REMEDIATION

---

# FUTURE LESSON 1 TARGET

The reference architecture should become:

Trailhead
?
Micro Pre-check
?
Goal / Why
?
Model
?
Notice
?
Controlled Practice
?
Guided Production
?
Independent Production
?
Transfer
?
Mastery Check
?
Delayed Review

Current Part 1 roughly maps to:
Model + Notice

Current Parts 2?4 roughly map to:
Controlled Practice

Current Part 5 roughly maps to:
Independent Production

Missing:
- Micro Pre-check
- Guided Production
- Transfer
- Mastery Check
- Delayed Retention

---

# FUTURE EVIDENCE GENERATED BY LESSON 1

Potential competencies:

Primary:
BC-P01 Self Introduction

Supporting:
BC-S03 Basic Word Order
BC-G01 Present be
BC-G11 Articles
BC-V01 Personal Vocabulary

Evidence should eventually include:

recognition
controlled
guided production
independent
transfer
retention

---

# FUTURE LESSON SUCCESS CRITERION

Instead of:

"Completed 5/5 sections"

target:

Learner can independently produce a short self-introduction and transfer the basic structures to a new person/context, then retain the skill later.

Initial heuristic:
independent >= 75
transfer >= 70
retention >= 70

These thresholds are provisional and must eventually be calibrated using data.

---

# PRODUCT INTERPRETATION

This lesson should be treated as:

V0.1 vertical slice / prototype

NOT:
production curriculum

NOT:
final lesson template

NOT:
proof of mastery

Its purpose was to prove:
- ZeroClimber navigation
- lesson rendering
- persistence
- local evaluator
- AI fallback
- basic progression

Future architecture should use this lesson as a refactoring target.

