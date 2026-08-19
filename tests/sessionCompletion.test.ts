import test from 'node:test';
import assert from 'node:assert/strict';
import { createUnassessedProfile } from '../src/services/profile/profileService';
import { applySessionCompletionOnce } from '../src/engine/session/sessionCompletion';
import { resolveSessionDuration } from '../src/engine/session/sessionDraft';

test('15-minute quick completion records one session and 15 minutes', () => {
  const profile = createUnassessedProfile();
  const result = applySessionCompletionOnce(profile, 15);

  assert.equal(result.recorded, true);
  assert.equal(result.profile.completedSessions, 1);
  assert.equal(result.profile.minutesStudiedToday, 15);
});

test('20-minute completion records one session and 20 minutes', () => {
  const profile = createUnassessedProfile();
  const result = applySessionCompletionOnce(profile, 20);

  assert.equal(result.profile.completedSessions, 1);
  assert.equal(result.profile.minutesStudiedToday, 20);
});

test('30-minute completion records one session and 30 minutes', () => {
  const profile = createUnassessedProfile();
  const result = applySessionCompletionOnce(profile, 30);

  assert.equal(result.profile.completedSessions, 1);
  assert.equal(result.profile.minutesStudiedToday, 30);
});

test('a Re-Test result does not add a second session completion', () => {
  const profile = createUnassessedProfile({ completedSessions: 1, minutesStudiedToday: 20 });
  const result = applySessionCompletionOnce(profile, 20, '2026-08-19T10:00:00.000Z');

  assert.equal(result.recorded, false);
  assert.equal(result.profile.completedSessions, 1);
  assert.equal(result.profile.minutesStudiedToday, 20);
});

test('duplicate completion callbacks are idempotent after the first marker is persisted', () => {
  const profile = createUnassessedProfile();
  const first = applySessionCompletionOnce(profile, 30);
  const second = applySessionCompletionOnce(
    first.profile,
    30,
    '2026-08-19T10:00:00.000Z'
  );

  assert.equal(first.profile.completedSessions, 1);
  assert.equal(first.profile.minutesStudiedToday, 30);
  assert.equal(second.recorded, false);
  assert.equal(second.profile.completedSessions, 1);
  assert.equal(second.profile.minutesStudiedToday, 30);
});

test('resumed drafts use their persisted session duration for completion', () => {
  assert.equal(resolveSessionDuration(15, 30), 15);
  assert.equal(resolveSessionDuration(20, 30), 20);
  assert.equal(resolveSessionDuration(30, 15), 30);
});
