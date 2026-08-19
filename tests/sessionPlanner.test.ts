import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSessionPlan } from '../src/engine/session/sessionPlanner';
import { PathwayStep } from '../src/types';

const steps: PathwayStep[] = [
  {
    stepNumber: 1,
    title: 'Recognition',
    type: 'recognition',
    instruction: 'Recognize',
    content: {},
  },
  {
    stepNumber: 2,
    title: 'Transformation',
    type: 'transformation',
    instruction: 'Transform',
    content: {},
  },
  {
    stepNumber: 3,
    title: 'Transfer',
    type: 'transfer',
    instruction: 'Transfer',
    content: {},
  },
  {
    stepNumber: 4,
    title: 'Re-Test',
    type: 'retest',
    instruction: 'Verify',
    content: {},
  },
];

test('15-minute session is a quick intervention without retest', () => {
  const plan = buildSessionPlan(steps, 15);

  assert.deepEqual(plan.stepIndexes, [0, 1, 2]);
  assert.equal(plan.includesRetest, false);
  assert.equal(plan.mode, 'quick');
});

test('20-minute session contains the complete pathway including retest', () => {
  const plan = buildSessionPlan(steps, 20);

  assert.deepEqual(plan.stepIndexes, [0, 1, 2, 3]);
  assert.equal(plan.includesRetest, true);
  assert.equal(plan.mode, 'standard');
});

test('30-minute session keeps the complete pathway as a deep session', () => {
  const plan = buildSessionPlan(steps, 30);

  assert.deepEqual(plan.stepIndexes, [0, 1, 2, 3]);
  assert.equal(plan.includesRetest, true);
  assert.equal(plan.mode, 'deep');
});
