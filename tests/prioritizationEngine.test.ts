import test from 'node:test';
import assert from 'node:assert/strict';
import { PrioritizationEngine } from '../src/engine/recommendation/prioritizationEngine';
import { createUnassessedProfile } from '../src/services/profile/profileService';

function createAssessedProfile() {
  return {
    ...createUnassessedProfile({
      onboardingCompleted: true,
      hasCompletedDiagnostic: true,
      assessmentStatus: 'diagnostic_completed'
    }),
    targetBand: 6.5,
    subskillMastery: {
      reading_paraphrase: 45,
      reading_cause_effect: 50,
      reading_detail_inference: 50,
      reading_summary_completion: 50,
      writing_task_response: 50,
      writing_coherence_cohesion: 50,
      writing_lexical_resource: 50,
      writing_complex_grammar: 50,
      cross_paraphrase_transfer: 50,
      cross_argument_logic: 50
    }
  };
}

const retestInSameSession = '\u0073\u1ebd \u0111\u01b0\u1ee3c ki\u1ec3m ch\u1ee9ng b\u1eb1ng Re-Test trong ch\u00ednh phi\u00ean';

test('15-minute recommendation does not promise a retest', () => {
  const result = PrioritizationEngine.getNextBestAction(createAssessedProfile(), {
    availableMinutes: 15
  });

  assert.equal(result.expectedOutcome.includes('Re-Test'), true);
  assert.equal(result.expectedOutcome.includes(retestInSameSession), false);
});

test('20-minute recommendation promises a retest', () => {
  const result = PrioritizationEngine.getNextBestAction(createAssessedProfile(), {
    availableMinutes: 20
  });

  assert.equal(result.expectedOutcome.includes('Re-Test'), true);
  assert.equal(result.expectedOutcome.includes(retestInSameSession), true);
});

test('30-minute recommendation promises a retest', () => {
  const result = PrioritizationEngine.getNextBestAction(createAssessedProfile(), {
    availableMinutes: 30
  });

  assert.equal(result.expectedOutcome.includes('Re-Test'), true);
  assert.equal(result.expectedOutcome.includes(retestInSameSession), true);
});
