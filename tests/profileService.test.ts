import test from 'node:test';
import assert from 'node:assert/strict';
import { ProfileService, createUnassessedProfile } from '../src/services/profile/profileService';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

globalThis.localStorage = new MemoryStorage();

test('saveProfile preserves an explicitly updated currentEstimatedBand across reload', () => {
  const profile = createUnassessedProfile({
    id: 'test_learner_d1',
    onboardingCompleted: true,
    hasCompletedDiagnostic: true,
    aiEvidenceEstimate: 5.5,
    currentEstimatedBand: 6.2,
  });

  ProfileService.saveProfile(profile);

  const reloaded = ProfileService.getProfile();

  assert.equal(
    reloaded.currentEstimatedBand,
    6.2,
    'currentEstimatedBand must survive save/reload instead of being reset to aiEvidenceEstimate'
  );
});
