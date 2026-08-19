import test from 'node:test';
import assert from 'node:assert/strict';
import { RetestVerificationEngine } from '../src/engine/verification/retestVerification';

test('current two-item retest must not claim verified progress from a non-test mastery baseline', () => {
  const result = RetestVerificationEngine.evaluateRetest({
    pathwayId: 'pathway_paraphrase',
    subskill: 'reading_paraphrase',
    scoreBefore: 50,
    answers: [0, 0],
    expectedAnswers: [0, 0],
    priorAttemptsCount: 3,
    errorPatternName: 'Distortion Trap'
  });

  assert.notEqual(
    result.status,
    'verified_progress',
    'A two-item post-test against a mastery estimate must not be labelled verified progress'
  );
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
