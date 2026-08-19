import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSessionDuration } from '../src/engine/session/sessionDraft';

test('persisted session duration takes precedence when resuming a draft', () => {
  assert.equal(resolveSessionDuration(15, 30), 15);
  assert.equal(resolveSessionDuration(30, 15), 30);
});

test('legacy drafts fall back to the current profile preference', () => {
  assert.equal(resolveSessionDuration(undefined, 30), 30);
  assert.equal(resolveSessionDuration('invalid', 15), 15);
});
