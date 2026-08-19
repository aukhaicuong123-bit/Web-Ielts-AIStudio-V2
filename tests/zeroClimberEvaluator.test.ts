import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateLesson1ProductionLocally } from '../src/features/zeroclimber/ZeroClimberEvaluator';

test('rejects missing article in I am student', () => {
  const result = evaluateLesson1ProductionLocally(
    'I am student. I am from Vietnam.'
  );

  assert.equal(
    result.isCorrect,
    false,
    'Missing article must not receive a correct local evaluation'
  );
});

test('does not treat I am a student as a name component', () => {
  const result = evaluateLesson1ProductionLocally(
    'I am a student. I am from Vietnam.'
  );

  assert.notEqual(
    result.scorePercent,
    95,
    'A role sentence must not satisfy the name component'
  );
});

test('does not mark grammatically broken multi-sentence input as perfect', () => {
  const result = evaluateLesson1ProductionLocally(
    'My name is Linh and I am from Vietnam yesterday I go to school.'
  );

  assert.notEqual(
    result.scorePercent,
    95,
    'Tense/run-on errors must not receive a perfect local score'
  );
});

test('does not call incomplete introduction fully correct when name is absent', () => {
  const result = evaluateLesson1ProductionLocally(
    'I am a student. I am from Vietnam.'
  );

  assert.notEqual(
    result.scorePercent,
    95,
    'An introduction without a name must not receive full local credit'
  );
});


test('accepts a complete valid self-introduction locally', () => {
  const result = evaluateLesson1ProductionLocally(
    'My name is Linh. I am a student. I am from Vietnam.'
  );

  assert.equal(result.isDeterminedLocally, true);
  assert.equal(result.isCorrect, true);
  assert.equal(result.scorePercent, 95);
});
