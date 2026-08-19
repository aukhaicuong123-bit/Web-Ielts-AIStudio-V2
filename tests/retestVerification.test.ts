import test from 'node:test';
import assert from 'node:assert/strict';
import { RetestVerificationEngine } from '../src/engine/verification/retestVerification';
import { createUnassessedProfile } from '../src/services/profile/profileService';

test('two-item retest does not claim verified progress without a meaningful gain', () => {
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 90,
    answers: [0, 0],
    expectedAnswers: [0, 0],
    priorAttemptsCount: 3,
    errorPatternName: 'Distortion Trap'
  });

  assert.notEqual(
    result.status,
    'verified_progress',
    'A perfect two-item result without a meaningful baseline gain must not be labelled verified progress'
  );
});

test('two-item retest verifies only a complete result with at least a 20-point gain', () => {
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 50,
    answers: [0, 0],
    expectedAnswers: [0, 0],
    baselineType: 'mastery_estimate',
    errorPatternName: 'Distortion Trap'
  });

  assert.equal(result.status, 'verified_progress');
  assert.equal(result.scoreAfter, 100);
  assert.equal(result.improvementDelta, 50);
});

test('two-item retest records partial progress for a partially correct result', () => {
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 40,
    answers: [0, 1],
    expectedAnswers: [0, 0],
    baselineType: 'mastery_estimate',
    errorPatternName: 'Distortion Trap'
  });

  assert.equal(result.status, 'partial_progress');
  assert.equal(result.scoreAfter, 50);
  assert.equal(result.improvementDelta, 10);
});

test('two-item retest records unsuccessful progress when no answer is correct', () => {
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 50,
    answers: [1, 1],
    expectedAnswers: [0, 0],
    baselineType: 'mastery_estimate',
    errorPatternName: 'Distortion Trap'
  });

  assert.equal(result.status, 'needs_practice');
  assert.equal(result.scoreAfter, 0);
});

test('incomplete retest input cannot produce a successful outcome', () => {
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 20,
    answers: [0],
    expectedAnswers: [0, 0],
    baselineType: 'mastery_estimate',
    errorPatternName: 'Distortion Trap'
  });

  assert.equal(result.status, 'needs_practice');
  assert.equal(result.scoreAfter, 0);
  assert.equal(result.evidenceCount?.retests, 1);
});

function profileForRetest() {
  return createUnassessedProfile({
    onboardingCompleted: true,
    hasCompletedDiagnostic: true,
    assessmentStatus: 'diagnostic_completed',
    subskillMastery: {
      ...createUnassessedProfile().subskillMastery,
      reading_paraphrase: 40,
    },
    activeErrors: [{
      id: 'err_paraphrase',
      code: 'ERR_PARAPHRASE_DISTORTION',
      category: 'Reading Comprehension',
      name: 'Distortion Trap',
      subskill: 'reading_paraphrase',
      severity: 'high',
      count: 3,
      lastEncountered: 'Hôm nay'
    }],
    errorPatterns: [{
      id: 'pattern_paraphrase',
      code: 'ERR_PARAPHRASE_DISTORTION',
      category: 'Reading Comprehension',
      name: 'Distortion Trap',
      subskill: 'reading_paraphrase',
      severity: 'high',
      frequency: 3,
      firstDetected: 'Hôm qua',
      lastDetected: 'Hôm nay',
      trend: 'persistent',
      resolved: false,
      interventionCount: 0
    }],
    reTestHistory: [],
    recentActivity: [],
    minutesStudiedToday: 0,
    completedSessions: 0,
  });
}

test('verified progress resolves active errors, updates mastery, and persists history', () => {
  const profile = profileForRetest();
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 40,
    answers: [0, 0],
    expectedAnswers: [0, 0],
    baselineType: 'mastery_estimate',
    errorPatternName: 'Distortion Trap'
  });

  const updated = RetestVerificationEngine.applyVerificationToProfile(profile, result);

  assert.equal(updated.activeErrors.length, 0);
  assert.equal(updated.errorPatterns?.[0].resolved, true);
  assert.ok(updated.subskillMastery.reading_paraphrase > profile.subskillMastery.reading_paraphrase);
  assert.equal(updated.reTestHistory[0].id, result.id);
  assert.equal(updated.recentActivity[0].type, 'retest');
  assert.equal(updated.completedSessions, 0);
  assert.equal(updated.minutesStudiedToday, 0);
});

test('partial progress reduces active error pressure and marks the pattern improving', () => {
  const profile = profileForRetest();
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 40,
    answers: [0, 1],
    expectedAnswers: [0, 0],
    baselineType: 'mastery_estimate',
    errorPatternName: 'Distortion Trap'
  });

  const updated = RetestVerificationEngine.applyVerificationToProfile(profile, result);

  assert.equal(updated.activeErrors[0].count, 2);
  assert.equal(updated.errorPatterns?.[0].trend, 'improving');
  assert.equal(updated.errorPatterns?.[0].interventionCount, 1);
  assert.equal(updated.reTestHistory.length, 1);
});

test('unsuccessful progress preserves active errors and still records the attempt', () => {
  const profile = profileForRetest();
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 40,
    answers: [1, 1],
    expectedAnswers: [0, 0],
    baselineType: 'mastery_estimate',
    errorPatternName: 'Distortion Trap'
  });

  const updated = RetestVerificationEngine.applyVerificationToProfile(profile, result);

  assert.equal(updated.activeErrors[0].count, 3);
  assert.equal(updated.errorPatterns?.[0].resolved, false);
  assert.equal(updated.reTestHistory.length, 1);
  assert.equal(updated.recentActivity[0].type, 'retest');
});

test('a genuinely strong matched assessment may still be classified as verified progress', () => {
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 55,
    answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expectedAnswers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    priorAttemptsCount: 3,
    errorPatternName: 'Distortion Trap',
    baselineType: 'matched_assessment'
  });

  assert.equal(
    result.status,
    'verified_progress'
  );
});
